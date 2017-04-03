import {database as db} from './startup';
import {Nearby} from './nearby';
// import {Searcher} from './search';
import SpotifyApi from 'spotify-web-api-node';
import {groupBy} from './helpers';
import request from 'request-promise';

const SPOTIFY_BASE = 'https://api.spotify.com/v1/users/';

function fixPlaylist(playlist) {
  // For... reasons, we end up with the radius twice
  return Object.assign({}, playlist.toJSON(), {radius: undefined});
}


export class Playlist {

  constructor(userId,
              accessToken) {
    this.userId = userId;
  }

  async getAllPreferencesForPlaylist(playlistId) {
    /* eslint-disable max-len*/
    return db.sequelize.query(`
      SELECT pr.*
      FROM troubadour_user u
      JOIN (select party_location,radius
        from playlist where playlist_id=:playlist_id) locations
        ON ST_DWITHIN(locations.party_location, u.last_location, locations.radius)
      JOIN preference pr
        ON pr.user_id = u.user_id;
    `,
    /* eslint-enable max-len*/
     {
      model: db.Preference,
      replacements: {
        playlist_id: playlistId,
      },
    });
  }

  async getPlaylists() {
    let temp = await db.Playlist.findAll({
      where: {created_by: this.userId},
      attributes: {exclude: ['created_by']},
    });

    return temp.map(fixPlaylist);
  }

  async deletePlaylist(apiKey, playlistId) {
    let spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(apiKey);
    let user = await spotifyApi.getMe();
    user = user.body;
    await spotifyApi.unfollowPlaylist(user.id, playlistId);
    await db.Playlist.destroy({
      where: {playlist_id: playlistId},
    });
    return true;
  }

  async deletePlaylists(apiKey) {
    let spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(apiKey);

    let user = await spotifyApi.getMe();
    user = user.body;

    let playlists = await db.Playlist.findAll({
      attributes: ['playlist_id'],
      where: {created_by: this.userId},
    });


    let deletePromises = playlists
      .map((x) => x.playlist_id)
      .map((x) => spotifyApi.unfollowPlaylist(user.id, x));
    deletePromises.push(
      db.Playlist.destroy({where:
        {created_by: this.userId},
      }));
    await Promise.all(deletePromises);
    return true;
  }

  async updatePlaylist(playlistId, playlist) {
    let results = await db.Playlist.update({
      party_location: {
        lat: playlist.lat,
        long: playlist.long,
        radius: playlist.radius,
      },
      in_progress: playlist.in_progress,
    }, {
      where: {playlist_id: playlistId},
      returning: true,
    });
    console.log('Here');
    return fixPlaylist(results[1][0]);
  }

  async createPlaylist(apiKey, {lat, long, radius=30, preferences}) {
    if(!preferences) {
      let temp = await new Nearby().getPreferences({lat, long}, radius);
      preferences = temp.map((x) => x.spotify_uri);
    }
    // aggregation
    let seeds = await this.aggregatePreferences(preferences);
    // spotify
    const spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(apiKey);
    let tracks = await this.getTracksFromSeeds(spotifyApi, seeds);
    let [user, playlist] = await this.createEmptyPlaylist(spotifyApi);

    let promises = [];
    promises.push(this.
                  addTracksToPlaylist(apiKey, user.id, playlist.id, tracks));

    let promise = db.Playlist.findOrCreate({
      where: {
        playlist_id: playlist.id,
      },
      defaults: {
        created_by: this.userId,
        in_progress: true,
        party_location: {lat, long, radius},
      },
    });
    promises.push(promise);
    let [_, result] = await Promise.all(promises); //eslint-disable-line
    result = result[0];
    return fixPlaylist(result);
  }

  async getTracksFromSeeds(spotifyApi, seeds) {
    let groupedSeeds = groupBy(seeds,
                            (uri) => uri.split(':')[1], // grabs the type
                            (uri) => uri.split(':')[2]); // grabs the id)
    let tracks = await spotifyApi.getRecommendations({
      'seed_artists': groupedSeeds.artist,
      'seed_genres': groupedSeeds.genre,
      'seed_tracks': groupedSeeds.track,
      'seed_albums': groupedSeeds.album,
    });
    return tracks.body.tracks.map((x) => x.uri);
  }

  async addTracksToPlaylist(apiKey, userId, playlistId, tracks) {
    // don't use spotify-api-node b/c it is broken
    const uriEncode = encodeURIComponent;
    const url = SPOTIFY_BASE +
      `${uriEncode(userId)}/playlists/${uriEncode(playlistId)}/tracks`;

    return await request
              .post(url, {
                headers: {'Authorization': `Bearer ${apiKey}`},
                body: {uris: tracks},
                json: true,
              }); //eslint-disable-line
  }

  async createEmptyPlaylist(spotifyApi) {
    let user = await spotifyApi.getMe();
    user = user.body;
    // TODO: Name the playlist better
    let playlist = await spotifyApi.createPlaylist(user.id,
                                                    'Troubadour Test');
    return [user, playlist.body];
  }

  async aggregatePreferences(spotifyUris) {
    if(spotifyUris.length <= 5) {
      return spotifyUris;
    } else {
      // squashing code here
      // Spotify call to get all artists and albums for each track
      // Merge those into the original lists and do a call to get all info for
      // albums and artists
      // Merge the genres off of the albums and artists into the genres list and
      // Merge the artists of the albums into the artists list
      // Do a final pass over the entire structure to get (running totals):
      // {artists: [{uri: "", count: 2, ratio: 0.2}],
      //  genres: [{uri: "", count: 7, ratio: 0.3}]
      //  Do a filter on each list of ratio < SOME_CONSTANT
      //  NOTE: It might be more efficient to do the filter while doing the
      //    totals, but it might get messy.
      // Sort by count and take top 3 artists and top 2 genres
      // Or for now...
      return spotifyUris.slice(0, 4);
    }
  }
}

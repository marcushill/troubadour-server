import {database as db} from './startup';
import {Nearby} from './nearby';

export class Playlist {

  constructor(userId) {
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
      attributes: {exclude: ['created_by']}
    });

    return temp.map(x => {
      return Object.assign({}, x.toJSON(), { radius: undefined });
    });

  }

  async createPlaylist(apiKey, {lat, long, radius=30, preferences}) {

    if(!preferences){
      let temp = await new Nearby().getPreferences(location, radius);
      preferences = temp.map(x => x.spotify_uri);
    }
    // aggregation
    // spotify
  }
}

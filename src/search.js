import SpotifyApi from 'spotify-web-api-node';
import Levenshtein from 'levenshtein';

function groupBy(array, keyFunc=(x)=> x, valueFunc=(x)=> x) {
  // returns an object of {key: []} where key is returned by keyFunc
  return array.reduce((obj, current) => {
    let key = keyFunc(current);
    if(!(key in obj)) {
      obj[key] = [];
    }
    obj[key].push(valueFunc(current));
    return obj;
  }, {});
}

function getTermSortFunc(term) {
  return (a, b) => {
    // Grab the String distance of a and b
    // If the search term is a prefix of this particular item,
    // it gets a -.5 boost.
    // To see why, look at the following example.
    // term = 'Appl'
    // 'Apple' and 'Appt' both have a string distance of 1, but we
    // would like to prefer strings that are a prefix so this will give
    // 'Apple' a string distance of .5 and Appt a string distance of
    // 1 so that 'Apple comes first'.
    let levA = new Levenshtein(term, a.name).distance;
    levA -= a.name.startsWith(term) ? .5 : 0;
    let levB = new Levenshtein(term, b.name).distance;
    levB -= b.name.startsWith(term) ? .5 : 0;


     if (levA == levB) {
        return a.popularity - b.popularity;
     }

     return levA - levB;
  };
}


export default class Searcher {

  constructor(clientId=process.env.SPOTIFY_CLIENT,
              clientSecret=process.env.SPOTIFY_SECRET) {
    this.spotifyApi = new SpotifyApi({
      clientId: clientId,
      clientSecret: clientSecret,
    });


    // Retrieve an access token.
    this.spotifyApi.clientCredentialsGrant()
      .then((data) => {
        // Save the access token so that it's used in future calls
        this.spotifyApi.setAccessToken(data.body['access_token']);
      })
      .catch((err) => {
          console.log('Something went wrong when retrieving an access token',
            err);
      });
  }

  async search(term, page) {
    const params = {};
    this.term = term;

    if(Number.isInteger(page) && page > 0) {
      page = page -1;
      params.limit = 20;
      params.offet = 20 * page;
    }

    let result = await this.spotifyApi
                           .search(term, ['album', 'artist', 'track'], params);

    const data = result.body;
    let output = {
        artists: data.artists.items.
            map(this._transformSpotifyObj.bind(this)),
        tracks: data.tracks.items.map(this._transformSpotifyObj.bind(this)),
        albums: data.albums.items.map(this._transformSpotifyObj.bind(this)),
    };

    for(let key of Object.keys(output)) {
      output[key] = output[key]
        .sort(getTermSortFunc(term));
    }

    return output;
  }

  async fromSpotifyUris(spotfyUris) {
    let uriByType = groupBy(
      spotfyUris,
      (uri) => uri.split(':')[1], // grabs the type from the uri
      (uri) => uri.split(':')[2] // grabs the id
    );

    let promises = [];
    if (uriByType.artist) {
      let promise = this.spotifyApi
              .getArtists(uriByType.artist)
              .then((result) => {
                return {
                  artists: result.body.artists,
                };
              } );
      promises.push(promise);
    }

    if (uriByType.track) {
      let promise = this.spotifyApi
              .getTracks(uriByType.track)
              .then((result) => {
                return {
                  tracks: result.body.tracks,
                };
              });
      promises.push(promise);
    }

    if (uriByType.album) {
      let promise = this.spotifyApi
              .getAlbums(uriByType.album)
              .then((result) => {
                return {
                  albums: result.body.albums,
                };
              });
      promises.push(promise);
    }

    let finished = await Promise.all(promises);
    let data = finished.reduce((out, item) => {
      return Object.assign(out, item);
    }, {
      artists: [],
      albums: [],
      tracks: [],
      //genres: []
    });

    for(let key in data) { // eslint-disable-line guard-for-in
      data[key] = data[key].map(this._transformSpotifyObj.bind(this));
    }
    return data;
  }

  _transformSpotifyObj(obj) {
    let data = {
      spotify_id: obj.id,
      images: obj.images || [],
      type: obj.type,
      name: obj.name,
      uri: obj.uri,
    };

    if(obj.type === 'track' || obj.type == 'album') {
      data.artists = obj.artists.map(this._transformSpotifyObj.bind(this));
    }

    return data;
  }
}

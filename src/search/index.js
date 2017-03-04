import SpotifyApi from 'spotify-web-api-node';

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

  search(term, page) {
    const params = {};

    if(Number.isInteger(page)) {
      params.limit = 20;
      params.offet = 20 * page;
    }
    return this.spotifyApi.search(term, ['album', 'artist', 'track'], params)
      .then((result) => {
        const data = result.body;
        const albumObjs = data.albums.items.map(this._transformSpotifyObj);
        const combined = albumObjs.concat(
          data.artists.items.map(this._transformSpotifyObj),
          data.tracks.items.map(this._transformSpotifyObj)
        );

        return combined;
      });
  }

  _transformSpotifyObj(obj) {
    return {
      spotify_id: obj.id,
      images: obj.images,
      type: obj.type,
      name: obj.name,
      uri: obj.uri,
    };
  }
}

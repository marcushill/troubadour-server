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

    if(Number.isInteger(page)){
      params.limit = 20;
      params.offet = 20 * page;
    }
    return this.spotifyApi.search(term, ['album', 'artist', 'track'])
      .then((result) => {
        return result;
      });
  }
}

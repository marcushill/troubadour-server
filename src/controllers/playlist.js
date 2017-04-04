import {Router} from 'express';
import {requireHeader} from '../middleware';
import {Playlist} from '../playlist';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

app.use(requireHeader({
  header_name: 'X-API-KEY',
  error_message: `Missing Header: X-API-KEY`,
}));

/* eslint-disable max-len */
/**
 * @api {get} /playlist Get Playlists
 * @apiName Get User's Playlists
 * @apiGroup Playlist
 * @apiHeader {String} X-USER-ID The ID of the current user
 * @apiHeader {String} X-API-KEY The Spotify API Key to use for this request
 *
 * @apiSuccess {Object[]} data A list of Playlists for this user
 * @apiSuccess {Object} data.item An individual playlist
 * @apiSuccess {String} data.item.playlist_id The Spotify ID of the Playlist
 * @apiSuccess {Boolean} data.item.in_progress Whether or not the party is updating
 * @apiSuccess {Object} data.item.party_location The location of the party
 * @apiSuccess {Number} data.item.party_location.lat Latitude
 * @apiSuccess {Number} data.item.party_location.long Longitude
 * @apiSuccess {Number} data.item.party_location.radius Radius of the fence
 *
 * @apiExample Example usage:
 *  GET /playlist
 * @apiSuccessExample {json} Success-Response:
 * {
    "data": [
        {
             "playlist_id": "some party id",
             "in_progress":  true,
             "party_location": {
                 "lat": 51.012,
                 "long": 52.0123,
                 "radius": 30
             }
        }
    ]
  }
 */
 /* eslint-disable max-len */
app.get('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    // let apiKey = req.get('X-API-KEY');
    let playlists = await new Playlist(userId).getPlaylists();
    resp.json({data: playlists});
  } catch (error) {
    resp.status(500).json({error: error.message});
}
});

/* eslint-disable max-len */
/**
 * @api {POST} /playlist Create Playlist
 * @apiName Create A New Troubadour Playlist
 * @apiGroup Playlist
 * @apiHeader {String} X-USER-ID The ID of the current user
 * @apiHeader {String} X-API-KEY The Spotify API Key to use for this request
 *
 * @apiParam {Object} body
 * @apiParam {Number} body.lat Latitude
 * @apiParam {Number} body.long Longitude
 * @apiParam {Number} [body.radius] The radius of the fence IN METERS. Defaults to 30
 * @apiParam {String[]} [body.preferences] A list of Spotify uris to override the nearby preferences
 *
 * @apiSuccess {Object} data The created playist
 * @apiSuccess {Object} data An individual playlist
 * @apiSuccess {String} data.playlist_id The Spotify ID of the Playlist
 * @apiSuccess {Boolean} data.in_progress Whether or not the party is updating
 * @apiSuccess {Object} data.party_location The location of the party
 * @apiSuccess {Number} data.party_location.lat Latitude
 * @apiSuccess {Number} data.party_location.long Longitude
 * @apiSuccess {Number} data.party_location.radius Radius of the fence
 * @apiSuccess {String} data.created_by Should match X-USER-ID
 *
 * @apiExample Example usage:
 *  POST /playlist
 * @apiSuccessExample {json} Success-Response:
 * {
    "data":  {
       "playlist_id": "some party id",
       "in_progress":  true,
       "created_by"; "this user"
       "party_location": {
           "lat": 51.012,
           "long": 52.0123,
           "radius": 30
       }
    }
  }
 */
 /* eslint-disable max-len */
app.post('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let apiKey = req.get('X-API-KEY');
    let playlists = await new Playlist(userId)
      .createPlaylist(apiKey, req.body);
    resp.status(201).json({data: playlists});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

/* eslint-disable max-len */
/**
 * @api {PUT} /playlist/:playlistId Update Playlist
 * @apiName Update an existing Troubadour Playlist
 * @apiGroup Playlist
 * @apiHeader {String} X-USER-ID The ID of the current user
 * @apiHeader {String} X-API-KEY The Spotify API Key to use for this request
 *
 * @apiParam :playlistId The id returned by GET /playlist or /POST playlist
 * @apiParam {Object} body
 * @apiParam {Number} [body.lat] Latitude
 * @apiParam {Number} [body.long] Longitude
 * @apiParam {Number} [body.radius] The radius of the fence IN METERS. Defaults to 30
 * @apiParam {Boolean} [body.in_progress] Whether or not the party is considered active
 *
 * @apiSuccess {Object[]} data A list of Playlists for this user
 * @apiSuccess {Object} data.item An individual playlist
 * @apiSuccess {String} data.item.playlist_id The Spotify ID of the Playlist
 * @apiSuccess {Boolean} data.item.in_progress Whether or not the party is updating
 * @apiSuccess {Object} data.party_location The location of the party
 * @apiSuccess {Number} data.item.party_location.lat Latitude
 * @apiSuccess {Number} data.item.party_location.long Longitude
 * @apiSuccess {Number} data.item.party_location.radius Radius of the fence
 * @apiSuccess {String} data.item.created_by Should match X-USER-ID
 *
 * @apiExample Example usage:
 *  PUT /playlist/party2
 * @apiSuccessExample {json} Success-Response:
 * {
    "data":  {
       "playlist_id": "party2",
       "in_progress":  true,
       "created_by"; "this user"
       "party_location": {
           "lat": 51.012,
           "long": 52.0123,
           "radius": 30
       }
    }
  }
 */
 /* eslint-disable max-len */
app.put('/:playlistId', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let playlists = await new Playlist(userId)
      .updatePlaylist(req.params.playlistId, req.body);
    resp.json({data: playlists});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

/* eslint-disable max-len */
/**
 * @api {DELETE} /playlist/:playlistId Delete Playlist
 * @apiName Delete a specific Troubadour Playlist
 * @apiGroup Playlist
 * @apiHeader {String} X-USER-ID The ID of the current user
 * @apiHeader {String} X-API-KEY The Spotify API Key to use for this request
 *
 * @apiParam :playlistId The id returned by GET /playlist or /POST playlist
 *
 * @apiSuccess {Boolean} data The success status of the operation
 *
 * @apiExample Example usage:
 *  DELETE /playlist/party2
 * @apiSuccessExample {json} Success-Response:
 * {
    "data":  true
  }
 */
 /* eslint-disable max-len */
app.delete('/:playlistId', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let apiKey = req.get('X-API-KEY');
    let result = await new Playlist(userId)
      .deletePlaylist(apiKey, req.params.playlistId);
    resp.json({data: result});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

/* eslint-disable max-len */
/**
 * @api {DELETE} /playlist/:playlistId Delete Playlists
 * @apiName Delete ALL Troubadour Playlists
 * @apiGroup Playlist
 * @apiHeader {String} X-USER-ID The ID of the current user
 * @apiHeader {String} X-API-KEY The Spotify API Key to use for this request
 *
 * @apiParam :playlistId The id returned by GET /playlist or /POST playlist
 *
 * @apiSuccess {Boolean} data The success status of the operation
 *
 * @apiExample Example usage:
 *  DELETE /playlist
 * @apiSuccessExample {json} Success-Response:
 * {
    "data":  true
  }
 */
 /* eslint-disable max-len */
app.delete('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let apiKey = req.get('X-API-KEY');
    let result = await new Playlist(userId)
      .deletePlaylists(apiKey);
    resp.json({data: result});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});


export default app;

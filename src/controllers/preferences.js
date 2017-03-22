import {Router} from 'express';
import {requireHeader} from '../middleware';
import {Preferences} from '../preferences';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/**
 * @api {get} /preferences Get Preferences
 * @apiName Get User Preferences
 * @apiGroup Preferences
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiSuccess {Object} data Standard Wrapper for response arrays
 * @apiSuccess {Object[]} data.artists
 * @apiSuccess {Object[]} data.albums
 * @apiSuccess {Object[]} data.tracks
 *
 * @apiExample Example usage:
 *  GET /preferences
 */
app.get('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let data = await new Preferences(userId).getAll();
    resp.json({data});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

/**
 * @api {put} /preferences Update Preferences
 * @apiName Update User Preferences
 * @apiGroup Preferences
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {Object[]} body The list of preferences to add
 * @apiParam {Object} body.item A single preference
 * @apiParam {String} body.item.spotify_uri A string representing the
 *      Spotify uri
 * @apiParam {String} body.item.name A user readable representation of the
 *      preference
 * @apiExample Example usage:
 *  PUT /preferences
 *  [
 *   {name: "Beyoncé", spotify_uri: "spotify:artist:6vWDO969PvNqNYHIOW5v0m"}
 *  ]
 */
app.put('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let body = req.body;
    let data = await new Preferences(userId).add(body);
    resp.json({data});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

/**
 * @api {delete} /preferences Delete Preferences
 * @apiName Delete User Preferences
 * @apiGroup Preferences
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {String[]} body The list of preferences to add
 * @apiParam {Object} body.item A string representing the Spotify uri
 * @apiExample Example usage:
 *  DELETE /preferences
 *  [
 *   "spotify:artist:6vWDO969PvNqNYHIOW5v0m"
 *  ]
 */
app.delete('/', async (req, resp) => {
  let userId = req.get('X-USER-ID');
  let body = req.body;
  let data = await new Preferences(userId).delete(body);
  resp.json({data});
});

export default app;

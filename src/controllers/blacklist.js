import {Router} from 'express';
import {requireHeader} from '../middleware';
import {UserBlacklist} from '../blacklist';


const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/**
 * @api {get} /user/blacklist Get Blacklist
 * @apiName Get User Blacklist
 * @apiGroup Blacklist
 * @apiDescription Gets the user's blacklisted preferences
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiSuccess {Object} data Standard Wrapper for response arrays
 * @apiSuccess {Object[]} data.artists
 * @apiSuccess {Object[]} data.albums
 * @apiSuccess {Object[]} data.tracks
 * @apiSuccess {Object[]} data.genres
 *
 * @apiExample Example usage:
 *  GET /user/blacklist
 */
app.get('/', async (req, resp) => {
  let userId = req.get('X-USER-ID');
  let data = await new UserBlacklist(userId).getAll();
  resp.json({data});
});

/* eslint-disable max-len */
/**
 * @api {put} /user/blacklist Update Blacklist
 * @apiName Update User Blacklist
 * @apiGroup Blacklist
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {Object[]} blacklist The list of preferences to add
 * @apiParam {Object} blacklist.item A single preference
 * @apiParam {String} blacklist.item.spotify_uri A string representing the
 *      Spotify uri
 * @apiParam {String} blacklist.item.name A user readable representation of the
 *      preference
 * @apiExample Example usage:
 *  PUT /user/blacklist
 *  [
 *   {name: "Beyoncé", spotify_uri: "spotify:artist:6vWDO969PvNqNYHIOW5v0m"}
 *  ]
 */
 /* eslint-enable max-len */
app.put('/', async (req, resp) => {
  let userId = req.get('X-USER-ID');
  let body = req.body;
  let data = await new UserBlacklist(userId).add(body);
  resp.json({data});
});

/**
 * @api {delete} /user/blacklist?ids=:ids Delete Preferences
 * @apiName Delete User Blacklist
 * @apiGroup Blacklist
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {String[]} ids The list of preferences to delete
 * @apiParam {Object}  ids.item A string representing the Spotify uri
 * @apiExample Example usage:
 *  DELETE /user/blacklist?ids=spotify:artist:6vWDO969PvNqNYHIOW5v0m,
 *   spotify:artist:23zg3TcAtWQy7J6upgbUnj
 */
app.delete('/', async (req, resp) => {
  let userId = req.get('X-USER-ID');
  let ids = req.query.ids.split(',');
  let data = await new UserBlacklist(userId).delete(ids);
  resp.json({data});
});


export default app;

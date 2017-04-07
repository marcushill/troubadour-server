import {Router} from 'express';
import {requireHeader} from '../middleware';
import {User} from '../user';
import locationController from './location';


const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/* eslint-disable max-len */
/**
 * @api {GET} /user Get User
 * @apiName Get User Details
 * @apiGroup User
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiSuccess {Object} data
 * @apiSuccess {Object} data.last_location Object representing the user's last location
 * @apiSuccess {Number} data.last_location.lat The latitude
 * @apiSuccess {Number} data.last_location.long The longitude
 * @apiSuccess {String} data.user_id Should match X-USER-ID
 * @apiSuccess {String} data.spotify_id The user's Spotify id.
 * @apiSuccess {String} data.updated_at A String in the ISO Date format
 *
 * @apiExample Example usage:
 * GET /user
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "data": {
      "last_location": {
        "lat": 33.2005847,
        "long": -87.5228543
      },
      "user_id": "some user id",
      "spotify_id": null,
      "updated_at": "2017-04-06T20:05:33.940Z"
    }
 * }
 */
 /* eslint-enable max-len */
app.get('/', async (req, resp) => {
    let userId = req.get('X-USER-ID');
    let user = await new User(userId).get();
    if (user === null) {
      resp.status(404).json({error: `User ${userId} does not exist.`});
    } else {
      resp.json({data: user});
    }
});


/* eslint-disable max-len */
/**
 * @api {GET} /user Get User
 * @apiName Get User Details
 * @apiGroup User
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiSuccess {Object} data
 * @apiSuccess {Boolean} created Whether the user had to be created
 *
 * @apiExample Example usage:
 * POST /user
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "data": {
 *       "created": true
 *    }
 * }
 */
 /* eslint-enable max-len */
app.post('/', async (req, resp) => {
    let userId = req.get('X-USER-ID');
    let created = await new User(userId).create();
    resp.status(created ? 201: 304);
    return resp.json({data: {created: created}});
});

app.use('/location', locationController);

export default app;

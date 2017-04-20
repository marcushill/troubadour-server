import {Router} from 'express';
import {Nearby} from '../nearby';
import {requireHeader} from '../middleware';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));
/**
 * @api {get} /nearby?lat=:lat&long=:long Nearby
 * @apiName Nearby Preferences
 * @apiGroup Nearby
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {Number} lat The latitude
 * @apiParam {Number} long The longitude
 * @apiParam {Number} [radius] The radius of the circle to use
 *    (measured in meters)
 * @apiExample Example usage:
 *    GET /nearby?lat=51.5033640&long=-0.1276250
 */
app.get('/', async (req, resp) => {
    let loc = {lat: req.query.lat, long: req.query.long};
    let userId = req.get('X-USER-ID');
    let data = await new Nearby(userId)
            .getDistinctPreferences(loc, req.query.radius);
    resp.json({data});
});

export default app;

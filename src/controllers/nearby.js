import {Router} from 'express';
import {Nearby} from '../nearby';

const app = new Router();

/**
 * @api {get} /nearby?lat=:lat&long=:long Nearby
 * @apiName Nearby Preferences
 * @apiGroup Nearby
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
    let data = await new Nearby().getPreferences(loc, req.query.radius);
    resp.json({data});
});

export default app;

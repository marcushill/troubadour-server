import {Router} from 'express';
import {requireHeader} from '../middleware';
import {User} from '../user';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/**
 * @api {PUT} /location Update Location
 * @apiName Update a User's Location
 * @apiGroup Location
 * @apiHeader {String} X-USER-ID The ID of the current user
 *
 * @apiParam {Number} lat The latitude
 * @apiParam {Number} long The longitude
 * @apiExample Example usage:
 *    PUT /location
 *    {
 *      "lat": 50.1,
 *      "long": -10.1
 *    }
 */
app.put('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let body = req.body;
    let data = await new User(userId).updateLocation(body);
    if(data) {
      resp.json({data: 'sent'});
    }
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

export default app;

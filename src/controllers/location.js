import {Router} from 'express';
import {requireHeader} from '../middleware';
import {User} from '../user';
import {TroubadourError} from '../helpers';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/**
 * @api {PUT} /user/location Update Location
 * @apiName Location
 * @apiGroup User
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
    let userId = req.get('X-USER-ID');
    let body = req.body;
    let data = await new User(userId).updateLocation(body);
    if(data) {
      resp.json({data: 'sent'});
    } else {
      throw new TroubadourError('Something went wrong. ;(');
    }
});


export default app;

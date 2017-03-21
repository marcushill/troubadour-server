import {Router} from 'express';
import {requireHeader} from '../middleware';
import {UserLocation} from '../location';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

app.put('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let body = req.body;
    let data = await new UserLocation(userId).update(body);
    resp.json({data});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

export default app;

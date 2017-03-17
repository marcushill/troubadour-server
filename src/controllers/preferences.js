import {Router} from 'express';
import {requireHeader} from '../middleware';
import {Preferences} from '../preferences';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

app.get('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let data = await new Preferences(userId).getAll();
    resp.json({data});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
}); // X-USER-ID

export default app;

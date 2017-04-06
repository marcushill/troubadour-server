import {Router} from 'express';
import {requireHeader} from '../middleware';
import {database as db} from '../startup';


const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));

/**
 * @api {GET} /user Get User
 * @apiName Get User Details
 * @apiGroup User
 * @apiHeader {String} X-USER-ID The ID of the current user
 */
app.get('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    let user = await db.TroubadourUser.findById(userId);
    if (user === null) {
      resp.status(404).json({error: `User ${userId} does not exist.`});
    } else {
      resp.json(user);
    }
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

export default app;

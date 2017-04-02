import {Router} from 'express';
import {requireHeader} from '../middleware';
import {Playlist} from '../playlist';

const app = new Router();

app.use(requireHeader({
  header_name: 'X-USER-ID',
  error_message: `Missing Header: X-USER-ID`,
}));


app.use(requireHeader({
  header_name: 'X-API-KEY',
  error_message: `Missing Header: X-API-KEY`,
}));

app.get('/', async (req, resp) => {
  try {
    let userId = req.get('X-USER-ID');
    // let apiKey = req.get('X-API-KEY');
    let playlists = await new Playlist(userId).getPlaylists();
    resp.json({data: playlists});
  } catch (error) {
    resp.status(500).json({error: error.message});
  }
});

app.post('/', async (req, resp) => {
  let userId = req.get('X-USER-ID');
  let apiKey = req.get('X-API-KEY');
  let playlists = await new Playlist(userId)
    .createPlaylist(apiKey, req.body);
});

export default app;

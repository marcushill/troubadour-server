import {Router} from 'express';
import Searcher from '../search';
import {createCachedFunction} from '../cache';

const app = new Router();

/**
 * @api {get} /search?q=:q&page=:page Search
 * @apiName Search
 * @apiGroup Search
 *
 * @apiParam {String} q The query text
 * @apiParam {Number} [page] Which page of size 20 you want. Starts from 1

 * @apiSuccess {Object} data Wrapper for the response arrays
 * @apiSuccess {Object[]} data.artists
 * @apiSuccess {Object[]} data.albums
 * @apiSuccess {Object[]} data.tracks
 * @apiSuccess {Object[]} data.genres
 * @apiSuccess {Object}  data.top_result The single item from data.artists,
 *      data.albums, or data.tracks with the highest Troubadour Search Score
 * @apiExample Example usage:
 *    GET /search?q=beyonce
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : {
 *          "artists": [
 *            {
                 "spotify_id": "6vWDO969PvNqNYHIOW5v0m",
                 "images": [
                 {
                    "height": 1000,
                    "url": "https://i.scdn.co/image/673cd94546df0536954198867516fee18cee1605",
                    "width": 1000
                 },...
               ],
                 "type": "artist",
                 "name": "Beyoncé",
                 "uri": "spotify:artist:6vWDO969PvNqNYHIOW5v0m"
               }
 *          ],
 *          "tracks": [
 *            {
                "spotify_id": "02M6vucOvmRfMxTXDUwRXu",
                "images": [],
                "type": "track",
                "name": "7/11",
                "uri": "spotify:track:02M6vucOvmRfMxTXDUwRXu",
                "artists": [
                  {
                    "spotify_id": "6vWDO969PvNqNYHIOW5v0m",
                    "images": [],
                    "type": "artist",
                    "name": "Beyoncé",
                    "uri": "spotify:artist:6vWDO969PvNqNYHIOW5v0m"
                  }
                ]
              },...
 *          ]
 *          "albums": [...],
 *          "genres": [
 *            {
 *              "spotify_id": "pop",
 *              "images": [],
 *              "type": "artist",
 *              "name": "Pop",
 *              "uri": "spotify:genre:pop"
 *            }
 *          ],
 *          "top_result": {
              "spotify_id": "6vWDO969PvNqNYHIOW5v0m",
              "images": [],
              "type": "artist",
              "name": "Beyoncé",
              "uri": "spotify:artist:6vWDO969PvNqNYHIOW5v0m"
            }
 *     }
 */
app.get('/', async (req, res) => {
  try {
    const searcher = new Searcher();
    const search = createCachedFunction(searcher.search,
       {context: searcher, namespace: 'searchController'});

    if(req.query.q == null) {
      return res.status(400).json({error: 'q param missing'});
    }

    let data = await search(req.query.q, req.query.page);
    res.json({data});
  } catch (err) {
    // Fix this.
    console.log('Error happening');
    console.error(err);
    res.status(500).json(err);
  }
});

export default app;

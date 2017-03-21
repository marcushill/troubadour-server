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
 * @apiExample {}
 */
app.get('/', async (req, res) => {
  try {
    const searcher = new Searcher();
    const search = createCachedFunction(searcher.search,
       {context: searcher, namespace: 'searchController'});

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

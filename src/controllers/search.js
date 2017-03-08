import {Router} from 'express';
import Searcher from '../search';
import {createCachedFunction} from '../cache';

const app = new Router();

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

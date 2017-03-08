import {Router} from 'express';
import Searcher from '../search';
import {createCachedFunction} from '../cache';

const app = new Router();

// We can keep one of these since it doesn't require a user token
const searcher = new Searcher();
const search = createCachedFunction(searcher.search,
   {context: searcher, namespace: 'searchController'});

app.get('/', async (req, res) => {
  try {
    let response = await search(req.query.q, req.query.page);
    res.json(response);
  } catch (err) {
    // Fix this.
    console.log('Error happening');
    console.error(err);
    res.status(500).json(err);
  }
});

export default app;

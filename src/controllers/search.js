import express from 'express';
import Searcher from '../search';
import {createCachedFunction} from '../cache';

const app = express();

// We can keep one of these since it doesn't require a user token
const searcher = new Searcher();
const search = createCachedFunction(searcher.search,
   {context: searcher, namespace: 'searchController'});

app.get('/', function(req, res) {
  search(req.query.q, req.query.page)
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    console.log(err);
    res.json(err);
  });
});

export default app;

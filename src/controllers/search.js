import express from 'express';
import Searcher from '../search';

const app = express();

// We can keep one of these since it doesn't require a user token
const searcher = new Searcher();

app.get('/', function(req, res) {
  searcher.search(req.query.q, req.query.page).then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.json(err);
  });
});

export default app;

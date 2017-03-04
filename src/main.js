// Keep this import first. It does black magic with the .env file
import config from './config'; //eslint-disable-line
import express from 'express';
import searchController from './controllers/search';
import bodyParser from 'body-parser';

const app = express();
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/search', searchController);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

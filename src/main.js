// Keep this import first. It does black magic to setup the environment so
// things don't break mysteriously
import startup from './startup'; //eslint-disable-line
// import {database} from '.startup';
import express from 'express';
import searchController from './controllers/search';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import morgan from 'morgan';

const app = express();
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(morgan('dev'));
  app.use(errorhandler());
} else {
  app.use(morgan('combined'));
}

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use('/search', searchController);

app.listen(process.env.PORT || 3000, function() {
  console.log('Troubadour Server Listening on port 3000');
});

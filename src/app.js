require ('dotenv').config();
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const app = express();
const bookmarkRouter = require('./bookmarks-router');
const errorHandling = require('./error-handling');
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())

app.use(bookmarkRouter)

app.use(errorHandling)

module.exports = app;
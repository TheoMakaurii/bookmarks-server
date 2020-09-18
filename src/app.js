require ('dotenv').config();
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const validation = require('./validation')
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())

let bookmarks = [{
  title: 'Test',
  url: 'www.test.com',
  description: 'test data'
}]

app.get('/bookmarks', (req, res) => {
  res.json(bookmarks)
})

app.use(function errorHAndler(error, req, res, next){
    let respnonse
    if(NODE_ENV === 'production'){
        response = {error: {message: 'whoops! server error'}}
    } else{
        console.error(error)
        respnonse ={message: error.message, error}
    }
    res.status(500).json(respnonse)
})

module.exports = app;
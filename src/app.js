require ('dotenv').config();
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const { v4: uuid } = require('uuid')
const validation = require('./validation')
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json())
// app.use(validation())

let bookmarks = [{
  id: 12345,
  title: 'Test',
  url: 'www.test.com',
  description: 'test data'
}]

app.get('/bookmarks', (req, res) => {
  res.json(bookmarks)
})

app.post('/bookmarks', validation, (req, res)=>{

  const {title, url, description}= req.body;
  const id =uuid()

  const bookmark ={
    id,
    title,
    url,
    description
  }

  bookmarks.push(bookmark)

  res 
    .status(201)
    .location(`http://localhost:8000/bookmarks/`)
    .json(bookmark)
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
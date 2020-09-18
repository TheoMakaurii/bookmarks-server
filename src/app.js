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
app.use(function errorHAndler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error: {message: 'whoops! server error'}}
    } else{
        console.error(error)
        response ={message: error.message, error}
    }
    res.status(500).json(response)
})


let bookmarks = [{
  id: 12345,
  title: 'Test',
  url: 'www.test.com',
  description: 'test data'
}]

app.get('/bookmarks', (req, res) => {
  res.json(bookmarks)
})

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const index = bookmarks.findIndex(bookmark => bookmark.id === id);
  if (index === -1) {
    return res
        .status(404)
        .send('Bookmark not found!');
  }
  res.json(bookmarks[index])
})

app.post('/bookmarks', validation, (req, res)=>{

  const {title, url, description}= req.body;

  if(!title){
    return res
            .status(400)
            .send('No title was included in new bookmark!')
  }

  if(!url){
    return res
            .status(400)
            .send('No URL was included in new bookmark!')
  }

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


module.exports = app;
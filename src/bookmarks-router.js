const express = require('express');
const {
    v4: uuid
} = require('uuid')
const validation = require('./validation')
const bookmarks = require('./store')
const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter.get('/bookmarks', bodyParser, validation, (req, res) => {
    res.json(bookmarks)
})

bookmarkRouter.get('/bookmarks/:id', bodyParser, validation, (req, res) => {
    const {
        id
    } = req.params;
    const index = bookmarks.findIndex(bookmark => bookmark.id === id);
    if (index === -1) {
        return res
            .status(404)
            .send('Bookmark not found!');
    }
    res.json(bookmarks[index])
})

bookmarkRouter.post('/bookmarks', bodyParser, validation, (req, res) => {

    const {
        title,
        url,
        description
    } = req.body;

    if (!title) {
        return res
            .status(400)
            .send('No title was included in new bookmark!')
    }

    if (!url) {
        return res
            .status(400)
            .send('No URL was included in new bookmark!')
    }

    const id = uuid()

    const bookmark = {
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

bookmarkRouter.delete('/bookmarks/:id', bodyParser, validation, (req, res) => {
    const {
        id
    } = req.params;
    const index = bookmarks.findIndex(bookmark => bookmark.id === id);
    if (index === -1) {
        return res
            .status(404)
            .send('Bookmark not found!');
    }

    bookmarks.splice(index, 1);

    res.json(bookmarks)

    res
        .status(204)
        .end();
})

module.exports = bookmarkRouter
const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const uploadWithOptimization = require('../middleware/multer-config');

const BooksCtrl = require('../Controllers/BooksController');

router.get('/book', BooksCtrl.getAllBooks);
router.get('/books/bestrating', BooksCtrl.getBestBooks);
router.get('/book/:id', BooksCtrl.getOneBook);
router.post('/book', auth, uploadWithOptimization, BooksCtrl.createBook);
router.post('/book/:id/rating', auth, BooksCtrl.rateBook);
router.put('/book/:id', auth, uploadWithOptimization, BooksCtrl.modifyBook);
router.delete('/book/:id', auth, BooksCtrl.deleteBook);

module.exports = router;

const express = require('express');
const Index = require('../controllers/index');
const router = express.Router();

router.get('/', Index.index_get);
router.get('/:temple_name', Index.temple_get);
router.post('/', Index.index_post);
module.exports = router;
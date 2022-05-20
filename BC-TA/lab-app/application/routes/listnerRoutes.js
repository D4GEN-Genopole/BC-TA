const { Router } = require('express');
const listenerController = require('../controllers/listenerController');
const router = Router();

// GET

router.get('/listen', listenerController.listener_get);

// POST

router.post('/listen', listenerController.listener_post);

module.exports = router;
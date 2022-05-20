const { Router } = require('express');
const signController = require('../controllers/signController');
const router = Router();

// GET

router.get('/sign', signController.sign_get);

module.exports = router;
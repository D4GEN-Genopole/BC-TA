const { Router } = require('express');
const authController = require('../controllers/authController');
const router = Router();

router.get('/',authController.root_get);
router.get('/enroll', authController.enroll_get);
// POST

router.post('/enroll', authController.enroll_post);

module.exports = router;

const { Router } = require('express');
const dataController = require('../controllers/dataAccessController');
const router = Router();

router.get('/dataAccess',dataController.data_access_get);

//POST
router.post('/dataAccess', dataController.data_access_post);

module.exports = router;

const router = require('express').Router();
const { getMovementHistory } = require('../controllers/equipmentController');

router.get('/', getMovementHistory);

module.exports = router;

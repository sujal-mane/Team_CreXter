const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllNgos, getNgoById, createNgo, updateNgo } = require('../controllers/ngoController');

router.get('/', getAllNgos);
router.get('/:id', getNgoById);
router.post('/', auth, createNgo);
router.put('/:id', auth, updateNgo);

module.exports = router;

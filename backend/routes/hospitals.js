const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllHospitals, getHospitalById, createHospital, updateHospital } = require('../controllers/hospitalController');

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/', auth, createHospital);
router.put('/:id', auth, updateHospital);

module.exports = router;

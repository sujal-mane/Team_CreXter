const router = require('express').Router();
const auth = require('../middleware/auth');
const {
    registerDonor,
    getAllDonors,
    getDonorById,
    updateDonorStatus,
    updateTracking,
    searchDonor,
} = require('../controllers/donorController');

router.post('/', registerDonor);
router.get('/', getAllDonors);
router.get('/search', searchDonor);
router.get('/:id', getDonorById);
router.patch('/:id/status', auth, updateDonorStatus);
router.patch('/:id/tracking', auth, updateTracking);

module.exports = router;

const router = require('express').Router();
const {
    getAllEquipment,
    getEquipmentById,
    updateLocation,
    toggleStatus,
} = require('../controllers/equipmentController');

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/update-location', updateLocation);
router.patch('/:id/status', toggleStatus);

module.exports = router;

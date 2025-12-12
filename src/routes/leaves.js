const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const leaveController = require('../controllers/leaveController');

// Employee creates leave
router.post('/', auth, permit('employee'), leaveController.createLeave);

// Employee views own leaves
router.get('/me', auth, leaveController.getMyLeaves);

// Manager views all leaves (or filter)
router.get('/', auth, permit('manager'), leaveController.getAllLeaves);

// Manager approves/rejects leave
router.patch('/:id/status', auth, permit('manager'), leaveController.updateStatus);

// Employee can delete own leave (if pending)
router.delete('/:id', auth, leaveController.deleteLeave);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getUserById,
  getUserByAccount,
  createUser,
  updateUser,
  uploadAvatar,
  getBalance,
  updateBalance,
  changePassword,
} = require('../controllers/user.controller');
const { upload } = require('../middleware/upload.middleware');

router.get('/:id', getUserById);
router.get('/account/:account', getUserByAccount);
router.post('/', createUser);
router.put('/:id', updateUser);
router.post('/:id/avatar', upload.single('avatar'), uploadAvatar);
router.get('/:id/balance', getBalance);
router.put('/:id/balance', updateBalance);
router.put('/:id/password', changePassword);

module.exports = router;


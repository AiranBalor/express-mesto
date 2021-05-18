const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getMyUser,
} = require('../controllers/users');
const {
  validateId,
  validateUserDescription,
  validateUserAvatar,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/:userId', validateId, getUser);
router.get('/user/me', getMyUser);
router.patch('/users/me', validateUserDescription, updateUser);
router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;

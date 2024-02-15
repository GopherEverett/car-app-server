const router = require('express').Router();
const controller = require('../controllers/authController');
const middleware = require('../middleware');


router.post('/login', controller.login);
router.post('/register', controller.register)
router.put('/forgot-password', controller.forgotPassword)
router.put('/reset-password', controller.updatePassword)
router.put(
    '/update/:user_id',
    middleware.stripToken,
    middleware.verifyToken,
    controller.updatePassword
)
router.get(
    '/session',
    middleware.stripToken,
    middleware.verifyToken,
    controller.checkSession
)

module.exports = router
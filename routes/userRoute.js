const express = require("express")
const { register, login, allUser, logout, forgotPass, resetPass, updaterole, updateProfile } = require("../controller.js/userController")
const { isAuthenticated, authorizedRole } = require("../middleware/auth")
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/forgot').post(forgotPass)
router.route('/password/reset/:token').post(resetPass)
router.route('/update/me').post(isAuthenticated, updateProfile)

router.route('/admin/users').get(isAuthenticated, authorizedRole('admin'), allUser)
router.route('/admin/update/role/:id').post(isAuthenticated, authorizedRole('admin'), updaterole)


module.exports = router





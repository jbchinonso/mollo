const express = require("express")
const router = express.Router()

const Controller = require("../controllers/Controller")



router.post('/signup', Controller.signUp)
router.post('/group', Controller.createGroup)
router.get('/search', Controller.searchGroup)
router.get('/groupMembers/:adminId', Controller.groupMembers)
router.post('/group/join', Controller.joinGroup)







module.exports = router
const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.get("/", ( req, res)=> {
    res.json('USERS')
});
router.post("/sign-up", userController.signUpUser);
router.post("/sign-up-linkedin", userController.singUpLinkedin);

module.exports = router;
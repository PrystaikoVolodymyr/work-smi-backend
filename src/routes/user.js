const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.get("/", (req, res) => {
  res.json("USERS");
});

router.post("/sign-up", userController.signUpUser);

/**
 * @swagger
 * /users/sign-up-linkedin:
 *  get:
 *    tags:
 *      - Users
 *    summary: Sign-up user via Linkedin
 *    parameters:
 *       - name: code,
 *         required: true
 *         type: string
 *         in: body
 *       - name: role
 *         required: true
 *         type: string
 *         in: body
 *    produces:
 *       application/json
 *    responses:
 *      200:
 *        description: Success
 */
router.post("/sign-up-linkedin", userController.singUpLinkedin);
router.get("/all", userController.getAllUsers);
router.delete("/", userController.deleteUserById);
router.post("/claims", userController.setClaims);

module.exports = router;

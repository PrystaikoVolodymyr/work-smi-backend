const router = require("express").Router();
const userController = require("../controllers/user.controller");

/**
 * @swagger
 * /users:
 *  get:
 *    tags:
 *      - users
 *    summary: Get Users
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        descriptions: Success
 */
router.get("/", (req, res) => {
  res.json("USERS");
});

/**
 * @swagger
 * /users/sign-up:
 *  post:
 *    tags:
 *      - users
 *    summary: Sing-up user and set role
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      userId:
 *                          type: string
 *                      role:
 *                          type: string
 *    produces:
 *      - application/json
 *    responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                       claims:
 *                         type: object
 *                         description: The user ID.
 *                 status:
 *                   type: string
 */
router.post("/sign-up", userController.signUpUser);
router.post("/sign-up-linkedin", userController.singUpLinkedin);
router.get("/all", userController.getAllUsers);
router.delete("/", userController.deleteUserById);
router.post("/claims", userController.setClaims);

module.exports = router;

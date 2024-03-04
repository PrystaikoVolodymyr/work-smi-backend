const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { auth, ROLE_RECRUITER, ROLE_CANDIDATE, ROLE_ADMIN, ROLE_EMPLOYEE} = require('../middleware/auth.middleware');


/**
 * @swagger
 * /users/sign-up:
 *  post:
 *    tags:
 *      - users
 *    summary: Sign-up user and set role
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
 *                         description: The user claims.
 *                 status:
 *                   type: string
 */
router.post("/sign-up", userController.signUpUser);

/**
 * @swagger
 * /users/sign-up-linkedin:
 *  post:
 *    tags:
 *      - users
 *    summary: Sign-up user via LinkedIn
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      code:
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
 *                       token:
 *                         type: string
 *                         description: The user custom token.
 *                 status:
 *                   type: string
 */
router.post("/sign-up-linkedin", userController.singUpLinkedin);

/**
 * @swagger
 * /users/:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user profile info
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
 *                       user:
 *                         type: object
 *                         description: User profile info.
 *                 status:
 *                   type: string
 */
router.get("/", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.getUserInfo);

/**
 * @swagger
 * /users/:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user profile
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      middleName:
 *                          type: string
 *                      phone:
 *                          type: string
 *                      achievements:
 *                          type: string
 *                      jobData:
 *                          type: object
 *                      educationData:
 *                          type: object
 *
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
 *                       user:
 *                         type: object
 *                         description: User info.
 *                 status:
 *                   type: string
 */
router.patch("/", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.updateUserProfile);

/**
 * @swagger
 * /users/filters:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user filters info
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
 *                       filters:
 *                         type: object
 *                         description: User filters info.
 *                 status:
 *                   type: string
 */
router.get("/filters", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.getUserFilters);

/**
 * @swagger
 * /users/filters:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user filters
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      activity:
 *                          type: string
 *                      position:
 *                          type: string
 *                      experience:
 *                          type: string
 *                      workFormat:
 *                          type: array
 *                          items:
 *                             type: string
 *                      employmentType:
 *                          type: array
 *                          items:
 *                             type: string
 *                      businessTrip:
 *                          type: boolean
 *                      relocate:
 *                          type: array
 *                          items:
 *                             type: string
 *                      location:
 *                          type: array
 *                      skils:
 *                          type: array
 *                          items:
 *                             type: string
 *                      keyWords:
 *                          type: array
 *                          items:
 *                             type: string
 *                      languages:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               level:
 *                                 type: string
 *                      salary:
 *                          type: object
 *                          properties:
 *                               amount:
 *                                 type: number
 *                               currency:
 *                                 type: string
 *
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
 *                       filters:
 *                         type: object
 *                         description: Users filters.
 *                 status:
 *                   type: string
 */
router.patch("/filters", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.updateUsersFilters);

/**
 * @swagger
 * /users/response:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user response info
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
 *                       response:
 *                         type: object
 *                         description: User response info.
 *                 status:
 *                   type: string
 */
router.get("/response", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.getUserResponses);

/**
 * @swagger
 * /users/response:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user response
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      resume:
 *                          type: string
 *                      coverLetter:
 *                          type: string
 *                      templates:
 *                          type: array
 *                          items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               messages:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *
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
 *                       response:
 *                         type: object
 *                         description: User response.
 *                 status:
 *                   type: string
 */
router.patch("/response", auth([ROLE_ADMIN, ROLE_CANDIDATE, ROLE_RECRUITER,  ROLE_EMPLOYEE]), userController.updateUsersResponse);

router.post("/sign-in", userController.getUserToken);
router.get("/all", userController.getAllUsers);
// router.delete("/", userController.deleteUserById);
router.post("/claims", userController.setClaims);

module.exports = router;

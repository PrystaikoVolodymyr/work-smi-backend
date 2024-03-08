const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { auth, ROLE_RECRUITER, ROLE_ADMIN, ROLE_EMPLOYEE} = require('../middleware/auth.middleware');


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
 * /users/my-profile:
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
router.get("/my-profile", auth([ROLE_ADMIN, ROLE_RECRUITER, ROLE_EMPLOYEE]), userController.getMyProfile);

/**
 * @swagger
 * /users/employee/profile/:id:
 *  get:
 *    tags:
 *      - users
 *    summary: Get employee profile info
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        type: string
 *        description: User id
 *        required: true
 *        in: path
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
 *                       filters:
 *                         type: object
 *                         description: User profile info.
 *                 status:
 *                   type: string
 */
router.get("/employee/profile/:id", auth([ROLE_ADMIN, ROLE_RECRUITER]), userController.getUserInfo);

/**
 * @swagger
 * /users/recruiter/profile/:id:
 *  get:
 *    tags:
 *      - users
 *    summary: Get recruiter profile info
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        type: string
 *        description: User id
 *        required: true
 *        in: path
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
router.get("/recruiter/profile/:id", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.getRecruiterInfo);

/**
 * @swagger
 * /users/employee:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user employee profile
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
 *                      socialNetworks:
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
router.patch("/employee", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.updateEmployeeProfile);

/**
 * @swagger
 * /users/recruiter:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user recruiter profile
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
 *                      position:
 *                          type: string
 *                      companyName:
 *                          type: string
 *                      companyWebsite:
 *                          type: string
 *                      companyDescription:
 *                          type: string
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
router.patch("/recruiter", auth([ROLE_ADMIN, ROLE_RECRUITER]), userController.updateRecruiterProfile);

/**
 * @swagger
 * /users/employee/filters:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user employee filters info
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
router.get("/employee/filters", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.getUserFilters);

/**
 * @swagger
 * /users/recruiter/filters:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user recruiter filters info
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
router.get("/recruiter/filters", auth([ROLE_ADMIN, ROLE_RECRUITER]), userController.getRecruiterFilters);

/**
 * @swagger
 * /users/employee/filters:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user employee filters
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
 *                          items:
 *                             type: string
 *                      skills:
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
router.patch("/employee/filters", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.updateUsersFilters);

/**
 * @swagger
 * /users/recruiter/filters:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user recruiter filters
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      activity:
 *                          type: string
 *                      keyWords:
 *                          type: array
 *                          items:
 *                             type: string
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
router.patch("/recruiter/filters", auth([ROLE_ADMIN, ROLE_RECRUITER]), userController.updateRecruiterFilters);

/**
 * @swagger
 * /users/onboarding:
 *  post:
 *    tags:
 *      - users
 *    summary: Set user onboarding
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      workFormat:
 *                          type: array
 *                          items:
 *                             type: string
 *                      experience:
 *                          type: string
 *                      categories:
 *                          type: array
 *                          items:
 *                             type: string
 *                      skills:
 *                          type: array
 *                          items:
 *                             type: string
 *                      employmentType:
 *                          type: array
 *                          items:
 *                             type: string
 *                      location:
 *                          type: array
 *                          items:
 *                             type: string
 *                      benefits:
 *                          type: array
 *                          items:
 *                             type: string
 *    produces:
 *      - application/json
 *    responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.post("/onboarding", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.setUserOnboarding);

/**
 * @swagger
 * /users/employee/response:
 *  get:
 *    tags:
 *      - users
 *    summary: Get user employee response info
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
router.get("/employee/response", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.getUserResponses);

/**
 * @swagger
 * /users/employee/response:
 *  patch:
 *    tags:
 *      - users
 *    summary: Update user employee response
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
router.patch("/employee/response", auth([ROLE_ADMIN, ROLE_EMPLOYEE]), userController.updateUsersResponse);

// router.post("/sign-in", userController.getUserToken);
// router.get("/all", userController.getAllUsers);
// // router.delete("/", userController.deleteUserById);
// router.post("/claims", userController.setClaims);

module.exports = router;

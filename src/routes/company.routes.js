const router = require("express").Router();
const companyController = require("../controllers/company.controller");
const { auth, ROLE_RECRUITER, ROLE_CANDIDATE, ROLE_ADMIN, ROLE_EMPLOYEE} = require('../middleware/auth.middleware');


/**
 * @swagger
 * /companies/create:
 *  post:
 *    tags:
 *      - companies
 *    summary: Create company
 *    requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      comanyName:
 *                          type: string
 *                      companyWebsite:
 *                          type: string
 *                      companyDescription:
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
 *                 status:
 *                   type: string
 */
router.post("/create", companyController.createCompany);

/**
 * @swagger
 * /companies:
 *  get:
 *    tags:
 *      - companies
 *    summary: Get all companies
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: name
 *         type: string
 *         in: query
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
 *                       companies:
 *                         type: array
 *                         items:
 *                             type: object
 *                         description: User filters info.
 *                 status:
 *                   type: string
 */
router.get("/", companyController.getCompanies);

module.exports = router;

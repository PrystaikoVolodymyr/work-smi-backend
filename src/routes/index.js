const router = require('express').Router();
const userRouter = require('./user.routes');
const companyRouter = require('./company.routes');

router.use('/users', userRouter);
router.use('/companies', companyRouter);


module.exports = router;

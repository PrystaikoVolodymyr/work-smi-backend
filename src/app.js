require("dotenv").config();

const { PORT } = require('./config/config')
const express = require("express");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/index"));

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'work-smi',
            version: '1.0.0',
        }
    },
    apis: [`${__dirname}/routes/*.routes.js`],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

module.exports = app;
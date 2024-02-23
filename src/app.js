require("dotenv").config();

const { PORT } = require('./config/config')
const express = require("express");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const options = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: 'work-smi',
            version: '1.0.0',
        }
    },
    apis: ['./routes/*.js'],
};

app.use("/", require("./routes/index"));

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

module.exports = app;
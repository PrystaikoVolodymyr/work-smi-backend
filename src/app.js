require("dotenv").config();

const { PORT, MONGO_URL } = require('./config/config')
const express = require("express");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');

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
        },
        components: {
            securitySchemes: {
                bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header'
                }
            }
        },
        security: [
            { bearer: [] }
        ]
    },
    apis: [`${__dirname}/routes/*.routes.js`],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function start () {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        await app.listen(PORT, () => {
            console.log(`App has been started at port ${PORT}...`)
        })
    } catch (e) {
        console.log("Server Error mongoDB", e.message())
        process.exit(1)
    }
}

start().then(()=>console.log("..."))

module.exports = app;
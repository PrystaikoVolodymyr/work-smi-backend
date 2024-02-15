require("dotenv").config();

const { PORT } = require('./config/config')
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

module.exports = app;
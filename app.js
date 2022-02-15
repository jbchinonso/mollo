const express = require("express");
const users = require("./routes/user")

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api', users)



module.exports = app
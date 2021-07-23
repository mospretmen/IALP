const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
var num = require('numeral');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.locals.num = num;

app.use("/", require("./routes/index.js"));

app.listen(PORT, console.log('Server started on port:' + PORT));
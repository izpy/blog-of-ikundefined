const express = require("express");
const swig = require("swig");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const Cookies = require("cookies");

// 读取配置文件
require('dotenv').config();

const app = express();

app.use(cors());

app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    if (req.cookies.get("userInfo")) {
        req.userInfo = JSON.parse(req.cookies.get("userInfo"));
    }
    next();
});

app.engine("html", swig.renderFile);
app.set("views", "./views");
app.set("view engine", "html");
swig.setDefaults({
    cache: false
});

app.use("/public", express.static(__dirname + "/public"));

app.use("/", require("./routers/main"));
app.use("/user", require("./routers/user"));
app.use("/admin", require("./routers/admin"));
app.use("/article", require("./routers/article"));
app.use("/dynamic", require("./routers/dynamic"));
app.use("/message", require("./routers/message"));
app.use("/demo", require("./routers/demo"));
app.use("/about", require("./routers/about"));
app.use("/resume", require("./routers/resume"));

const {
    DB_HOST,
    DB_NAME,
    DB_USER = '',
    DB_PASS = ''
} = process.env;
if (!DB_HOST || !DB_NAME) {
    console.error('please set DB_HOST or DB_NAME in ".env"');
    process.exit(5);
}

mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`, {
    useNewUrlParser: true
}, function (err) {
    if (!err) {
        app.listen(3000);
        console.log("your blog is running in http://localhost:3000");
    } else {
        console.log(err);
    }
});

var express = require("express");
var http = require("http");
var cors = require("cors");
var multer = require("multer");
var path = require("path");
var dotenv = require("dotenv");
var { connect } = require("mongoose");
var flash = require('connect-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

const router = require("./router");
const seeder = require("./seeders")
dotenv.config();


var app = express();

connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database connected successfully.");
    seeder.Seeders.admin();
    console.log(seeder);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log("Error in database connection", err.message);
  });

app.use(express.urlencoded({ extended: false }));
app.use(session({secret:'learning flash',
            resave: true,
            saveUnitialized: true}));
app.use(cookieParser('flash message'))
app.use(flash());

app.set('views', path.join(__dirname, '/views'));

// setup view engine
app.set('view engine', 'ejs');
// Image Path
// app.use("./uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: "100mb" }));

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token", "authorization"],
};
app.use(cors(corsOption));

app.use("/api", router);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(__dirname + '/public'));

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/assets", express.static(path.join(__dirname, "..", "app", "assets")));

/* create server */
const server = http.createServer(app);

/* add socket server */
// socketInitialize(server);

const port = process.env.PORT || 8010;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});

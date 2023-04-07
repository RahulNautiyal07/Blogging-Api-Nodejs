require("./db/mongo_init");
require('./db/redis_init');
const express = require("express");
const dotenv = require("dotenv");
const config = require("config");
const routers = require("./routers");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cluster = require("cluster");
const rateLimit = require("express-rate-limit");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


// const numCPUs = require("os").cpus().length; // we can do like this when we are going to utilise all cpu cores
const numCPUs = 2;

dotenv.config();
const port = config.get("port");

const app = express();
// Swagger implementation
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3000/api/v1/",
			},
		],
	},
	apis: ["./src/*.js","./src/modules/*/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());

// express-body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(
    cors({
      credentials: true, //access-control-allow-credentials:true
      origin: "http://localhost:4000",
      methods: "GET,POST,PUT,DELETE",
      // optionSuccessStatus: 200
    })
  );

app.use(cookieParser());


//all-routers
app.use("/api/v1", routers);


app.get("/", (req, res) => {
  let cook = req.header.cookies;
  console.log(cook, req.cookies.token, "cookie");
  res.json("I am ok Keep going on");
});


if (process.env.NODE_ENV === "production") {
  if (cluster.isMaster) {
    console.log("Master cluster setting up " + numCPUs + " workers...");

    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("online", function (worker) {
      console.log("Worker " + worker.process.pid + " is online");
    });

    cluster.on("exit", function (worker, code, signal) {
      console.log(
        "Worker " +
          worker.process.pid +
          " died with code: " +
          code +
          ", and signal: " +
          signal
      );
      console.log("Starting a new worker");
      cluster.fork();
    });
  } else {
    app.listen(port, () =>
      console.log(
        `Express server running on: http://localhost:${port} in ${process.env.NODE_ENV}`
      )
    );
  }
} else {
  app.listen(port, () =>
    console.log(
      `Express server running on: http://localhost:${port} in ${process.env.NODE_ENV}`
    )
  );
}

module.exports = app;
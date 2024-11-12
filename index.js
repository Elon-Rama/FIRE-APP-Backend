const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("./Mongo/DB");
require("dotenv").config();

const route = require('./Routes/route');

// Swagger setup
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api',route)

mongoose
  // .connect(process.env.Mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

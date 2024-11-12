const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Financial Independence Retire-Early",
    description: "Version 1.0"
  },
  host: "localhost:7000",  
  basePath: "/",
  schemes: ["http"],  
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc);

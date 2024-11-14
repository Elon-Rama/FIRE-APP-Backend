// const express = require("express");
// const app = express();
// const session = require("express-session");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongodb = require("./Mongo/DB");
// require("dotenv").config();

// const route = require('./Routes/route');

// // Swagger setup
// const swaggerDocument = require("./swagger-output.json");
// const swaggerUi = require("swagger-ui-express");

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || 'yoursecret',
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false }, 
//     })
// );

// // Routes
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api',route)

// // MongoDB Connection
// mongoose
//     // .connect(process.env.Mongo, { useNewUrlParser: true, useUnifiedTopology: true })
//     .connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("MongoDB connected!");
//     })
//     .catch((err) => {
//         console.error("Error connecting to MongoDB:", err);
//     });

// // Default Route
// app.get("/", (req, res) => {
//     res.send("Welcome to FIRE!");
// });

// // Server Start
// const port = process.env.PORT || 7000;
// app.listen(port, () => {
//     console.log(`Server connected on port ${port}`);
// });

// module.exports = app;


const express = require("express");
const http = require("http"); 
const { Server } = require("socket.io"); 
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("./Mongo/DB");
require("dotenv").config();

const route = require('./Routes/route');

// Swagger setup
const swaggerDocument = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");

// App setup
const app = express();
// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected on WebSocket");

  socket.on("Token", async (data) => {
    console.log("Received Token event with data:", data);
  
    try {
      if (await isValidToken(data.token)) {
        socket.emit("TokenResponse", {
          success: true,
          message: "Token received and deleted successfully",
        });
      } else {
        socket.emit("TokenResponse", {
          success: false,
          message: "Invalid token",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      socket.emit("TokenResponse", {
        success: false,
        message: "Error validating token",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from WebSocket");
  });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'yoursecret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, 
    })
);

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', route);

// MongoDB Connection
mongoose
    .connect(process.env.Mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to FIRE!");
});


// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

   
//     socket.on("join-room", (roomId, userId) => {
//         socket.join(roomId);
//         socket.to(roomId).emit("user-connected", userId); 

        
//         socket.on("signaling-message", (data) => {
            
//             socket.to(roomId).emit("signaling-message", data);
//         });

       
//         socket.on("disconnect", () => {
//             console.log("User disconnected:", socket.id);
//             socket.to(roomId).emit("user-disconnected", userId); 
//         });
//     });
// });

// Server Start
const port = process.env.PORT || 7000;
server.listen(port, () => {
    console.log(`Server connected on port ${port}`);
});

module.exports = app;
const express = require("express");
const cors = require("cors");

const handleAuth = require("./Controllers/authController");
const handleRegister = require("./Controllers/registerController");
const connectDb = require("./mongoDB.js");
const stuffRoutes = require("./routes/stuff.js");

const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDb();

app.listen(port, () => {
  console.log(`Port ${port} is the best !`);
});

app.post("/api/auth/login", handleAuth);
app.post("/api/auth/signup", handleRegister);

app.use("/api/stuff", stuffRoutes);

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDb = require("./mongoDB.js");
const stuffRoutes = require("./routes/stuff.js");
const userRoutes = require("./routes/users.js");

const app = express();

const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

connectDb();

app.listen(port, () => {
  console.log(`Port ${port} is the best !`);
});

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);

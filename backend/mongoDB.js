require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB Atlas réussie !");
  } catch (err) {
    console.error("Erreur de connexion à MongoDB Atlas :", err);
  }
};

module.exports = connectDb;

//mongodb+srv://hjr:<db_password>@clusterbooks.ywcit.mongodb.net/

const bcrypt = require("bcrypt");
const UserModel = require("../ModelDB.js");
const jwt = require("jsonwebtoken");

const handleAuth = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Message: "Email et Mot de passe requis" });
  }

  const user = await UserModel.findOne({ email: email });

  if (!user)
    return res
      .status(400)
      .json({ Message: "Utilisateur introuvable, veuillez vous inscrire" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({ Message: "Mot de passe incorrect " });

  res.status(200).json({
    userId: user._id,
    token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    }),
  });
};

module.exports = handleAuth;

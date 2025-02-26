const bcrypt = require("bcrypt");
const UserModel = require("../ModelDB.js");

const handleRegister = async (req, res) => {
  const { email, password } = req.body;

  const emailDuplicate = await UserModel.findOne({ email: email });

  if (!email || !password)
    return res.status(400).json({ Message: "Email et Mot de passe requis" });

  if (emailDuplicate !== null)
    return res.status(400).json({ Message: "Email déjà existant" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email: email,
      password: hashedPwd,
    });

    console.log(newUser);
    res.status(200).json({ success: `Nouvelle utilisateur créé !` });
  } catch (err) {
    console.error(err);
  }
};

module.exports = handleRegister;

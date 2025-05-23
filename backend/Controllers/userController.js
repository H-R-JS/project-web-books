const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../ModelDB/user.js');

exports.handleAuth = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ Message: 'Email et Mot de passe requis' });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ Message: 'Utilisateur introuvable, veuillez vous inscrire' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res
      .status(400)
      .json({ Message: 'Email ou Mot de passe incorrect ' });
  }

  res.status(200).json({
    userId: user._id,
    token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: '24h',
    }),
  });
};

exports.handleRegister = async (req, res) => {
  const { email, password } = req.body;

  const emailDuplicate = await UserModel.findOne({ email });

  if (!email || !password) return res.status(400).json({ Message: 'Email et Mot de passe requis' });

  if (emailDuplicate !== null) return res.status(400).json({ Message: 'Email déjà existant' });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      password: hashedPwd,
    });
    res.status(200).json({ success: 'Nouvelle utilisateur créé !' });
  } catch (err) {
    console.error(err);
  }
};

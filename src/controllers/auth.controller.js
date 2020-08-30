const md5 = require("md5");
const db = require("../../db");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");

const signIn = (req, res) => {
  try {
    let { email, password } = req.body;

    let user = db.get("users").find({ email }).value();

    // check user
    if (!user) throw { message: "Email doesn't exist" };

    // hash password
    let hashPassword = md5(password);

    // check password
    if (user.password !== hashPassword) {
      throw { message: "Password is not correct" };
    }

    // generate token
    let payload = {
      id: user.id,
    };
    let token = jwt.sign(payload, "secretKey", { expiresIn: "2h" });

    // save session
    let session = db.get("sessions").find({ id: user.id }).value();
    if (session) {
      db.get("sessions").find({ id: user.id }).assign({ token: token }).write();
    } else {
      db.get("sessions").push({ id: user.id, token: token }).write();
    }

    res.status(200).json({ token: token });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const signUp = (req, res) => {
  try {
    let { email, password } = req.body;

    // hash password
    let hashedPassword = md5(password);

    // save in db
    let data = {
      id: shortId.generate(),
      email: email,
      password: hashedPassword,
    };

    db.get("users").push(data).write();

    return res.status(200).json({ message: "Created" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const signOut = (req, res) => {
  return res.send("Sign out");
};

module.exports = {
  signIn,
  signUp,
  signOut,
};

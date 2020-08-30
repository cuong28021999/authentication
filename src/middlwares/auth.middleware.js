const Joi = require("@hapi/joi");
const db = require("../../db.js");
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;

    // check token client
    if (!bearerToken) throw { message: "Forbidden" };

    // verify token
    let token = bearerToken.split(" ")[1];

    // check token correct
    let session = db.get("sessions").find({ token: token }).value();
    if (!session) {
      throw { message: "Invalid token" };
    }

    jwt.verify(token, "secretKey", {}, (error) => {
      if (error) {
        db.get("sessions").remove({ token: token }).write();
        throw error;
      }
    });

    return next();
  } catch (error) {
    res.status(400).json(error);
  }
};

const validate = (req, res, next) => {
  let { email, password } = req.body;
  let schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  let { error } = schema.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  return next();
};

const checkEmailExist = (req, res, next) => {
  let { email } = req.body;

  let user = db.get("users").find({ email }).value();
  if (user) return res.status(400).json({ message: "Email has exist" });

  return next();
};

module.exports = {
  validate,
  checkEmailExist,
  requireAuth,
};

const Joi = require("joi");
const AppError = require("../utils/Error");

const authenticationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

const authenticate = (req, res, next) => {
  const { error } = authenticationSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  next();
};

module.exports = authenticate;

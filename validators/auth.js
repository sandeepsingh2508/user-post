const Joi = require("joi");
const response = require("../middlewares/response");

const userName = Joi.string().min(2).max(20).label("userName").messages({
  "string.base": `{#label} must be a type of string`,
  "string.min": `{#label} should have minimum length of {#limit}`,
  "string.max": `{#label} can not be more than {#limit}`,
  "any.required": `{#label} is required`,
});

const email = Joi.string().email().label("email").messages({
  "string.base": `{#label} must be a type of string`,
  "string.email": `{#label} must be a valid email address`,
  "any.required": `{#label} is required`,
});

const password = Joi.string().min(6).max(20).label("password").messages({
  "string.base": `{#label} must be a type of string`,
  "string.min": `{#label} should have minimum length of {#limit}`,
  "string.max": `{#label} can not be more than {#limit}`,
  "any.required": `{#label} is required`,
});

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const createOwnerObject = Joi.object({
  userName: userName.required(),
  email: email.required(),
  password: password.required(),
});

const createValidate = async (req, res, next) => {
  try {
    console.log(req.body);
    await createOwnerObject.validateAsync(req.body, options);
  } catch (error) {
    console.log(error);
    return response.internalServerError(res, error.message);
  }
  next();
};

module.exports = {
  createValidate,
};

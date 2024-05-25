const Joi = require("joi");
const response = require("../middlewares/response");

const title = Joi.string().min(2).max(20).label("title").messages({
  "string.base": `{#label} must be a type of string`,
  "string.min": `{#label} should have minimum length of {#limit}`,
  "string.max": `{#label} can not be more than {#limit}`,
  "any.required": `{#label} is required`,
});
const body = Joi.string().min(2).max(100).label("body").messages({
  "string.base": `{#label} must be a type of string`,
  "string.min": `{#label} should have minimum length of {#limit}`,
  "string.max": `{#label} can not be more than {#limit}`,
  "any.required": `{#label} is required`,
});

const createdBy = Joi.string().label("createdBy").messages({
  "string.base": `{#label} must be a type of string`,
  "any.required": `{#label} is required`,
});
const isActive = Joi.boolean().label("isActive").messages({
  "string.base": `{#label} must be a type of string`,
});

const geoLocation = Joi.object().label("geoLocation").messages({
  "object.base": `{#label} must be a type of object`,
});

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const createOwnerObject = Joi.object({
  title: title.required(),
  body: body.required(),
  geoLocation: geoLocation.required(),
  createdBy,
});

const updateOwnerObject = Joi.object({
  title: title,
  body: body,
  isActive: isActive,
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

const updateValidate = async (req, res, next) => {
  try {
    await updateOwnerObject.validateAsync(req.body, options);
  } catch (error) {
    return response.internalServerError(res, error.message);
  }
  next();
};

module.exports = {
  createValidate,
  updateValidate,
};

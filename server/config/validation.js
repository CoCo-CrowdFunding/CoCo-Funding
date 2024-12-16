const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required("Name is required"),
    email: Joi.string().min(6).max(255).required("Email is required").email(),
    password: Joi.string().min(6).max(255).required("Password is required"),
  });

  return schema.validate(data);
};

const passwordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).max(255).required("Password is required"),
  });

  return schema.validate(data);
};

const proposalValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required("Title is required"),
    description: Joi.string().min(3).required("Description is required"),
    funding_goal: Joi.number().required("Goal is required"),
    start_date: Joi.date().required("Start date is required"),
    end_date: Joi.date().required("End date is required"),
    category: Joi.string()
      .required("Category is required")
      .valid(
        "music",
        "photography",
        "publishing",
        "fashion",
        "design",
        "art",
        "technology",
        "food-and-drink",
        "local-revitalization"
      ),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.proposalValidation = proposalValidation;

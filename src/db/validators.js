const { z } = require("zod");

async function validateLead(postData) {
  const leadObjectValidation = z.object({
    email: z.string().email().min(5),
    description: z.string(),
  });

  let hasError;
  let validData = {};
  let message;
  try {
    validData = leadObjectValidation.parse(postData);
    hasError = false;
    message = "";
  } catch (err) {
    hasError = true;
    message = "Invalid email please try again";
  }

  return {
    data: validData,
    hasError,
    message: message,
  };
}

module.exports.validateLead = validateLead;

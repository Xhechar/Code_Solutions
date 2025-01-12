
import joi from "joi";

export const LoginDetailsSchema = joi.object({
  Email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.required": "Email is required"
  }),
  Password: joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 30 characters",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "string.required": "Password is required"
  })
});

export const RecoveryDetailsSchema = joi.object({
  Email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.required": "Email is required"
  }),
  RecoveryCode: joi.string().required().messages({
    "string.required": "Recovery code is required"
  }),
  NewPassword: joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 30 characters",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "string.required": "New password is required"
  })
});

export const UserRegisterationSchema = joi.object({
  Fullname: joi.string().min(4).required().messages({
    "string.min": "Fullname must be at least 4 characters long",
    "string.required": "Fullname is required"
  }),
  Email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.required": "Email is required"
  }),
  Password: joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 30 characters",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "string.required": "Password is required"
  }),
  Username: joi.string().min(4).max(30).alphanum().required().messages({
    "string.min": "Username must be at least 4 characters long",
    "string.max": "Username must not exceed 30 characters",
    "string.alphanum": "Username must contain only alphanumeric characters",
    "string.required": "Username is required"
  }),
  ProfileImage: joi.string().required().messages({
    "string.required": "Profile image is required"
  })
});

export const CommentSchema = joi.object({
  Content: joi.string().min(1).max(200).required().messages({
    "string.min": "Comment must be at least 1 character long",
    "string.max": "Comment must not exceed 200 characters",
    "string.required": "Comment text is required"
  })
});

export const StackSchema = joi.object({
  Name: joi.string().min(4).max(50).required().messages({
    "string.min": "Stack name must be at least 4 characters long",
    "string.max": "Stack name must not exceed 50 characters",
    "string.required": "Stack name is required"
  }),
  Description: joi.string().min(10).max(500).required().messages({
    "string.min": "Stack description must be at least 10 characters long",
    "string.max": "Stack description must not exceed 500 characters",
    "string.required": "Stack description is required"
  }),
  Version: joi.string().min(1).max(10).required().messages({
    "string.min": "Stack version must be at least 1 character long",
    "string.max": "Stack version must not exceed 10 characters",
    "string.required": "Stack version is required"
  })
});

export const CategorySchema = joi.object({
  Name: joi.string().min(4).max(50).required().messages({
    "string.min": "Category name must be at least 4 characters long",
    "string.max": "Category name must not exceed 50 characters",
    "string.required": "Category name is required"
  }),
  Description: joi.string().min(10).max(500).required().messages({
    "string.min": "Category description must be at least 10 characters long",
    "string.max": "Category description must not exceed 500 characters",
    "string.required": "Category description is required"
  })
});
  
export const ProblemSchema = joi.object({
  Title: joi.string().min(4).max(100).required().messages({
    "string.min": "Title must be at least 4 characters long",
    "string.max": "Title must not exceed 100 characters",
    "string.required": "Title is required"
  }),
  Description: joi.string().min(10).max(500).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must not exceed 500 characters",
    "string.required": "Description is required"
  }),
  ErrorCode: joi.string().max(50),
  Context: joi.string().max(500),
  Environment: joi.string().max(500),
  Tags: joi.array().items(joi.string().max(50)).required().messages({
    "array.items": "At least one tag is required"
  }),
  Reproducibility: joi.boolean().required().messages({
    "boolean.required": "Reproducibility is required"
  }),
  Logs: joi.string().max(10000),
  PriorityLevel: joi.number().integer().min(0).max(5).required().messages({
    "number.integer": "Priority level must be an integer",
    "number.min": "Priority level must be at least 0",
    "number.max": "Priority level must not exceed 5"
  }),
  ImagePath: joi.string().max(500)
});
  
export const SolutionSchema = joi.object({
  Description: joi.string().min(10).max(500).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must not exceed 500 characters",
    "string.required": "Description is required"
  }),
  Steps: joi.string().min(10).max(5000).required().messages({
    "string.min": "Steps must be at least 10 characters long",
    "string.max": "Steps must not exceed 5000 characters",
    "string.required": "Steps are required"
  }),
  CodeSamples: joi.string().max(10000),
  ImagePath: joi.string().max(500),
  VideoLink: joi.string().max(500)
});
  
export const PSGSchema = joi.object({
  Title: joi.string().min(4).max(100).required().messages({
    "string.min": "Title must be at least 4 characters long",
    "string.max": "Title must not exceed 100 characters",
    "string.required": "Title is required"
  }),
  PictorialGuide: joi.string().max(500),
  TextInstructions: joi.string().max(5000)
});
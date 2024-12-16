const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const adminSchema = new Schema({
  admin_id: {
    type: String,
    required: false, // 如果想取消必填，可設為 false
    default: () => `admin_${Date.now()}` // 自動生成唯一 ID
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    description:
      "Username must be a string between 3 and 50 characters and is required.",
  },
  email: {
    type: String,
    required: true,
    match: /^.+@.+\..+$/,
    description: "Email must be a valid email address and is required.",
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    description:
      "Password must be a string with at least 8 characters and is required.",
  },
  created_at: {
    type: String,
    required: true,
    description: "Created_at must be a string and is required.",
  },
  jwt_token: {
    type: String,
    description: "JWT token must be a string.",
  },
});

// Hash password before saving into database.
adminSchema.pre("save", function (next) {
  const admin = this;
  if (admin.isModified("password") || admin.isNew) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // Generate a salt
      if (err) return next(err);
      bcrypt.hash(admin.password, salt, function (err, hash) {
        // Generate a hash
        if (err) return next(err);

        // Store hash in your password DB.
        admin.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

module.exports = mongoose.model("Admin", adminSchema);

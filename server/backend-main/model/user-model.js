const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    description: "must be an integer and is required",
  },
  username: {
    type: String,
    required: true,
    description: "must be a string and is required",
  },
  email: {
    type: String,
    required: true,
    match: /^.+@.+..+$/,
    description: "must be a string and match the email format",
  },
  password: {
    type: String,
    required: true,
    description: "must be a string and is required",
    
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    description: "must be a date and is required",
  },
  jwt_token: {
    type: String,
    description: "must be a string",
  },
  purchases_record: {
    type: [
      {
        proposal_id: {
          type: Number,
          required: true,
          description: "must be an integer and is required",
        },
        proposal_title: {
          type: String,
          required: true,
          description: "must be a string and is required",
        },
        purchase_date: {
          type: Date,
          required: true,
          description: "must be a date and is required",
        },
        purchase_money: {
          type: Number,
          required: true,
          description: "must be an integer and is required",
        },
      },
    ],
    default: [],
    type: Array,
    description: "Array of proposal and plans purchased by the user",
  },
  present_record: {
    type: [
      {
        proposal_id: {
          type: Number,
          required: true,
          description: "must be an integer and is required",
        },
        proposal_title: {
          type: String,
          description: "must be a string",
        },
        create_date: {
          type: Date,
          description: "must be a date",
        },
      },
    ],
    default: [],
    type: Array,
    description: "Array of user's own proposals",
  },
});

// Hash password before saving into database.
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // Generate a salt
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Generate a hash
        if (err) return next(err);

        // Store hash in your password DB.
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Compare input password
userSchema.methods.comparePassword = async function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);


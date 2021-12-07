import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongooseLeanVirtuals);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (error, hash) => {
    if (error) {
      return next(error);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });
  });
};

export const UserModel = mongoose.model('user', userSchema);

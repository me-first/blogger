const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'user must have name'],
  },
  email: {
    type: String,
    trim: true,
    unique: [true, 'email must be unique'],
    validate: [validator.isEmail, 'Invalid email format'],
    lowercase: true,
    required: [true, 'user must have email'],
  },
  photo: {
    type: String,
    default:
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635676072/zizntpoy1bv8fkcrljmy.jpg',
  },
  password: {
    type: String,
    trim: true,
    minlength: [8, 'password must be 8 character long'],
    required: [true, 'user must have password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: [
      function (val) {
        return val === this.password;
      },
      'confirm password is not same as password',
    ],
    required: [true, 'user must confirm password'],
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  enteredPassword,
  savedPassword
) {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

userSchema.pre('save', function (next) {
  if (this.isNew || !this.isModified('password')) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp =
      parseInt(this.passwordChangedAt.getTime(), 10) / 1000;
    return jwtTimeStamp < changedTimeStamp;
  } else return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

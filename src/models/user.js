const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        trim: true,
        minlength: 1
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (userName, password) => {
    const user = await User.findOne({ userName });
    if (!user) {
        throw new Error('error: unable to login');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('error: unable to login');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
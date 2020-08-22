var mongoose = require('mongoose');
var crypto = require('crypto');
var uuidv1 = require('uuid/v1');
var Schema = mongoose.Schema;


var userSchema = Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 10,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true

    },
    useinfo: {
        type: String,
        trim: true
    },

    encry_password: {
        type: String,
        required: true,
    },
    salt: String,

    role: {
        type: Number,
        default: 0,
    },
    purchases: {
        type: Array,
        default: []
    }
}, {
    timestamp: true
});

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (planpassword) {
        return this.securePassword(planpassword) === this.encry_password

    },
    securePassword: function (planpassword) {
        if (!planpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(planpassword)
                .digest('hex');
        } catch (error) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema)
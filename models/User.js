const bcrypt = require("bcryptjs")
const validator = require("validator")
const usersCollection = require('../db').db().collection("users")

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.sanitize = function() {
    if(typeof(this.data.username) != "string") {this.data.username = ""}
    if(typeof(this.data.email) != "string") {this.data.email = ""}
    if(typeof(this.data.password) != "string") {this.data.password = ""}

    // Get rid of uneeded properties
    this.data = {
        username: this.data.username.trim(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    if (this.data.username == "") {this.errors.push("You must provide a username")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers")}
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email.")}
    if (this.data.password == "") {this.errors.push("You must provide a password.")}
    if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
    if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
    if (this.data.username.length > 0 && this.data.password.length < 3) {this.errors.push("Username must be at least 3 characters.")}
    if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.sanitize()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve("Congrats")
             } else {
                reject("Invalid login")
             }
        }).catch(function(e) {
            reject("Try again later. Error Code: " + e)
        })
    })
}

User.prototype.register = function() {
    return new Promise((resolve, reject) => {
        // Step 1: Validate user date.
        this.sanitize()
        this.validate()

        // Step 2: Only if there are no errors then save data in database.
        if (!this.errors.length) {
            // Hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            usersCollection.insertOne(this.data)
            resolve("Registered")
        } else {
            reject(this.errors)
        }
    })
}

module.exports = User
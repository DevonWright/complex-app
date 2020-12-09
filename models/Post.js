const postsCollection = require('../db').db().collection("posts")

let Post = function(data) {
    this.data = data
    this.errors = []
}

Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.sanitize()
        this.validate()
        
        if (!this.errors.length) {
            postsCollection.insertOne(this.data).then(() => {
                resolve()
            }).catch(() => {
                this.errors.push("Please try again later")
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })
}

Post.prototype.sanitize = function() {
    if (typeof(this.data.title) != "string") {this.data.title = ""}
    if (typeof(this.data.body) != "string") {this.data.body = ""}
    
    // Remove unwanted properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date()
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
    if (this.data.body == "") {this.errors.push("You must provide content.")}
}

module.exports = Post
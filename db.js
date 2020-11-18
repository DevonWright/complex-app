const mongodb = require('mongodb')


connectionString = "mongodb+srv://todoAppUser:todoAppPassword@cluster0.uhci5.mongodb.net/ComplexApp?retryWrites=true&w=majority"

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    if(err) {
        console.log(err)
    } else {
        module.exports = client.db()
        const app = require('./app')
        app.listen(3000)
    }
})
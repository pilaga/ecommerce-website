const mongodb = require('mongodb');
const mongo = require('../utils/database');

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = mongo.getDb();
        return db.collection('user').insertOne(this);
    }        

    static findById(id) {
        const db = mongo.getDb();
        return db.collection('user').findOne({ _id: new mongodb.ObjectId(id)});
        //findOne() > returns one element
        //find() > returns a cursor: find().next() returns one element
    }
}

module.exports = User;
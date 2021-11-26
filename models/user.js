const mongodb = require('mongodb');
const mongo = require('../utils/database');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // { items: [] }
        this._id = id;
    }

    save() {
        const db = mongo.getDb();
        return db.collection('user').insertOne(this);
    } 
    
    addToCart(product) {
        /*const cartProduct = this.cart.items.findIndex(item => {
            return item._id === product._id;
        });*/
        product.quantity = 1;
        const updatedCart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1}]};
        const db = mongo.getDb();
        return db.collection('user').updateOne(
            { _id: new mongodb.ObjectId(this._id)}, 
            { $set: { cart: updatedCart }}
        );
    }

    static findById(id) {
        const db = mongo.getDb();
        return db.collection('user').findOne({ _id: new mongodb.ObjectId(id)});
        //findOne() > returns one element
        //find() > returns a cursor: find().next() returns one element
    }
}

module.exports = User;
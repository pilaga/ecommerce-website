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
        const cartProductIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndex >= 0) { //product exists
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else { //product doesnt exist
            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });
        }
        const updatedCart = { items: updatedCartItems };
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
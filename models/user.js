const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({    
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addItemToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(item => { //this refers to a User
        return item.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0) { //product exists
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else { //product doesnt exist
        updatedCartItems.push({ 
            productId: product._id, 
            quantity: newQuantity 
        });
    }    
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeItemFromCart = function(id) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);


// const mongodb = require('mongodb');
// const mongo = require('../utils/database');

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // { items: [] }
//         this._id = id;
//     }

//     save() {
//         const db = mongo.getDb();
//         return db.collection('user').insertOne(this);
//     } 
    
//     addItemToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(item => {
//             return item.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if(cartProductIndex >= 0) { //product exists
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else { //product doesnt exist
//             updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });
//         }
        
//         const updatedCart = { items: updatedCartItems };
//         const db = mongo.getDb();
//         return db.collection('user').updateOne(
//             { _id: new mongodb.ObjectId(this._id)}, 
//             { $set: { cart: updatedCart }}
//         );
//     }

//     removeItemFromCart(id) {
//         const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
//         const updatedCart = { items: updatedCartItems };
//         const db = mongo.getDb();
//         return db.collection('user').updateOne(
//             { _id: new mongodb.ObjectId(this._id)}, 
//             { $set: { cart: updatedCart }}
//         );
//     }

//     getCart() {
//         const db = mongo.getDb();
//         //build an array of product Ids
//         const productIds = this.cart.items.map(item => {
//             return item.productId;
//         });
//         //fetch all products matching the Ids        
//         return db.collection('product').find({_id: { $in: productIds}}).toArray()
//         .then(products => {
//             return products.map(item => {
//                 return {...item, quantity: this.cart.items.find(i => {
//                     return i.productId.toString() === item._id.toString();
//                 }).quantity };
//             });
//         });
//     }

//     addOrder() {
//         const db = mongo.getDb();
//         return this.getCart().then(products => {
//             const newOrder = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             };
//             return db.collection('order').insertOne(newOrder);
//         })       
//         .then(result => {
//             this.cart = { items: [] };
//             return db.collection('user').updateOne(
//                 { _id: new mongodb.ObjectId(this._id)}, 
//                 { $set: { cart: { items: [] }}}
//             );
//         });
//     }

//     getOrders() {
//         const db = mongo.getDb();
//         return db.collection('order').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray();
//     }

//     static findById(id) {
//         const db = mongo.getDb();
//         return db.collection('user').findOne({ _id: new mongodb.ObjectId(id)});
//         //findOne() > returns one element
//         //find() > returns a cursor: find().next() returns one element
//     }
// }

// module.exports = User;
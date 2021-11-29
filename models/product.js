// const mongodb = require('mongodb');
// const mongo = require('../utils/database');

// class Product {
//     constructor(title, price, desc, image, userId, id) {
//         this.title = title;
//         this.price = price;
//         this.description = desc;
//         this.image = image;
//         this.userId = userId;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     //connect to mongodb and save
//     save() {
//         const db = mongo.getDb();
//         let dbOperation;
//         //if id is defined (product exists), update product
//         if(this._id) {
//             dbOperation = db.collection('product').updateOne({ _id: this._id }, {$set: this });
//         }
//         //if id undefined (new product), insert new product
//         else {
//             dbOperation = db.collection('product').insertOne(this);
//         }        
//         return dbOperation
//             .then(result => {
//                 //console.log(result);
//             })
//             .catch(err => console.log(err));
//     }

//     static fetchAll() {
//         const db = mongo.getDb();
//         return db.collection('product').find().toArray()
//         .then(products => {
//             //console.log(products);
//             return products;
//         })
//         .catch(err => console.log(err));     
//     }

//     static fetchById(id) {
//         const db = mongo.getDb();
//         return db.collection('product').find({ _id: new mongodb.ObjectId(id) }).next()
//         .then(product => {
//             console.log(product);
//             return product;
//         })
//         .catch(err => console.log(err));   
//     }

//     static deleteById(id) {
//         const db = mongo.getDb();
//         return db.collection('product').deleteOne({ _id: new mongodb.ObjectId(id) })
//         .then(result => {
//         })
//         .catch(err => console.log(err));   
//     }
// } 

// /*const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     image: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });*/

// module.exports = Product;
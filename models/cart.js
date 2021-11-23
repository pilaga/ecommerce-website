const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path_helper');
const Product = require('../models/product');

const filepath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {

    static getCart(cb) {
        fs.readFile(filepath, (err, data) => {
            const cart = JSON.parse(data);
            if(err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }

    static addProduct(id, price) {
        //fetch cart content
        fs.readFile(filepath, (err, data) => {
            let cart = { products: [], totalprice: 0 };
            if(!err) {
                cart = JSON.parse(data);
            }
            //check if product exists in cart
            //add new product or increase quantity
            const existingProductIndex = cart.products.findIndex(item => item.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = {...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            //update total price
            cart.totalprice = cart.totalprice + price;
            //save cart back to file
            fs.writeFile(filepath, JSON.stringify(cart), (err) => {
                console.log('save cart error', err);
            });            
        });     
    }

    static deleteProduct(id, price) {
        fs.readFile(filepath, (err, data) => {
            if(err) { //we didn't find a cart = nothing to delete
                return;
            }
            let cart = JSON.parse(data);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(item => item.id === id);
            if(!product) { //do not do anything if product is not in cart
                return;
            }
            const productQty = product.quantity;
            updatedCart.products = updatedCart.products.filter(item => item.id !== id); //remove product from cart
            updatedCart.totalprice = updatedCart.totalprice - price * productQty; //adjust cart total price
            //save cart back to file
            fs.writeFile(filepath, JSON.stringify(updatedCart), (err) => {
                console.log('save cart error', err);
            });   
        });
    }
}
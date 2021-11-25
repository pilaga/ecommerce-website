const mongo = require('../utils/database');

class Product {
    constructor(title, price, desc, image) {
        this.title = title;
        this.price = price;
        this.description = desc;
        this.image = image;
    }

    //connect to mongodb and save
    save() {
        const db = mongo.getDb();
        return db.collection('product').insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    }
} 

/*const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }
});*/

module.exports = Product;
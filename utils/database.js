const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const connectDb = (callback) => {
    //connect to mongodb cloud db
    MongoClient.connect('mongodb+srv://admin:password_02@cluster0.lrvxm.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No databse found!';
}

exports.connectDb = connectDb;
exports.getDb = getDb;
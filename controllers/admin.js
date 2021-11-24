const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('./admin/edit-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            editing: false
        });
}

exports.postAddProduct = (req, res, next) => {
    //retrieve data from form
    const title = req.body.title;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    //create and save new product
    Product.create({
        title: title,
        price: price,
        description: desc,
        image: image
    })
    .then(result => {
        //console.log(result);
        res.redirect('/admin/product-store');
    })
    .catch(err => {
        console.log(err);
    })    
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; //always a string
    if(!editMode) {
        return res.redirect('/');
    }    
    const productId = req.params.productId; 
    Product.findByPk(productId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('./admin/edit-product', 
            { 
                pagetitle: `Edit Product: ${product.title}`, 
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedtitle = req.body.title;
    const updatedprice = req.body.price;
    const updatedimage = req.body.image;
    const updateddesc = req.body.description;
    Product.findByPk(productId)
    .then(product => {
        product.title = updatedtitle;
        product.price = updatedprice;
        product.image = updatedimage;
        product.description = updateddesc;
        return product.save();
    })
    .then(result => {
        console.log('updated product: ', productId);
        res.redirect('/admin/product-store'); 
    })
    .catch(err => {
        console.log(err);
    });       
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
    .then(product => {
        return product.destroy();        
    })
    .then(result => {
        console.log('destroyed product:', productId);
        res.redirect('/admin/product-store');
    })
    .catch(err => {
        console.log(err);
    });    
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('./admin/product-store', 
            { 
                products: products,
                pagetitle: 'Product Store (Admin)', 
                path: "/admin/product-store"          
            });
    })
    .catch(err => {
        console.log(err);
    })
}
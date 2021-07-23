const Product = require('../models/product')
const formidable = require('formidable')
const lodash = require('lodash')
const fs = require('fs')



const create_product = (req, res) => {


    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({ error: 'Image could not uploaded' })
        }

        const product = new Product(fields)

        if (files.photo) {
            //1kb=1000
            //1mb= 1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({ error: 'Image size should be less than 1mb in size !' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: 'Product was not created !' })
            }
            res.json(result)
        })
    })

}

const productById = (req, res, next, id) => {

    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({ error: 'Could not find the product' })
            }
            req.product = product
            next()
        })
}

const read = (req, res) => {

    req.product.photo = undefined
    return res.json(req.product)
}

const delete_product = (req, res) => {

    const product = req.product
    product.remove((err, deleted) => {
        if (err) {
            return res.status(400).status({ error: 'Could not find the product' })
        }
        res.json({ message: 'Producted deleted successfully!' })
    })
}

const update_product = (req, res) => {


    const form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({ error: 'Image could not uploaded' })
        }

        let product = req.product

        product = lodash.extend(product, fields)

        if (files.photo) {
            //1kb=1000
            //1mb= 1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({ error: 'Image size should be less than 1mb in size !' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: 'Product was not created !' })
            }
            res.json(result)
        })
    })

}

/**
 * Sell/Arrival
 */
const list = async (req, res) => {

    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    await Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {

            if (err) {
                return res.status(400).json({ error: 'Products not found' })
            }
            return res.json(products)
        })
}

const related_products = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 2

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({ error: 'Products not found' })
            }
            res.json(products)
        })
}




const list_categories = async (req, res) => {

    await Product.distinct('category', {}, (err, categories) => {

        if (err) {
            return res.status(400).json({ error: 'categories not found' })
        }
        res.json(categories)
    })
}

// search func
const listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};



    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

const photo = (req, res, next) => {

    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

const listSearch = (req, res) => {

    const query = {}
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        Product.find(query, (err, bikes) => {
            if (err) {
                return res.status(400).json({ error: 'No bike found' })
            }
            res.json(bikes)
        }).select('-photo')
    }

}

const decreaseQuantity=(req, res, next)=>{

    let bulkOps=req.body.order.products.map((ite)=>{

        return {
            updateOne:{
                filter:{_id:item._id},
                update:{$inc:{quanity:-item.count, sold: + item.count}}
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (error, products)=>{

        if (error) {
            return res.status(400).josn({error: 'Could not update product'})
        }
        next()
    })

}
module.exports = {

    create_product,
    productById,
    read,
    delete_product,
    update_product,
    list,
    related_products,
    list_categories,
    listBySearch,
    photo,
    listSearch,
    decreaseQuantity

}
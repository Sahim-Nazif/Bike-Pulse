const Product= require('../models/product')
const formidable=require('formidable')
const lodash=require('lodash')
const fs=require('fs')



const create_product=(req, res)=>{


        const form= new formidable.IncomingForm()
        form.keepExtensions=true
        form.parse(req, (err,fields, files)=>{

             if (err){
                 return res.status(400).json({error:'Image could not uploaded'})
             }
  
             const product= new Product(fields)

             if (files.photo) {
                  //1kb=1000
                //1mb= 1000000
                 if (files.photo.size >1000000) {
                     return res.status(400).json({error:'Image size should be less than 1mb in size !'})
                 }
                 product.photo.data=fs.readFileSync(files.photo.path)
                 product.photo.contentType=files.photo.type
             }
             product.save((err, result)=>{
                 if (err){
                     return res.status(400).json({error:'Product was not created !'})
                 }
                 res.json(result)
             })
        })

}

const productById=(req, res, next, id)=>{

    Product.findById(id).exec((err, product)=>{
        if (err || !product){
            return res.status(400).json({error:'Could not find the product'})
        }
        req.product=product
        next()
    })
}

const read=(req, res)=>{

    req.product.photo=undefined
    return res.json(req.product)
}

const delete_product=(req, res)=>{

    const product=req.product
    product.remove((err, deleted)=>{
        if (err){
            return res.status(400).status({error:'Could not find the product'})
        }
        res.json({message:'Producted deleted successfully!'})
    })
}

const update_product=(req, res)=>{


    const form= new formidable.IncomingForm()
    form.keepExtensions=true
    form.parse(req, (err,fields, files)=>{

         if (err){
             return res.status(400).json({error:'Image could not uploaded'})
         }

        let product= req.product

         product=lodash.extend(product, fields)

         if (files.photo) {
              //1kb=1000
            //1mb= 1000000
             if (files.photo.size >1000000) {
                 return res.status(400).json({error:'Image size should be less than 1mb in size !'})
             }
             product.photo.data=fs.readFileSync(files.photo.path)
             product.photo.contentType=files.photo.type
         }
         product.save((err, result)=>{
             if (err){
                 return res.status(400).json({error:'Product was not created !'})
             }
             res.json(result)
         })
    })

}

/**
 * Sell/Arrival
 */
const list=async(req, res)=>{

    let order=req.query.order? req.query.order:'asc'
    let sortBy=req.query.sortBy ? req.query.sortBy: '_id'
    let limit=req.query.limit ? parseInt(req.query.limit):6

    await Product.find()
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, products)=>{
                
                if (err){
                    return res.status(400).json({error:'Products not found'})
                }
                return res.json(products)
            })
}

const related_products=(re, res)=>{

    let limit=req.query.limit ? parseInt(req.query.limit):6

    Product.find({_id:{$ne:req.product}, category:req.product.category})
            .limit(limit)
            .populate('category','_id name')
            .exec((err, products)=>{
                if (err){
                    return res.status(400).json({error:'Products not found'})
                }
                res.json(products)
            })
}




const list_categories=(req, res)=>{

    Product.distinct('category', {}, (err, categories)=>{

         if (err){
             return res.status(400).json({error:'categories not found'})
         }
         res.json(categories)
    })
}


module.exports={

    create_product,
    productById,
    read,
    delete_product,
    update_product,
    list,
    related_products,
    list_categories

}
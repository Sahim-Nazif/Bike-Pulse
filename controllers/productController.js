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



module.exports={

    create_product,
    productById,
    read,
    delete_product,
    update_product

}
const category = require('../models/category')
const Category=require('../models/category')


const create_category=async (req, res)=>{

    

    const category= new Category(req.body)
    const {name}=req.body
    const categoryExists= await Category.findOne({name})
 
    if ( categoryExists) {
        res.status(400).json({error:'This category name already exists !'})
    }
     else {
        category.save((err, data)=>{

            if (err){
                res.status(400).json({error:'Something went wrong. Please trying again !'})
            }
            res.json({data})
        })
     }

}

const category_ById=async(req, res, next , id)=> {

   await Category.findById(id).exec((err, category)=>{
        if (err || !category){
            return res.status(400).json({error:'Sorry Could not find the Category'})
        }
        req.category=category
        next()
    })
}

const read=(req, res)=>{

    let category=req.category
    return res.json(category)
}

const get_all_categories=async(req, res)=>{

        
        await Category.find().exec((err, categories)=>{
            if (err || !categories){
                return res.status(400).json({error:'There are no category to display'})
            }

            return res.json(categories);
        })
       
}

const delete_category=(req, res)=>{

    const category=req.category
    category.remove((err, removed)=>{

            if (err ) {
                return res.status(400).json({error:'Could not perform the operation'})
            }
            return res.status(200).json({message:'Category deleted successfully!'})
            
     })    
   
    
}

const update_category=(req, res)=>{

     const category=req.category
     category.name=req.body.name
     category.save((err, category)=>{
         if (err) {
             return res.status(400).json({error:'Could not update the category!'})
         }
         return res.json(category)
     })
}


module.exports={

    create_category,
    category_ById,
    read,
    get_all_categories,
    delete_category,
    update_category,

}
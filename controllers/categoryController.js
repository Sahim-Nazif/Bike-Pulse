const Category=require('../models/category')


const create_category=async (req, res)=>{

    

    const category= new Category(req.body)
    const {name}=req.body
    const categoryExists= await Category.findOne({name})
    if (categoryExists) {
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


module.exports={

    create_category
}
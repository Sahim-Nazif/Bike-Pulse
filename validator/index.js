

exports.userSignupValidator=(req,res,next)=>{


    req.check('firstName', 'First Name is required').notEmpty()
    req.check('lastName', 'Last Name is required').notEmpty()
    req.check('email', 'Email is required and the length should minimum 5 characters').notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({ 
        min:5,
        max:200
    })

    req.check('password', 'Please provide a password').notEmpty()
    req.check('password').notEmpty()
        .isLength({min:6})
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')

        const errors=req.validationErrors()

        //if error show the first one as it happen
        if (errors){
            const firstError=errors.map((error)=>error.msg)[0]
            return res.status(400).json({error:firstError})
        }
        //proceed to next middle ware
    
        next()
}
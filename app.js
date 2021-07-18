const express=require('express')
const app=express()
const mongoose=require('mongoose')
const morgan=require('morgan')
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const categoryRoutes=require('./routes/category')
const productRoutes=require('./routes/product')
const brainTreeRoutes=require('./routes/braintree')
const cookieParser=require('cookie-parser')
const expressValidator=require('express-validator')
const cors = require('cors')
require ('dotenv').config()

//db connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log('Mongo-DB Connected...'))
    .catch(err => console.log(err));


//middlewares
    if (process.env.NODE_ENV==='development') {
        app.use(morgan('dev'))
        console.log('the app is in development phase')
    
    } else if (process.env.NODE_ENV==='production') {
    
        console.log('the app is in production phase ')
    }



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
//routes
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api', brainTreeRoutes)
const port=process.env.PORT
app.listen(port, ()=>{
    console.log(`Server Running On Port: ${port}`)
})
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const morgan=require('morgan')
const userRoutes=require('./routes/user')
const cookieParser=require('cookie-parser')
const expressValidator=require('express-validator')

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
//routes
app.use('/api',userRoutes)
const port=process.env.PORT
app.listen(port, ()=>{
    console.log(`Server Running On Port: ${port}`)
})
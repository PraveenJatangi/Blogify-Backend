require('dotenv').config();
console.log("PORT from .env:", process.env.PORT);
const express= require('express');
const ejs = require('ejs');
const path= require('path');
const mongoose = require ('mongoose');

const cookieParser= require('cookie-parser');

const Blog= require ('./models/blog');

const userRoutes= require('./routes/user');
const blogRoutes= require('./routes/blog');




const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8001;

mongoose.connect( process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/blogify')
.then((e)=>{
console.log('mongodb is connected')
});

app.use(express.static('public'));
app.set("view engine","ejs");
app.set ("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("blogCookie"));
app.use(express.static(path.resolve("./public")));

app.get('/',async(req, res)=>{
    const allBlogs= await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    });

});
// app.use('/'.userRoutes);
app.use("/user",userRoutes);
app.use('/blog',blogRoutes);





app.listen(PORT,()=>{console.log(`App is listening at port ${PORT}` )});

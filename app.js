require('dotenv').config();
const express= require('express');
const ejs = require('ejs');
const path= require('path');
const mongoose = require ('mongoose');
const cors = require('cors');
const cookieParser= require('cookie-parser');

const Blog= require ('./models/blog');

const userRoutes= require('./routes/user');
const blogRoutes= require('./routes/blog');

const User = require('./models/user');


const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173', // your Vite frontend
    credentials: true
  }));

  //mongodb connection

mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("✅ MongoDB is connected successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

app.use(express.static('public'));
app.set("view engine","ejs");
app.set ("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());
app.use(checkForAuthenticationCookie("blogCookie"));
app.use(express.static(path.resolve("./public")));



app.get('/api', async (req, res) => {
  console.log("Authenticated user from cookie:", req.user);
  try {
    const blogs = await Blog.find({}).populate('createdBy');
    let user = null;
    if (req.user) {
      user = await User.findById(req.user._id).select('-password'); 
    }
    res.json({ blogs, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

  
// app.use('/'.userRoutes);
app.use("/user",userRoutes);
app.use('/blog',blogRoutes);





app.listen(PORT,()=>{console.log(`App is listening at port ${PORT}` )});

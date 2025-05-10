const {Router}= require ('express');
const User= require("../models/user")
const router = Router();
const jwt = require('jsonwebtoken');


// router.get('/',(req, res)=>{
//     res.render('home');
// });

router.get('/signup',(req,res)=>{
 return res.render('signup')
 
})

router.get('/logout',(req,res)=>{
   res.clearCookie('blogCookie').redirect('/');
})

router.get('/signin',(req, res)=>{
    return res.render('signin')
})

// router.post('/signin', async(req, res)=>{
//     const { email, password} = req.body;
//    try {
//    const token = await User.matchpasswordAndgeneratetoken( email, password)
//    return res.cookie('blogCookie',token).redirect('/');
//    } 
//  catch (error) {
//     return res.render('signin',{
//         error:"user not found"
//     });
//    }
// })
router.post('/signin', async (req, res) => {
   const { email, password } = req.body;
 
   try {
    const user = await User.findOne({ email })
      .lean();  

      if (!user) {
        throw new Error('User not found');
      }
      
     const token = await User.matchpasswordAndgeneratetoken(email, password);
     res.cookie('blogCookie', token, {
         httpOnly: true,
         secure: false, // set true if using https
         sameSite: 'Lax'
       });
      return res
      .status(200)
      .json({
        message: 'Login successful',
        token,
        user,   // <-- this is what your frontend needs for setUser(data.user)
      });
       
   } catch (error) {
     res.status(401).json({ message: "Invalid credentials" });
   }
 });
 

// router.post('/signup',async (req,res)=>{
//      const {firstName, email, password} = req.body;
//      await User.create({
//         firstName, email, password
//      });
//      return res.redirect('/')



// })

router.post('/signup', async (req, res) => {
   const { firstName, email, password } = req.body;
 
   try {
     const user = await User.create({ firstName, email, password });
     res.status(201).json({ message: "User created successfully", user });
   } catch (error) {
     if (error.code === 11000) {
       res.status(400).json({ message: "Email already exists" });
     } else {
       res.status(500).json({ message: "Signup failed", error });
     }
   }
 });
 


module.exports= router;
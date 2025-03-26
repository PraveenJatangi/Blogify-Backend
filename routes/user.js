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

router.post('/signin', async(req, res)=>{
    const { email, password} = req.body;
   try {
   const token = await User.matchpasswordAndgeneratetoken( email, password)
   return res.cookie('blogCookie',token).redirect('/');
   } 
 catch (error) {
    return res.render('signin',{
        error:"user not found"
    });
   }
})

router.post('/signup',async (req,res)=>{
     const {firstName, email, password} = req.body;
     await User.create({
        firstName, email, password
     });
     return res.redirect('/')



})



module.exports= router;
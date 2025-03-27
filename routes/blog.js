const {Router}= require ('express');
const router = Router();
const Blog= require("../models/blog");
const Comment= require('../models/comments')
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const path = require ('path');
const blog = require('../models/blog');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.resolve('./public/uploads'))
//     },
//     filename: function (req, file, cb) {
//       const fileName = `${Date.now()} + ${file.originalname}`
//       cb(null,fileName);
//     }
//   });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_images",
    format: async (req, file) => "png", // or 'jpeg', 'jpg'
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});


   const upload = multer({ storage: storage });

router.get('/add-blog',(req,res)=>{
return res.render('blog',{
    user:req.user
})  
});



router.post('/upload', upload.single('coverImage'), async(req,res)=>{
    const {title,body}= req.body;
     const blog =await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        CoverImgUrl:req.file.path, 
    });
      return res.redirect(`/blog/${blog._id}`);
    
})

router.get('/:id',async (req,res)=>{
   const oneblog =  await Blog.findById(req.params.id).populate("createdBy");
   const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");

   res.render("viewBlog",{
    user:req.user,
    blog:oneblog,
    comments
   });

})

router.post ("/comments/:blogId", async(req,res)=>{
      await Comment.create({
         content:req.body.content,
         blogId: req.params.blogId,
         createdBy: req.user._id
      });
    return res.redirect(`/blog/${req.params.blogId}`);
 })

module.exports= router;
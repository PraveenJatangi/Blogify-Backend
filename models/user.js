const mongoose= require ('mongoose');
const { createHmac , randomBytes} = require('crypto');
const {createJsonToken}=require('../servives/jwt')
const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    salt:{
        type: String,
        
    },
    password: {
        type: String,
        require: true

    },
    profileImgUrl:{
        type:String,
        default:'/defaults/blog-profile.jpeg'
      
    },

    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"

    },


},{timestamps:true})


userSchema.pre('save', function(next) {
 const user= this;

 if (!user.isModified("password")) return ;

 const salt= randomBytes(16).toString();
 const hashedpassword = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');

this.salt=salt;
this.password=hashedpassword;

  next();
});

//virtual function

userSchema.static('matchpasswordAndgeneratetoken',async function (email,password){
    const user = await this.findOne({email});

    if(!user) throw new Error("User Not Found");

    const salt= user.salt;
    const hashedpassword = user.password;

    const userPasswordHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(hashedpassword !== userPasswordHash) throw new Error("Wrong Password")
    // return hashedpassword == userPasswordHash;
    const token = createJsonToken (user);
    return token;
    
})

const User= mongoose.model("user",userSchema);
module.exports =User;
 

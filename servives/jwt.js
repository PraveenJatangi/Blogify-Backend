const jwt= require('jsonwebtoken');
const secret = process.env.SECRET;

function createJsonToken (user){
     const payload ={
        _id:user._id,
        email:user.email,
        password:user.password,
        firstName:user.firstName
     }
     const token=jwt.sign(payload,secret);
     return token;

}

function verifyUser (token){

    return jwt.verify(token,secret)
}

module.exports={createJsonToken,verifyUser}
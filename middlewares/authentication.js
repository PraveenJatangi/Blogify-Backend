const { verifyUser } = require("../servives/jwt");

 
 function checkForAuthenticationCookie(cookieName){

     return (req,res,next)=>{
        const tokenCookievalue= req.cookies[cookieName];
        if(!tokenCookievalue){
           return next();
        }

        try {
            const userPayload=verifyUser(tokenCookievalue);
            req.user=userPayload;
            
        } catch (error) {
            console.error("JWT verification failed:", error.message);
        }
        next();


     };
 }

 module.exports={checkForAuthenticationCookie}
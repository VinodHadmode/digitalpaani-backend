const jwt= require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    
    if(token){
        const decoded=jwt.verify(token,"masai")
        if(decoded){
            // console.log("decoded",decoded);
            req.body.userID=decoded.userId
            // console.log("reqbody",req.body);
            next()
        }else{
            res.status(200).send({msg:"Not authorized!!"})
        }
    }else{
        res.status(200).send({msg:"Please login!!"})
    }
}

module.exports={
    auth
}
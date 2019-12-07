module.exports=(req,res,next)=>{
    try{
        const userid = req.headers.authorization.split(" ")[1];
        console.log('auth data received')
        console.log(req.headers.authorization)
        req.userid = userid;
        console.log('Auth request Ok userid '+userid)
        next()
    }catch(err){
        console.log("Auth request Failed")
        res.status(401).json({status:"failed"})
    }
}
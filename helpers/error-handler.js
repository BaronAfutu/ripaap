function errorHandler(err,req,res,next){
    if(err){
        if(err.name = 'UnauthorizedError'){
            return res.status(401).json({satus:true,errMsg:"Invalid Token"});
        }
        else{
            return res.status(401).json({satus:false});
        }
    }
    next();
}

module.exports = errorHandler;
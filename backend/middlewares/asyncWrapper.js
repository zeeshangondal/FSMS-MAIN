
const asyncWrapper=(fn)=>{
    const func=async(req,res,next)=>{
        try {
            await fn(req,res,next);
        } catch (error) {
            next(error);
        }
    }
    return func
}

module.exports=asyncWrapper
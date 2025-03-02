export const errorHandler = async(err, req, res, next) =>{
    console.log(`${err.message}`)
    res.status(404)
}
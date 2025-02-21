export const errorHandler = async(err, req, res, next) =>{
    console.log(`${err.message}`)
    res.sendStatus(404)
}
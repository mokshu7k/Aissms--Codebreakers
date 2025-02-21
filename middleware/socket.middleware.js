const socketMiddleware = (io) => (req, res, next) => {
    req.io = io; // Attach the io instance to the request object
    next();
};

export default socketMiddleware;

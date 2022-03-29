const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            // Extract token from Bearer
            const token = req.headers.authorization.split(" ")[1];
            // JWT verification if token is valid.
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            req.userData = { userId: decodedToken.userId };
            next();
        } else res.status(401).end();
    } catch (error) {
        res.status(401).end();
    }
};

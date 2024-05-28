// middleware tp authenticate user to access the api
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const auth = async (req, res, next) => {
    try {
        // get token from header
        const token = req.header("Authorization").replace("Bearer ", "");
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // find user
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });
        // check if user exists
        if (!user) {
            throw new Error();
        }
        // set user and token
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate" });
    }
};

module.exports = auth;
const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerUser = async (req, res, next) => {
    try {
        if (req.body.email === undefined || req.body.password === undefined) {
            return res.status(400).send();
        }

        if (await User.exists({ email: req.body.email })) {
            // Email address is already registered.
            return res.status(409).send();
        }

        // Hash password
        const hash = await bcrypt.hash(req.body.password, 10);

        // New user using the hashed password and default settings.
        const user = new User({
            email: req.body.email,
            password: hash,
            created: Date.now()
        });

        // Save the user.
        const result = await user.save();

        // Sign new JWT /jot/ token and send it.
        const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, {
            expiresIn: "1h"
        });

        return res.status(201).json({
            token: token,
            expiresIn: 3600,
            userId: user._id,
            email: user.email,
            created: user.created
        });
    } catch (error) {
        res.status(500).send();
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        if (req.body.email === undefined || req.body.password === undefined) {
            return res.status(400).send();
        }

        let fetchedUser = await User.findOne({ email: req.body.email });

        if (!fetchedUser) {
            return res.status(404).send();
        }

        // Check if password matches the stored one.
        if (!(await bcrypt.compare(req.body.password, fetchedUser.password))) {
            return res.status(401).send();
        }

        // Sign new JWT /jot/ token and send it.
        const token = jwt.sign({ userId: fetchedUser._id }, process.env.JWT_KEY, {
            expiresIn: "1h"
        });

        return res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            email: fetchedUser.email,
            created: fetchedUser.created
        });
    } catch (error) {
        return res.status(500).send();
    }
};

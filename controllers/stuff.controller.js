const Stuff = require("../models/stuff.schema");
const Cart = require("../models/cart.schema");
const User = require("../models/user.schema");

exports.getStuff = async (req, res, next) => {
    try {
        Stuff.find((err, stuff) => {
            if (err) return res.status(500).send("Error, while searching for stuff");
            return res.status(200).send(stuff);
        });
    } catch (error) {
        res.status(500).send();
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const fetchedUser = await User.findOne({ _id: req.userData.userId });
        if (!fetchedUser) {
            return res.status(401).send();
        }

        const cart = await Cart.find({ userId: fetchedUser._id });
        const stuff = await Stuff.find();
        const result = [];
        cart.forEach(cartItem => {
            stuff.forEach(item => {
                if (cartItem.productId === item._id.toString()) {
                    result.push(item);
                }
            });
        });

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).send();
    }
};

exports.createStuff = async (req, res, next) => {
    try {
        if (req.body.name === undefined || req.body.quantity === undefined || req.body.quantity === undefined) {
            return res.status(400).send();
        }

        if (await Stuff.exists({ name: req.body.name, quality: req.body.quality })) {
            return res.status(409).send();
        }

        const stuff = new Stuff({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            quality: req.body.quality ?? "C"
        });

        // Save the stuff.
        await stuff.save();

        return res.status(201).send("Stuff saved successfully");
    } catch (error) {
        res.status(500).send();
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const fetchedUser = await User.findOne({ _id: req.userData.userId });
        if (!fetchedUser) {
            return res.status(401).send();
        }

        if (req.body.productId === undefined) {
            return res.status(400).send();
        }

        const cart = new Cart({
            userId: fetchedUser._id,
            productId: req.body.productId
        });

        // Save the stuff.
        await cart.save();

        const product = await Stuff.findOne({ _id: req.body.productId });

        return res.status(201).send(product);
    } catch (error) {
        res.status(500).send();
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const fetchedUser = await User.findOne({ _id: req.userData.userId });
        if (!fetchedUser) {
            return res.status(401).send();
        }

        await Cart.findOneAndDelete({ userId: fetchedUser._id, productId: req.params.productId });

        const newItems = await Cart.find({ userId: fetchedUser._id });
        const stuff = await Stuff.find();
        const result = [];
        newItems.forEach(cartItem => {
            stuff.forEach(item => {
                if (cartItem.productId === item._id.toString()) {
                    result.push(item);
                }
            });
        });

        return res.status(200).send(result);
    } catch (error) {
        res.status(500).send();
    }
};

exports.removeAllItemsFromCart = async (req, res, next) => {
    try {
        const fetchedUser = await User.findOne({ _id: req.userData.userId });
        if (!fetchedUser) {
            return res.status(401).send();
        }

        await Cart.deleteMany({ userId: fetchedUser._id });

        return res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
};

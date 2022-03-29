const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user.routes");
const stuffRoutes = require("./routes/stuff.routes");

mongoose
    .connect(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(() => {
        console.log("Connection failed");
    });

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

// CORS settings
app.use(cors({ origin: true, credentials: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/stuff", stuffRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});

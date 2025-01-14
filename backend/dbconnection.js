const mongoose = require("mongoose");

const connectToDb = () => {
    mongoose.connect("mongodb://localhost:27017/redsocialproyecto")
        .then(() => console.log("Conectado a la base de datos"))
        .catch((err) => console.error("Error al conectar a MongoDB", err));
};

module.exports = connectToDb;


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDb = require("./dbconnection");
const usuarioRoutes = require("./usuarioRoutes");
const postRoutes = require("./postRoutes"); 

const app = express();


app.use(cors());
app.use(bodyParser.json());


connectToDb();


app.use("/api/usuarios", usuarioRoutes);
app.use("/api/posts", postRoutes); 


const PORT = 3900;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

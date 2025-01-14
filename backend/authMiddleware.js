const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
  
    const decoded = jwt.verify(token, "mi_secreto_jwt");
    req.user = decoded; 
    next(); 
  } catch (error) {
   
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;

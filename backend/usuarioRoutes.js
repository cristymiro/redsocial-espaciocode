const express = require("express");
const Usuario = require("./usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Usuario.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo o nombre de usuario ya están en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ name, email, password: hashedPassword });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario._id }, "mi_secreto_jwt", { expiresIn: "1h" });

    res.json({
      mensaje: "Login exitoso",
      token,
      name: usuario.name,
      postCount: usuario.postCount
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el login", error });
  }
});


router.get("/me", async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, "mi_secreto_jwt");
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({
      name: usuario.name,
      email: usuario.email,
      postCount: usuario.postCount
    });
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
});

module.exports = router;


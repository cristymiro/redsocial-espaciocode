const express = require("express");
const Post = require("./post");
const Usuario = require("./usuario"); 
const authMiddleware = require("./authMiddleware"); 

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { id: userId } = req.user; 

  if (!content) {
    return res.status(400).json({ message: "El contenido de la publicación no puede estar vacío" });
  }

  try {
    
    const post = new Post({
      content,
      author: userId,
    });
    await post.save();

    
    await Usuario.updateOne({ _id: userId }, { $inc: { postCount: 1 } });

    
    res.status(201).json({ message: "Publicación creada con éxito", post });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la publicación", error });
  }
});


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name") 
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las publicaciones", error });
  }
});

module.exports = router;

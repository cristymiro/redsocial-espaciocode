
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

    const updateResult = await Usuario.updateOne(
      { _id: userId },
      { $inc: { postCount: 1 } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado al actualizar postCount" });
    }

    res.status(201).json({ message: "Publicación creada con éxito", post });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).json({ message: "Error al crear la publicación", error });
  }
});


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: { $ne: true } })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ message: "Error al obtener las publicaciones", error });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No puedes eliminar esta publicación" });
    }

    post.isDeleted = true;
    await post.save();

    
    await Usuario.updateOne(
      { _id: userId },
      { $inc: { postCount: -1 } }
    );

    res.json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    res.status(500).json({ message: "Error al eliminar la publicación", error });
  }
});

module.exports = router;



const jwt_decode = window.jwt_decode;

document.addEventListener('DOMContentLoaded', async () => {
 
  const shareButton = document.getElementById('share-button');
  const postContent = document.getElementById('post-content');
  const postsList = document.getElementById('posts-list');
  const userNameElement = document.getElementById('user-name');
  const postsCountElement = document.getElementById('posts-count'); 

  
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("Por favor, inicia sesión para acceder al dashboard.");
    window.location.href = "./login.html";
    return;
  }

  const { token, user } = storedUser;

 
  if (isTokenExpired(token)) {
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem("user");
    window.location.href = "./login.html";
    return;
  }

  
  const userName = user?.name || "Usuario Anónimo"; 
  userNameElement.textContent = userName;

 
  postsCountElement.textContent = user?.postCount || 0;

 
  async function cargarPublicaciones() {
    try {
      const response = await fetch("http://localhost:3900/api/posts", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("user");
        window.location.href = "./login.html";
        return;
      }

      const posts = await response.json();
      if (response.ok) {
        postsList.innerHTML = "";
        posts.forEach(post => {
          const postElement = createPostElement(post);
          postsList.appendChild(postElement);
        });
      } else {
        alert("Error al cargar las publicaciones.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al cargar las publicaciones.");
    }
  }

 
  cargarPublicaciones();

 
  shareButton.addEventListener('click', async () => {
    const content = postContent.value.trim();

    if (content === '') {
      alert('Por favor, escribe algo antes de compartir.');
      return;
    }

    
    if (isTokenExpired(token)) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("user");
      window.location.href = "./login.html";
      return;
    }

    try {
      const response = await fetch("http://localhost:3900/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("user");
        window.location.href = "./login.html";
        return;
      }

      const data = await response.json();
      if (response.ok) {
        alert("Publicación creada con éxito.");
        postsList.prepend(createPostElement(data.post));

     
        postsCountElement.textContent = parseInt(postsCountElement.textContent) + 1;
      } else {
        alert(data.message || "Error al crear la publicación.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear la publicación.");
    }

    postContent.value = ''; 
  });


  function isTokenExpired(token) {
    const decoded = jwt_decode(token);
    const currentTime = Math.floor(Date.now() / 1000); 
    return decoded.exp < currentTime;
  }


  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES');
    postElement.innerHTML = `
      <p><strong>${post.author.name}</strong> dijo:</p>
      <p>${post.content}</p>
      <small>Publicado el ${formattedDate}</small>
    `;
    return postElement;
  }
});


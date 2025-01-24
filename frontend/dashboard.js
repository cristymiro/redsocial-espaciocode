const jwt_decode = window.jwt_decode;

document.addEventListener('DOMContentLoaded', async () => {
  const shareButton = document.getElementById('share-button');
  const postContent = document.getElementById('post-content');
  const postsList = document.getElementById('posts-list');
  const userNameElement = document.getElementById('user-name');
  const postsCountElement = document.getElementById('posts-count');
  const followingCountElement = document.getElementById('following-count'); 

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

  
  async function cargarDatosUsuario() {
    try {
      const response = await fetch("http://localhost:3900/api/usuarios/me", {
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

      const data = await response.json();

      if (response.ok) {
        postsCountElement.textContent = data.postCount || 0;
      } else {
        alert(data.message || "Error al cargar la información del usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al cargar la información del usuario.");
    }
  }

 
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

  
  shareButton.addEventListener('click', async () => {
    const content = postContent.value.trim();
    if (!content) {
      alert("Por favor, escribe algo antes de compartir.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3900/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const result = await response.json();

      if (response.ok) {
        postContent.value = ''; 
        cargarPublicaciones(); 

        
        const currentPostCount = parseInt(postsCountElement.textContent, 10) || 0;
        postsCountElement.textContent = currentPostCount + 1;
      } else {
        alert(result.message || "No se pudo crear la publicación.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear la publicación.");
    }
  });

 
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-post')) {
      const postId = event.target.closest('.post').dataset.id;
      
      try {
        const response = await fetch(`http://localhost:3900/api/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
         
          const postElement = document.querySelector(`.post[data-id="${postId}"]`);
          if (postElement) {
            postElement.remove();
          }
          alert('Publicación eliminada correctamente.');
        } else {
          alert('No se pudo eliminar la publicación.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al eliminar la publicación.');
      }
    }
  });

  
  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.dataset.id = post._id;

    const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES');


    const deleteButton = '<button class="delete-post">🗑️</button>'; 
    const starButton = '<button class="follow-button">⭐</button>'; 

    postElement.innerHTML = `
      <p><strong>${post.author.name}</strong> dijo:</p>
      <p>${post.content}</p>
      <small>Publicado el ${formattedDate}</small>
      <div class="post-buttons-container">
        ${deleteButton}
        ${starButton} <!-- Añadimos el botón de estrella aquí -->
      </div>
    `;

    
    const starButtonElement = postElement.querySelector('.follow-button');
    starButtonElement.addEventListener('click', () => {
      let followingCount = parseInt(followingCountElement.textContent, 10);
      followingCount += 1; 
      followingCountElement.textContent = followingCount;
    });

    return postElement;
  }

  function isTokenExpired(token) {
    const decoded = jwt_decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

 
  cargarDatosUsuario();
  cargarPublicaciones();
});

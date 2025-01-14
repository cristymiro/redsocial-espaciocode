document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

 
  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
          alert('Por favor, completa todos los campos.');
          return;
      }

    
      try {
          const response = await fetch("http://localhost:3900/api/usuarios/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
           
              localStorage.setItem('user', JSON.stringify({
                  token: data.token,
                  user: { name: data.name }, 
              }));

              alert('Inicio de sesión exitoso. Redirigiendo al dashboard...');
              window.location.href = "./dashboard.html"; 
          } else {
              alert(data.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Hubo un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
      }
  });
});

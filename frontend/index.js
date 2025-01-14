
document.getElementById("btn-login").addEventListener("click", () => {
    window.location.href = "./login.html";
});

document.getElementById("btn-register").addEventListener("click", () => {
    window.location.href = "./register.html";
});

document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Has cerrado sesión.");
    window.location.href = "./index.html";
});

/*Mensaje de bienvenida si el usuario ha iniciado sesión*/
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    document.getElementById("welcome-message").textContent = `Hola, ${user.name}`;
    document.getElementById("btn-logout").style.display = "block";
}


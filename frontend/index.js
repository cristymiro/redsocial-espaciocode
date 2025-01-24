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


const userData = JSON.parse(localStorage.getItem("user"));

if (userData) {
    
    console.log("User data: ", userData); 
    document.getElementById("welcome-message").textContent = `Hola, ${userData.user?.name || "Invitado"}`;
    document.getElementById("btn-logout").style.display = "block";
} else {
    console.log("No hay datos en localStorage");
}

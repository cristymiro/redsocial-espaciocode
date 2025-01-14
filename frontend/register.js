document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3900/api/usuarios/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.mensaje);
        } else {
            alert(data.mensaje || "Error al registrar");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo completar el registro");
    }
});

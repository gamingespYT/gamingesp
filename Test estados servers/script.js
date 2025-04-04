document.addEventListener("DOMContentLoaded", function() {
    const estadoServidoresDiv = document.getElementById("estado-servidores");

    // Diccionario de traducción de estados
    const traduccionEstados = {
        "operational": "Operativo",
        "degraded_performance": "Rendimiento degradado",
        "partial_outage": "Interrupción parcial",
        "major_outage": "Interrupción mayor"
    };

    fetch("https://status.epicgames.com/api/v2/components.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const componentes = data.components;
            estadoServidoresDiv.innerHTML = ""; // Limpiar el contenido previo

            componentes.forEach(componente => {
                const divComponente = document.createElement("div");
                const estado = componente.status;
                divComponente.classList.add("componente", estado);
                divComponente.textContent = `${componente.name}: ${traduccionEstados[estado] || estado}`;
                estadoServidoresDiv.appendChild(divComponente);
            });
        })
        .catch(error => {
            console.error("Error al obtener el estado de los servidores:", error);
            estadoServidoresDiv.textContent = "No se pudo cargar el estado de los servidores.";
        });
});

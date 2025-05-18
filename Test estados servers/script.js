document.addEventListener("DOMContentLoaded", function() {
    const estadoServidoresDiv = document.getElementById("estado-servidores");
    const estadoGeneral = document.getElementById("estado-general");
    const toggleBtn = document.getElementById("toggle-details");
    const detallesContainer = document.getElementById("estado-detallado");

    // Diccionario de traducción de estados
    const traduccionEstados = {
        "operational": "Operativo",
        "degraded_performance": "Rendimiento degradado",
        "partial_outage": "Interrupción parcial",
        "major_outage": "Interrupción mayor"
    };

    // Mapeo de nombres de servicios de la API a nuestros data-service
    const serviciosMap = {
        "Website": "website",
        "Game Services": "game",
        "Login": "login",
        "Parties, Friends, and Messaging": "friends",
        "Voice Chat": "voice",
        "Matchmaking": "matchmaking",
        "Stats & Leaderboards": "stats",
        "Item Shop": "store"
    };

    toggleBtn.addEventListener("click", () => {
        const isHidden = detallesContainer.classList.toggle("hidden");
        toggleBtn.textContent = isHidden ? "Ver detalles" : "Ocultar detalles";
    });

    function actualizarEstados() {
        fetch("https://status.epicgames.com/api/v2/components.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const componentes = data.components;
                let estadoGlobal = "operational";

                componentes.forEach(componente => {
                    const serviceId = serviciosMap[componente.name];
                    if (serviceId) {
                        const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
                        if (serviceCard) {
                            const indicator = serviceCard.querySelector('.status-indicator');
                            if (indicator) {
                                indicator.className = `status-indicator ${componente.status}`;
                            }
                        }
                    }

                    if (componente.name === "Fortnite") {
                        estadoGlobal = componente.status;
                    }
                });

                estadoGeneral.textContent = traduccionEstados[estadoGlobal] || "Estado desconocido";
                estadoGeneral.className = `status-badge ${estadoGlobal}`;

                // Actualizar estado detallado
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
                estadoGeneral.textContent = "Error al cargar";
                estadoGeneral.className = "status-badge major_outage";
                estadoServidoresDiv.textContent = "No se pudo cargar el estado de los servidores.";
            });
    }

    // Actualización inicial
    actualizarEstados();

    // Actualizar cada 5 minutos
    setInterval(actualizarEstados, 300000);
});

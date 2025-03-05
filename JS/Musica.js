document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos la imagen del logo
    const logo = document.querySelector("img[src='./img/logo.png']");
    
    // Creamos un elemento de audio
    const audio = new Audio("./Sonidos/BTsong.mp3"); // Reemplaza con la URL de la canción
    
    // Variable para el contenedor de los emojis
    let emojiContainer;
    let emojiInterval;

    // Agregamos un evento de clic al logo
    logo.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            startFallingEmojis(); // Iniciar emojis al reproducir la canción
        } else {
            audio.pause();
            audio.currentTime = 0;
            stopFallingEmojis(); // Detener emojis al pausar la canción
        }
    });

    // Crear tooltip con mejor diseño
    const tooltip = document.createElement("div");
    tooltip.textContent = "🔊✨ ¡Púlsame para escuchar la canción! 🎤🎧";
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontWeight = "bold";
    tooltip.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    tooltip.style.visibility = "hidden";
    tooltip.style.transition = "opacity 0.3s ease-in-out";
    tooltip.style.opacity = "0";
    tooltip.style.pointerEvents = "none";
    tooltip.style.zIndex = "1000";
    document.body.appendChild(tooltip);

    // Mostrar tooltip al pasar el mouse
    logo.addEventListener("mouseover", function (event) {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
        tooltip.style.top = event.pageY + 15 + "px";
        tooltip.style.left = event.pageX + 15 + "px";
    });

    // Mover tooltip con el mouse
    logo.addEventListener("mousemove", function (event) {
        tooltip.style.top = event.pageY + 15 + "px";
        tooltip.style.left = event.pageX + 15 + "px";
    });

    // Ocultar tooltip cuando el mouse sale
    logo.addEventListener("mouseout", function () {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });

    // Función para crear emojis que caen
    function startFallingEmojis() {
        // Crear el contenedor de los emojis solo cuando se hace clic en el logo
        emojiContainer = document.createElement("div");
        emojiContainer.style.position = "fixed"; // Usamos fixed para que esté en una capa flotante
        emojiContainer.style.top = "0";
        emojiContainer.style.left = "0";
        emojiContainer.style.pointerEvents = "none"; // Asegura que no interfieran con la interacción del usuario
        emojiContainer.style.zIndex = "999"; // Aseguramos que esté encima de otros elementos pero sin interferir
        emojiContainer.style.height = "0"; // Evitamos que afecte la altura de la página
        document.body.appendChild(emojiContainer);

        emojiInterval = setInterval(function () {
            const emoji = document.createElement("div");
            emoji.textContent = "🎉"; // Emoji que caerá, puedes agregar más si deseas
            emoji.style.position = "absolute";
            emoji.style.left = `${Math.random() * window.innerWidth}px`;
            emoji.style.top = "-30px"; // Comienza desde arriba
            emoji.style.fontSize = "30px"; // Tamaño del emoji
            emoji.style.animation = "fall 4s forwards"; // Cambié "infinite" por "forwards" para que solo caigan una vez
            emoji.style.pointerEvents = "none"; // Para que no interfieran con otros elementos
            emojiContainer.appendChild(emoji);

            // Eliminar el emoji después de que termine la animación
            emoji.addEventListener('animationend', function () {
                emoji.remove();
            });
        }, 300); // Intervalo para crear un emoji
    }

    // Función para detener la caída de emojis
    function stopFallingEmojis() {
        clearInterval(emojiInterval);
        const emojis = emojiContainer.querySelectorAll('div');
        emojis.forEach(emoji => {
            // Solo eliminar los emojis (no eliminar otros elementos como el tooltip o el logo)
            if (emoji.textContent === "🎉") {
                emoji.remove();
            }
        });
    }

    // CSS adicional para la animación de los emojis (para hacer que caigan)
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes fall {
        0% {
            top: -30px;
        }
        100% {
            top: 100vh; /* Debería caer fuera del área visible sin afectar el desplazamiento */
        }
    }
    `;
    document.head.appendChild(style);
});
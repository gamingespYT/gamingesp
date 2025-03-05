document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos la imagen del logo
    const logo = document.querySelector("img[src='./img/logo.png']");
    
    // Creamos un elemento de audio
    const audio = new Audio("./Sonidos/BTsong.mp3"); // Reemplaza con la URL de la canción
    
    // Agregamos un evento de clic al logo
    logo.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
            audio.currentTime = 0;
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
});
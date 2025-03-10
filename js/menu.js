document.addEventListener("DOMContentLoaded", function () {
    // Crear el HTML del menú
    const menuHTML = `
    <header id="menu">
        <input type="checkbox" id="menu-toggle">
        <label for="menu-toggle" class="hamburger">&#9776;</label>
        <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="mapas.html">Mapas</a></li>
            <li><a href="redes.html">Redes Sociales</a></li>
            <li><a href="staff.html">Postulación para STAFF</a></li>
            <li><a href="juegos.html">Juegos</a></li>
        </ul>
    </header>
    `;

    // Crear el CSS del menú
    const menuCSS = `
    /* Estilos del menú */
    #menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgba(51, 51, 51, 0.9);
        color: white;
        padding: 10px 20px;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    #menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    
    #menu ul li {
        flex: 1;
        text-align: center;
    }
    
    #menu ul li a {
        text-decoration: none;
        color: white;
        font-family: 'Verdana', sans-serif;
        font-size: 18px;
        padding: 10px 20px;
        transition: background-color 0.3s ease;
    }
    
    #menu ul li a:hover {
        background-color: #d34b74;
        border-radius: 5px;
    }
    
    /* Menú hamburguesa (responsive) */
    .hamburger {
        display: none;
        font-size: 30px;
        cursor: pointer;
        color: white;
        position: absolute;
        top: 15px;
        left: 20px;
        z-index: 1010;
        transition: transform 0.3s ease;
    }
    
    .hamburger:hover {
        transform: scale(1.1);
    }
    
    #menu-toggle {
        display: none;
    }
    
    @media (max-width: 768px) {
        #menu {
            justify-content: space-between;
            padding: 10px;
        }

        #menu ul {
            display: none;
            flex-direction: column;
            background-color: rgba(51, 51, 51, 0.9);
            position: absolute;
            top: 50px;
            left: 0;
            width: 100%;
            padding: 0;
        }

        #menu-toggle:checked + .hamburger + ul {
            display: flex;
        }

        .hamburger {
            display: block;
            font-size: 35px;
            top: 10px;
            left: 10px;
        }

        #menu ul li {
            margin: 5px 0;
            text-align: center;
        }

        #menu ul li a {
            display: block;
            padding: 10px;
            font-size: 18px;
        }
    }
    `;

    // Insertar el HTML en el <body>
    document.body.insertAdjacentHTML("afterbegin", menuHTML);

    // Crear e insertar el <style> en el <head>
    const styleTag = document.createElement("style");
    styleTag.innerHTML = menuCSS;
    document.head.appendChild(styleTag);

    // Cerrar menú automáticamente cuando se hace clic en un enlace
    document.querySelectorAll("#menu ul li a").forEach(link => {
        link.addEventListener("click", () => {
            document.getElementById("menu-toggle").checked = false;
        });
    });
});

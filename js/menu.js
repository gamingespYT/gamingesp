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
            <li><a href="juegos.html">Juegos</a></li>
            <li><a href="staff.html">Postulación para STAFF</a></li>
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

    // Crear el HTML del banner
    const bannerHTML = `
    <div id="cookie-banner">
        <div class="cookie-content">
            <p>© 2025 Gaming España. Todos los derechos reservados. Este sitio utiliza Google Analytics para recopilar datos de navegación y mejorar la experiencia del usuario.</p>
            <button id="accept-cookies">Aceptar</button>
        </div>
    </div>
    `;

    // Añadir estilos del banner
    const bannerCSS = `
    #cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(25, 25, 25, 0.95);
        backdrop-filter: blur(10px);
        z-index: 9999;
        padding: 15px;
        box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
        font-family: 'Arial', sans-serif !important;
    }

    .cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }

    #cookie-banner p {
        color: white;
        margin: 0;
        font-size: 14px !important;
        line-height: 1.5;
        flex: 1;
        font-family: inherit !important;
        text-align: left !important;
        padding: 0 !important;
    }

    #accept-cookies {
        background-color: #d34b74;
        color: white;
        border: none;
        padding: 10px 20px !important;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        white-space: nowrap;
        min-width: 120px;
        height: 40px !important;
        font-size: 16px !important;
        font-family: inherit !important;
        line-height: 1 !important;
        margin: 0 !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        text-transform: none !important;
        box-shadow: none !important;
    }

    #accept-cookies:hover {
        background-color: #b33960;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        .cookie-content {
            flex-direction: column;
            text-align: center;
        }

        #cookie-banner p {
            font-size: 13px !important;
            margin-bottom: 15px !important;
            text-align: center !important;
        }

        #accept-cookies {
            width: 100%;
            max-width: 200px;
            height: 45px !important;
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

    // Modificar la lógica del banner
    if (!sessionStorage.getItem('cookiesAccepted')) {
        document.body.insertAdjacentHTML("beforeend", bannerHTML);
        styleTag.innerHTML += bannerCSS;

        document.getElementById('accept-cookies').addEventListener('click', () => {
            const banner = document.getElementById('cookie-banner');
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            banner.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                banner.remove();
            }, 500);
            sessionStorage.setItem('cookiesAccepted', 'true');
        });
    }
});

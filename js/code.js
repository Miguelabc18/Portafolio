document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. SELECTORES Y DATOS (LIMPIOS)
    // ===================================================================
    const mainWrapper = document.getElementById('main-wrapper');
    const btnVolverMapa = document.getElementById('btn-volver-mapa');
    const vistaMapa = document.getElementById('vista-inicial'); 
    const descripcion = document.getElementById('Descripcion');
    const button = document.getElementById('btn-desplegar-main'); // Botón de giro/toggle

    // Referencias de Header
    const tituloTextoElemento = document.getElementById('titulo-header');
    const descripcionTextoElemento = document.getElementById('descripcion-header');

    // Referencias de Contenido
    const secciones = document.querySelectorAll('.contenido-seccion');
    const navLinks = document.querySelectorAll('#navegacion a[data-target]');
    const mapaPuntos = document.querySelectorAll('.punto-mapa[data-target]');
    
    // Textos Estáticos
    const TITULO_MAPA = 'DESARROLLO WEB - FULLSTACK'; 
    const TITULO_ALTERNO = 'MAPA ESTELAR - ESTRELLAS Y SUEÑOS'; // Título para la vista de mapa abierto
    const TEXTO_MAPA = '¡Hola! Te doy la bienvenida a mi camino en el <span class="palabras-descripcion-header">universo</span> de la <span class="palabras-descripcion-header">programación</span>.';
    const TEXTO_ALTERNO = '¡Empieza tu <span class="palabras-descripcion-header">aventura espacial</span>! Visita cada planeta y descubre sus <span class="palabras-descripcion-header">secretos cósmicos</span>.';

    // ===================================================================
    // 2. FUNCIONES DE CONTROL DE ESTADO (OPTIMIZADAS)
    // ===================================================================
    
    // Función que muestra solo una sección y oculta todas las demás
    function mostrarSeccion(targetId) {
        secciones.forEach(sec => sec.style.display = 'none');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    // Controla la clase 'abierto' en el wrapper principal y el body
    function toggleMainWrapper(isOpen) {
        // Asegúrate de que SÓLO maneje las clases 'abierto' y la animación de giro.
        if (isOpen) {
            descripcion.removeEventListener('animationend', handleAnimationEnd);
            descripcion.classList.remove('cerrando'); 
            mainWrapper.classList.add('abierto'); // <-- Usar mainWrapper
            document.body.classList.add('abierto');
            descripcionTextoElemento.innerHTML = TEXTO_ALTERNO;
            tituloTextoElemento.innerHTML = TITULO_ALTERNO;
        } else {
            descripcion.addEventListener('animationend', handleAnimationEnd);
            descripcion.classList.add('cerrando');
            descripcionTextoElemento.innerHTML = TEXTO_MAPA;
            tituloTextoElemento.innerHTML = TITULO_MAPA;
            setTimeout(() => {
                mainWrapper.classList.remove('abierto'); // <-- Usar mainWrapper
                document.body.classList.remove('abierto');
            }, 100);
        }
        
        button.classList.add('girando'); 
        setTimeout(() => { button.classList.remove('girando'); }, 700); 
    }
    

    // Maneja la animación de salida (dejarla tal cual)
    function handleAnimationEnd(event) {
        if (event.animationName === 'slide-out-titulo') {
            descripcion.classList.remove('cerrando');
            descripcion.removeEventListener('animationend', handleAnimationEnd);
        }
    }
    
    // Controla la visibilidad del botón de volver
    function actualizarBotonVolver(esVisible) {
        btnVolverMapa.classList.toggle('visible', esVisible);
        btnVolverMapa.classList.toggle('oculto', !esVisible);
    }

    // Actualiza el título, el color de neón en el wrapper
    function actualizarEstilosSeccion(datos) {
        if (datos && mainWrapper) {
            mainWrapper.style.setProperty('--color-principal', datos.colorPrincipal);
        } else {
            mainWrapper.style.removeProperty('--color-principal');
        }
    }

    // -----------------------------------------------------------------
    // 🔥 FUNCIÓN CENTRAL DE NAVEGACIÓN (IR A UN PLANETA)
    // -----------------------------------------------------------------
    function navegarASeccion(marcador) {
        const targetId = marcador.getAttribute('data-target');
        const datos = obtenerDatosPlaneta(marcador.id);
        
        // 1. Control del mapa y el wrapper (Sección de detalle)
        if (vistaMapa) {
            vistaMapa.style.display = 'none'; // Ocultar mapa
        }
        document.title = `${datos.titulo} | Miguel Barrios`;
        mostrarSeccion(targetId);
        
        // 2. Actualizar la UI
        actualizarBotonVolver(true);
        actualizarEstilosSeccion(datos);
        ocultarPopup(); // Si está visible
    }

    // -----------------------------------------------------------------
    // FUNCIÓN DE RETORNO AL MAPA
    // -----------------------------------------------------------------

    function volverAlMapa() {
        document.title = "Miguel Barrios | Portafolio Espacial";
        mostrarSeccion('vista-inicial');
        actualizarBotonVolver(false);
        actualizarEstilosSeccion(null);
    }

    // ===================================================================
    // 3. EVENT LISTENERS
    // ===================================================================

    // Inicialización al cargar
    mostrarSeccion('vista-inicial');

    // 1. Evento del botón desplegable (Controla la apertura/cierre del Main Wrapper)
    button.addEventListener('click', function() {
        toggleMainWrapper(!mainWrapper.classList.contains('abierto'));
        
        // Lógica para volver al mapa si se cierra el wrapper
        if (!mainWrapper.classList.contains('abierto')) {
            // Si el botón está cerrando el wrapper, volvemos a la vista inicial
            volverAlMapa(); 
        }
    });

    // 2. Evento del botón de volver al mapa
    btnVolverMapa.addEventListener('click', volverAlMapa);

    // 3. Evento de los enlaces de navegación (navLinks)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('data-target');
            const marcadorAsociado = document.querySelector(`.punto-mapa[data-target="${targetId}"]`);
            
            if (marcadorAsociado) {
                 // Abrir el wrapper si está cerrado (si el usuario navega directamente)
                 if (!mainWrapper.classList.contains('abierto')) {
                     toggleMainWrapper(true);
                 }
                 navegarASeccion(marcadorAsociado); 
            }
        });
    });
    
    // 4. Evento de los Puntos del Mapa (mapaPuntos)
    mapaPuntos.forEach(punto => {
        punto.addEventListener('click', function(e) {
             // Abrir el wrapper si está cerrado (el usuario siempre lo abrirá al clicar)
             if (!mainWrapper.classList.contains('abierto')) {
                 toggleMainWrapper(true);
             }
             navegarASeccion(punto);
        });
    });

    // 5. Evento de Ventana Modal (Galería de proyectos)
    const botonesAbrirModal = document.querySelectorAll('.abrir-modal');

    botonesAbrirModal.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const key = this.getAttribute('data-modal-key');
            const titulo = this.getAttribute('data-modal-titulo');

            abrirModal(key, titulo);
        });
    });



    const mapaPopup = document.getElementById('mapa-popup');
    const popupTitulo = mapaPopup.querySelector('.popup-titulo');
    const popupDescripcion = mapaPopup.querySelector('.popup-descripcion');

    // Array de datos de los planetas/proyectos
    const datosPlanetas = [
        { 
            id: 'p-sobre-mi', // ID del elemento HTML del marcador
            titulo: 'Planeta SM-18', 
            descripcion: 'Radioactivo, habitable para especies muy extrañas.',
            colorPrincipal: 'rgb(35, 149, 0)',
            colorHalo: 'rgba(35, 149, 0, 0.8)'
        },
        { 
            id: 'p-habilidades', // ID del elemento HTML del marcador
            titulo: 'Planeta Venmeus', 
            descripcion: 'Venenoso, posee minerales muy valiosos',
            colorPrincipal: 'rgb(216, 25, 143)',
            colorHalo: 'rgba(216, 25, 143, 0.8)'
        },
        { 
            id: 'p-proyectos', // ID del elemento HTML del marcador
            titulo: 'Planeta Nature-0', 
            descripcion: 'Helado, posee estructuras naturales complejas.',
            colorPrincipal: 'rgb(181, 181, 181)',
            colorHalo: 'rgba(181, 181, 181, 0.8)'
        },
        { 
            id: 'p-contacto', // ID del elemento HTML del marcador
            titulo: 'Planeta Agico-X', 
            descripcion: 'Marino, su superficie es 100% agua que varía de color según la zona.',
            colorPrincipal: 'rgb(26, 101, 207)',
            colorHalo: 'rgba(26, 101, 207, 0.8)'
        },
        { 
            id: 'p-estrella', // ID del elemento HTML del marcador
            titulo: 'Planeta MABC-cv', 
            descripcion: 'Abrasador, su temperatura oscila entre los 5 millones de °C.',
            colorPrincipal: '#ffd700',
            colorHalo: '#ffd900b5'
        }
    ];

    // Función para obtener los datos de un planeta por su ID
    function obtenerDatosPlaneta(id) {
        return datosPlanetas.find(p => p.id === id);
    }

    /**
     * Muestra el pop-up calculando las dimensiones reales.
     * @param {HTMLElement} marcador - El elemento HTML del marcador.
     */
    function mostrarPopup(marcador) {
        const datos = obtenerDatosPlaneta(marcador.id);
        
        if (!datos) return;

        // 1. Llenar el contenido PRIMERO (para que el elemento tome su tamaño real)
        popupTitulo.textContent = datos.titulo;
        popupDescripcion.textContent = datos.descripcion;

        if (datos.colorPrincipal && datos.colorHalo) {
            mapaPopup.style.setProperty('--color-principal', datos.colorPrincipal);
            mapaPopup.style.setProperty('--color-halo', datos.colorHalo);
        }

        // 2. OBTENER DIMENSIONES REALES (Esta es la corrección clave)
        // El navegador ya redibujó el texto, así que ahora sabemos cuánto mide exactamente.
        const realWidth = mapaPopup.offsetWidth;
        const realHeight = mapaPopup.offsetHeight;
        
        // Margen un poco más generoso para separar del planeta
        const MARGIN = 20; 

        // Dimensiones del planeta
        const marcadorTop = marcador.offsetTop;
        const marcadorLeft = marcador.offsetLeft;
        const marcadorWidth = marcador.offsetWidth;
        const marcadorHeight = marcador.offsetHeight;
        
        const position = marcador.getAttribute('data-tooltip-pos') || 'arriba'; 

        let topPosition, leftPosition;

        switch (position) {
            case 'abajo':
                topPosition = marcadorTop + marcadorHeight + MARGIN;
                // Centrar horizontalmente respecto al planeta
                leftPosition = marcadorLeft + (marcadorWidth / 2) - (realWidth / 2);
                break;

            case 'derecha':
                // Centrar verticalmente respecto al planeta
                topPosition = marcadorTop + (marcadorHeight / 2) - (realHeight / 2); 
                leftPosition = marcadorLeft + marcadorWidth + MARGIN;
                break;

            case 'izquierda':
                // Centrar verticalmente respecto al planeta
                topPosition = marcadorTop + (marcadorHeight / 2) - (realHeight / 2);
                // Restamos el ancho REAL de la caja
                leftPosition = marcadorLeft - realWidth - MARGIN;
                break;

            case 'arriba': 
            default:
                // Restamos la altura REAL de la caja
                topPosition = marcadorTop - realHeight - MARGIN;
                // Centrar horizontalmente
                leftPosition = marcadorLeft + (marcadorWidth / 2) - (realWidth / 2);
                break;
        }

        // 3. Aplicar las coordenadas calculadas
        mapaPopup.style.top = `${topPosition}px`;
        mapaPopup.style.left = `${leftPosition}px`;
        
        // 4. Mostrar
        mapaPopup.classList.remove('oculto');
        mapaPopup.classList.add('visible');
    }

    /**
     * Oculta el pop-up.
     */
    function ocultarPopup() {
        // Solo quitamos la clase 'visible', el CSS se encarga del desvanecimiento (opacity: 0)
        mapaPopup.classList.remove('visible');
        mapaPopup.classList.add('oculto');
    }

    const marcadoresPlanetas = document.querySelectorAll('.planeta-marcador'); // O .punto-mapa

    marcadoresPlanetas.forEach(marcador => {
        marcador.addEventListener('mouseenter', () => {
        mostrarPopup(marcador);
    });

        // A. Lógica para el Popup (Hover)
        marcador.addEventListener('mouseenter', () => {
            mostrarPopup(marcador);
        });
        
        marcador.addEventListener('mouseleave', () => {
            // Retraso para evitar el parpadeo
            setTimeout(() => {
                ocultarPopup();
            }, 50); 
        });

        // B. Lógica para Abrir la Sección (Click)
        marcador.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('data-target'); // Asume que el marcador tiene data-target
            
            if (targetId) {
                mostrarSeccion(targetId);
                toggleMainWrapper(true); // Abre la ventana
                ocultarPopup(); // Oculta el popup si estaba visible
            }
        });
    });


    // Opcional: Si el mouse sale del pop-up, también se oculta
    mapaPopup.addEventListener('mouseleave', ocultarPopup);


    // Ventana Modal para mostrar imágenes de los proyectos

    const projectModal = document.getElementById('project-modal');
    const modalCerrar = projectModal.querySelector('.modal-cerrar');
    const modalOverlay = projectModal.querySelector('.modal-overlay');
    const carruselImagenes = document.getElementById('carrusel-imagenes');
    const carruselPrev = document.getElementById('carrusel-prev');
    const carruselNext = document.getElementById('carrusel-next');
    const modalTitulo = document.getElementById('modal-titulo');

    // Variables globales necesarias
    let currentSlideIndex = 0;
    let slideInterval; // Para el auto-deslizamiento
    const SLIDE_DURATION = 5000; // 5 segundos

    function abrirModal(key, titulo) {
        const imagenes = obtenerImagenesProyecto(key);
        if (imagenes.length === 0) return;

        carruselImagenes.innerHTML = '';
        
        // Inyectamos las imágenes originales
        imagenes.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = titulo;
            carruselImagenes.appendChild(img);
        });

        // Clonamos la primera y la ponemos al final
        if (imagenes.length > 1) {
            const clon = carruselImagenes.children[0].cloneNode(true);
            carruselImagenes.appendChild(clon);
        }
        
        currentSlideIndex = 0;
        carruselImagenes.style.transition = 'none'; // Sin transición al abrir
        updateCarrusel(); 
        
        // Forzamos un reflow y activamos la transición para después
        setTimeout(() => {
            carruselImagenes.style.transition = 'transform 0.5s ease-in-out';
        }, 50);

        modalTitulo.textContent = `Imágenes: ${titulo}`;
        projectModal.classList.remove('oculto');
        setTimeout(() => { projectModal.classList.add('visible'); }, 10);
        document.body.style.overflow = 'hidden';
        
        if (imagenes.length > 1) startAutoSlide();
    }

    function updateCarrusel() {
        const offset = -currentSlideIndex * 100;
        carruselImagenes.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        const totalSlides = carruselImagenes.children.length; // Incluye el clon
        
        currentSlideIndex++;
        carruselImagenes.style.transition = 'transform 0.5s ease-in-out';
        updateCarrusel();

        // Si llegamos al CLON (que es el último elemento)
        if (currentSlideIndex === totalSlides - 1) {
            // Esperamos a que termine la animación (0.5s = 500ms)
            setTimeout(() => {
                carruselImagenes.style.transition = 'none'; // Quitamos animación
                currentSlideIndex = 0; // Volvemos al inicio real
                updateCarrusel();
            }, 500);
        }
    }

    function prevSlide() {
        const totalSlides = carruselImagenes.children.length;

        if (currentSlideIndex === 0) {
            // Si estamos en la 1 y damos atrás, saltamos al CLON instantáneamente
            carruselImagenes.style.transition = 'none';
            currentSlideIndex = totalSlides - 1;
            updateCarrusel();
            
            // Y luego nos movemos a la foto 3 con animación
            setTimeout(() => {
                carruselImagenes.style.transition = 'transform 0.5s ease-in-out';
                currentSlideIndex = totalSlides - 2;
                updateCarrusel();
            }, 10);
        } else {
            currentSlideIndex--;
            carruselImagenes.style.transition = 'transform 0.5s ease-in-out';
            updateCarrusel();
        }
    }

    // --- Función de Auto-Deslizamiento ---
    function startAutoSlide() {
        // Asegurar que solo hay un intervalo activo
        stopAutoSlide(); 
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    function cerrarModal() {
        stopAutoSlide(); 
        
        projectModal.classList.remove('visible');
        setTimeout(() => {
            projectModal.classList.add('oculto');
            document.body.style.overflow = ''; 
            carruselImagenes.innerHTML = ''; 
        }, 300);
    }

    carruselNext.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide(); // Reiniciar el auto-deslizamiento después del clic
    });

    carruselPrev.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide(); // Reiniciar el auto-deslizamiento después del clic
    });

    modalCerrar.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', cerrarModal); 
    // También puedes cerrar al presionar ESC (opcional)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('visible')) {
            cerrarModal();
        }
    });

    const datosGaleria = {
        'smg': [
            '../img/SMG-1.png',
            '../img/SMG-2.png',
            '../img/SMG-3.png',
            '../img/SMG-4.png',
            '../img/SMG-5.png',
            '../img/SMG-6.png'
        ]
    };

    function obtenerImagenesProyecto(key) {
        return datosGaleria[key] || [];
    }


});
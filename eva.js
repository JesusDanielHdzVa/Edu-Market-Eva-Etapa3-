/* === ESPERA A QUE EL CONTENIDO DEL DOM SE CARGUE === */
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica de Modo Oscuro ---
    const toggleButton = document.getElementById('modo-toggle');
    const body = document.body;

    if (localStorage.getItem('modo-oscuro') === 'true') {
        body.classList.add('dark-mode');
        toggleButton.textContent = 'Claro'; 
    } else {
        body.classList.remove('dark-mode');
        toggleButton.textContent = 'Oscuro'; 
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            toggleButton.textContent = 'Claro';
            localStorage.setItem('modo-oscuro', 'true');
        } else {
            toggleButton.textContent = 'Oscuro';
            localStorage.setItem('modo-oscuro', 'false');
        }
    });

    // --- Lógica de Búsqueda Dinámica ---
    const searchBar = document.getElementById('search-bar');
    const allBookCards = document.querySelectorAll('.producto-card');

    // (Asegúrate de tener un 'search-bar' en tu HTML para que esto no falle)
    if (searchBar) {
        searchBar.addEventListener('input', (evento) => {
            const searchTerm = evento.target.value.toLowerCase();

            allBookCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex'; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // === ¡NUEVO! LÓGICA DEL CONTADOR DE CLICKS ===
    let clickCount = 0;
    const counterDisplay = document.getElementById('click-counter');
    const countElement = document.getElementById('click-count');
    
    // Escucha clics en CUALQUIER parte del documento
    document.addEventListener('click', () => {
        // 1. Incrementar el contador
        clickCount++;
        
        // 2. Actualizar el texto
        countElement.textContent = clickCount;
        
        // 3. Aplicar la animación (quitar y poner la clase)
        // Esto reinicia la animación en cada clic
        counterDisplay.classList.remove('click-animate');
        
        // Forzar al navegador a "refrescar" el elemento
        void counterDisplay.offsetWidth; 
        
        counterDisplay.classList.add('click-animate');
    });
    // ==========================================


    // --- Lógica del Carrito de Compras ---
    
    let totalCarrito = 0; 
    const listaLibros = document.getElementById('lista-libros');
    const listaVacia = document.getElementById('lista-vacia');
    const totalMonto = document.getElementById('lista-total-monto');
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    const botonVaciar = document.getElementById('vaciar-lista');

    botonesComprar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
            // ¡Importante! Detiene la propagación del clic.
            // Si no ponemos esto, el clic en el botón también
            // activará el contador de clics del documento.
            // Quita esta línea si SÍ quieres que cuente.
            // evento.stopPropagation(); // <--- Descomenta esto si no quieres que cuente

            if (boton.classList.contains('btn-anadido')) {
                return; 
            }
            
            boton.textContent = '¡Añadido!'; 
            boton.classList.add('btn-anadido');

            const titulo = boton.dataset.titulo;
            const precio = parseFloat(boton.dataset.precio); 

            agregarALista(titulo, precio);

            totalCarrito += precio;
            actualizarTotal();

            mostrarToast(`'${titulo}' se añadió a tu lista.`);
        });
    });

    if (botonVaciar) {
        botonVaciar.addEventListener('click', () => {
            totalCarrito = 0;
            actualizarTotal();

            while (listaLibros.firstChild) {
                listaLibros.removeChild(listaLibros.firstChild);
            }

            listaLibros.appendChild(listaVacia);
            listaVacia.style.display = 'block';

            botonesComprar.forEach(boton => {
                boton.textContent = 'Comprar';
                boton.classList.remove('btn-anadido');
            });

            mostrarToast('¡Compra realizada! Tu lista ha sido vaciada.');
        });
    }

    /**
     * Actualiza el texto del total en el HTML
     */
    function actualizarTotal() {
        if(totalMonto) {
            totalMonto.textContent = `$${totalCarrito.toFixed(2)}`;
        }
    }

    /**
     * Función que crea y añade un nuevo libro a la lista visible
     */
    function agregarALista(tituloLibro, precioLibro) {
        if (listaVacia) {
            listaVacia.style.display = 'none';
        }

        const nuevoItem = document.createElement('li');
        
        const tituloSpan = document.createElement('span');
        tituloSpan.textContent = tituloLibro;

        const precioSpan = document.createElement('span');
        precioSpan.textContent = `$${precioLibro.toFixed(2)}`;
        precioSpan.classList.add('lista-item-precio');

        nuevoItem.appendChild(tituloSpan);
        nuevoItem.appendChild(precioSpan);

        listaLibros.appendChild(nuevoItem);
    }

    /**
     * Muestra una notificación toast en la esquina
     */
    function mostrarToast(mensaje) {
        const container = document.getElementById('toast-container');
        if (!container) return; // Salir si no existe
        
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = mensaje;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10); 

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                     container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

});
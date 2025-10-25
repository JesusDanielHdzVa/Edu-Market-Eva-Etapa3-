document.addEventListener('DOMContentLoaded', () => {

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

    const searchBar = document.getElementById('search-bar');
    const allBookCards = document.querySelectorAll('.producto-card');

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

    let clickCount = 0;
    const counterDisplay = document.getElementById('click-counter');
    const countElement = document.getElementById('click-count');
    
    document.addEventListener('click', () => {
        clickCount++;
        
        countElement.textContent = clickCount;
        
       counterDisplay.classList.remove('click-animate');
        
       void counterDisplay.offsetWidth; 
        
        counterDisplay.classList.add('click-animate');
    });
 
    let totalCarrito = 0; 
    const listaLibros = document.getElementById('lista-libros');
    const listaVacia = document.getElementById('lista-vacia');
    const totalMonto = document.getElementById('lista-total-monto');
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    const botonVaciar = document.getElementById('vaciar-lista');

    botonesComprar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
        
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

 
    function actualizarTotal() {
        if(totalMonto) {
            totalMonto.textContent = `$${totalCarrito.toFixed(2)}`;
        }
    }

  
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

 
    function mostrarToast(mensaje) {
        const container = document.getElementById('toast-container');
        if (!container) return; 
        
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
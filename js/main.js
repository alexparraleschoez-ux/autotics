document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. CARGAR DATOS DE PROYECTOS
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        const grid = document.getElementById('projects-grid');
        
        // Referencias al Modal
        const modal = document.getElementById('project-modal');
        const modalMedia = document.getElementById('modal-media');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTech = document.getElementById('modal-tech');
        const closeModalBtn = document.querySelector('.close-modal');

        // 2. GENERAR TARJETAS DINÁMICAMENTE
        projects.forEach((project, index) => {
            let mediaHTML = '';
            let cardClass = 'project-card'; 

            // Lógica para Video con imagen poster vs Solo Imagen
            if (project.videoLocal) {
                // Usar la imagen del campo "imagen" como poster del video
                mediaHTML = `
                    <div class="card-media vertical-video">
                        <video controls poster="${project.imagen}" preload="metadata">
                            <source src="${project.videoLocal}" type="video/mp4">
                            Tu navegador no soporta videos.
                        </video>
                    </div>`;
                cardClass += ' tall-card';
            } else {
                // Si no hay video, mostrar solo la imagen
                mediaHTML = `<div class="card-image" style="background-image: url('${project.imagen}')"></div>`;
            }

            // Crear elemento artículo
            const card = document.createElement('article');
            card.className = `${cardClass} filter-item`;
            
            // Asignar categoría para el filtrado
            card.setAttribute('data-category', project.categoria || 'all'); 
            
            // AGREGAR ANIMACIÓN AOS CON RETRASO EN CASCADA
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());

            // Estructura interna de la tarjeta
            card.innerHTML = `
                ${mediaHTML}
                <div class="card-content">
                    <h3>${project.nombre}</h3>
                    <p>${project.descripcion}</p>
                    <div class="tech-stack">
                        ${project.tecnologias.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // EVENTO CLICK PARA ABRIR MODAL
            card.addEventListener('click', () => {
                // Llenar datos del modal
                modalTitle.textContent = project.nombre;
                modalDesc.textContent = project.descripcion;
                modalTech.innerHTML = project.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
                
                // Mostrar video o imagen en grande
                if (project.videoLocal) {
                    modalMedia.innerHTML = `
                        <video controls autoplay poster="${project.imagen}">
                            <source src="${project.videoLocal}" type="video/mp4">
                        </video>`;
                } else {
                    modalMedia.innerHTML = `<img src="${project.imagen}" alt="${project.nombre}" style="width:100%; border-radius:8px;">`;
                }
                
                // Mostrar modal y bloquear scroll del body
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; 
            });

            grid.appendChild(card);
        });

        // 3. LÓGICA DE FILTRADO POR CATEGORÍAS
        const filterBtns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.filter-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Cambiar estado activo de botones
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Mostrar u ocultar tarjetas según categoría
                items.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hide');
                        item.style.display = 'block';
                        
                        // Reiniciar animación AOS al filtrar
                        item.setAttribute('data-aos', 'fade-up');
                    } else {
                        item.classList.add('hide');
                        item.style.display = 'none';
                    }
                });
            });
        });

        // 4. LÓGICA PARA CERRAR EL MODAL
        const closeModal = () => {
            modal.style.display = 'none';
            modalMedia.innerHTML = ''; // Limpiar video para detener reproducción
            document.body.style.overflow = 'auto'; // Restaurar scroll
        };

        // Cerrar al dar clic en la X
        closeModalBtn.addEventListener('click', closeModal);
        
        // Cerrar al dar clic fuera del contenido (en el fondo oscuro)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });

    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
});
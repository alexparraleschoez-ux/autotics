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

            // Detectar si es video vertical u horizontal
            const isVertical = project.vertical || false;

            // Lógica para Video con imagen poster vs Solo Imagen
            if (project.videoLocal) {
                // Crear wrapper para el video con aspecto correcto
                const wrapperClass = isVertical ? 'video-wrapper vertical' : 'video-wrapper';
                
                mediaHTML = `
                    <div class="${wrapperClass}">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="metadata"
                            playsinline
                            webkit-playsinline
                            x5-video-player-type="h5"
                            x5-video-player-fullscreen="true"
                            data-poster="${project.imagen}"
                            style="background: #000;">
                            <source src="${project.videoLocal}" type="video/mp4">
                            <p>Tu navegador no soporta videos HTML5. <a href="${project.videoLocal}" download>Descargar video</a></p>
                        </video>
                    </div>`;
                
                if (isVertical) {
                    cardClass += ' tall-card';
                }
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
            
            // EVENTO CLICK PARA ABRIR MODAL (solo si NO es un video)
            // Si es video, permitir que el usuario interactúe directamente con él
            const videoElement = card.querySelector('video');
            if (videoElement) {
                // Si hace clic en el video, no abrir modal
                videoElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
            
            // Abrir modal al hacer clic en la tarjeta (pero no en el video)
            card.addEventListener('click', (e) => {
                // Si el clic fue en el video, no abrir modal
                if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
                    return;
                }
                
                // Llenar datos del modal
                modalTitle.textContent = project.nombre;
                modalDesc.textContent = project.descripcion;
                modalTech.innerHTML = project.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
                
                // Mostrar video o imagen en grande
                if (project.videoLocal) {
                    modalMedia.innerHTML = `
                        <div class="video-wrapper ${isVertical ? 'vertical' : ''}">
                            <video 
                                controls 
                                autoplay 
                                poster="${project.imagen}"
                                playsinline
                                webkit-playsinline
                                style="background: #000;">
                                <source src="${project.videoLocal}" type="video/mp4">
                            </video>
                        </div>`;
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
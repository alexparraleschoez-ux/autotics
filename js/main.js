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

            // Determinar orientación del video
            const orientation = project.orientation || 'auto';

            // Lógica para Video con imagen poster vs Solo Imagen
            if (project.videoLocal) {
                // Crear clase basada en orientación
                let videoClass = 'horizontal';
                if (orientation === 'vertical') {
                    videoClass = 'vertical';
                    cardClass += ' tall-card';
                } else if (orientation === 'auto') {
                    videoClass = 'auto-detect';
                }
                
                mediaHTML = `
                    <div class="video-wrapper ${videoClass}" data-video-id="${project.id}">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="metadata"
                            playsinline
                            webkit-playsinline
                            data-poster="${project.imagen}"
                            style="background: #000;">
                            <source src="${project.videoLocal}" type="video/mp4">
                            <p>Tu navegador no soporta videos HTML5.</p>
                        </video>
                    </div>`;
            } else {
                // Si no hay video, mostrar solo la imagen
                mediaHTML = `<div class="card-image" style="background-image: url('${project.imagen}')"></div>`;
            }

            // Crear elemento artículo
            const card = document.createElement('article');
            card.className = `${cardClass} filter-item`;
            card.setAttribute('data-category', project.categoria || 'all'); 
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
            
            // Detectar orientación automática del video
            if (orientation === 'auto' && project.videoLocal) {
                const videoWrapper = card.querySelector('.video-wrapper');
                const videoElement = card.querySelector('video');
                
                // Cuando el video cargue sus metadatos, detectamos su orientación
                videoElement.addEventListener('loadedmetadata', () => {
                    const videoWidth = videoElement.videoWidth;
                    const videoHeight = videoElement.videoHeight;
                    const aspectRatio = videoWidth / videoHeight;
                    
                    // Si es más alto que ancho → vertical
                    if (aspectRatio < 1) {
                        videoWrapper.classList.remove('auto-detect');
                        videoWrapper.classList.add('vertical');
                        card.classList.add('tall-card');
                    } else {
                        videoWrapper.classList.remove('auto-detect');
                        videoWrapper.classList.add('horizontal');
                    }
                    
                    // Forzar recálculo del layout
                    videoWrapper.style.display = 'flex';
                });
            }
            
            // EVENTO CLICK PARA ABRIR MODAL
            const videoElement = card.querySelector('video');
            if (videoElement) {
                videoElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
            
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
                    return;
                }
                
                modalTitle.textContent = project.nombre;
                modalDesc.textContent = project.descripcion;
                modalTech.innerHTML = project.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
                
                if (project.videoLocal) {
                    const modalOrientation = project.orientation === 'vertical' ? 'vertical' : 'horizontal';
                    modalMedia.innerHTML = `
                        <div class="video-wrapper ${modalOrientation}" style="max-height: 70vh;">
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
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                items.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hide');
                        item.style.display = 'block';
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
            modalMedia.innerHTML = '';
            document.body.style.overflow = 'auto';
        };

        closeModalBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });

    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
});
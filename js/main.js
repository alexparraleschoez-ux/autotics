// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, iniciando...');
    
    try {
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.error('No se encontró el elemento #projects-grid');
            return;
        }

        // Cargar proyectos desde JSON
        let projects = [];
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            projects = await response.json();
            console.log('Proyectos cargados:', projects.length);
        } catch (error) {
            console.error('Error cargando projects.json:', error);
            // Fallback: proyectos hardcodeados
            projects = [
                {
                    id: 1,
                    nombre: "Tipos de Wildcard",
                    descripcion: "Tutorial completo sobre máscaras wildcard y conversiones binarias para redes Cisco.",
                    tecnologias: ["Redes", "Cisco", "Direccionamiento", "Conectividad"],
                    imagen: "assets/img/logo_autotics.jpg",
                    videoLocal: "assets/videos/Wildcard.mp4",
                    categoria: "redes",
                    orientation: "vertical"
                }
            ];
        }

        const modal = document.getElementById('project-modal');
        const modalContent = modal.querySelector('.modal-content');
        const modalMedia = document.getElementById('modal-media');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTech = document.getElementById('modal-tech');
        const closeModalBtn = document.querySelector('.close-modal');

        // Generar tarjetas
        projects.forEach((project, index) => {
            console.log('Generando tarjeta:', project.nombre);
            
            let mediaHTML = '';
            let cardClass = 'project-card';

            const orientation = project.orientation || 'horizontal';

            if (project.videoLocal) {
                let videoClass = orientation === 'vertical' ? 'vertical' : 'horizontal';
                if (orientation === 'vertical') {
                    cardClass += ' tall-card';
                }
                
                // Para móviles, usar poster visible y preload="none"
                const preloadAttr = isMobile ? 'none' : 'metadata';
                
                mediaHTML = `
                    <div class="video-wrapper ${videoClass}">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="${preloadAttr}"
                            playsinline
                            webkit-playsinline
                            x5-video-player-type="h5"
                            x5-video-player-fullscreen="true"
                            style="background: #000; width: 100%; height: 100%;">
                            <source src="${project.videoLocal}" type="video/mp4">
                            <p style="color: white; text-align: center; padding: 20px;">
                                Tu navegador no soporta videos HTML5. 
                                <a href="${project.videoLocal}" download style="color: #00f0ff;">Descargar video</a>
                            </p>
                        </video>
                    </div>`;
            } else {
                mediaHTML = `<div class="card-image" style="background-image: url('${project.imagen}')"></div>`;
            }

            const card = document.createElement('article');
            card.className = `${cardClass} filter-item`;
            card.setAttribute('data-category', project.categoria || 'all'); 
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());

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
            
            // Evento click en video
            const videoElement = card.querySelector('video');
            if (videoElement) {
                videoElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Click en video:', project.nombre);
                });
                
                // Manejo de errores de video
                videoElement.addEventListener('error', (e) => {
                    console.error('Error al cargar video:', project.videoLocal, e);
                    videoElement.parentElement.innerHTML = `
                        <div style="background: #121420; padding: 20px; text-align: center; color: white; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                            <p style="font-size: 2rem; margin-bottom: 10px;">️</p>
                            <p>Video no disponible</p>
                            <a href="${project.videoLocal}" download style="color: #00f0ff; margin-top: 10px; display: inline-block;">Descargar</a>
                        </div>
                    `;
                });
                
                // Cuando el video empieza a reproducir
                videoElement.addEventListener('play', () => {
                    console.log('Reproduciendo:', project.nombre);
                });
            }
            
            // Evento click en tarjeta (abrir modal)
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
                    return;
                }
                
                console.log('Abriendo modal:', project.nombre);
                
                modalTitle.textContent = project.nombre;
                modalDesc.textContent = project.descripcion;
                modalTech.innerHTML = project.tecnologias.map(t => `<span class="tag">${t}</span>`).join('');
                
                modalContent.classList.remove('modal-horizontal', 'modal-vertical');
                
                if (project.videoLocal) {
                    const modalOrientation = project.orientation === 'vertical' ? 'vertical' : 'horizontal';
                    modalContent.classList.add(`modal-${modalOrientation}`);
                    
                    modalMedia.innerHTML = `
                        <div class="video-wrapper ${modalOrientation}">
                            <video 
                                controls 
                                autoplay 
                                poster="${project.imagen}"
                                preload="none"
                                playsinline
                                webkit-playsinline
                                x5-video-player-type="h5"
                                style="background: #000; width: 100%; height: 100%;">
                                <source src="${project.videoLocal}" type="video/mp4">
                            </video>
                        </div>`;
                } else {
                    modalContent.classList.add('modal-horizontal');
                    modalMedia.innerHTML = `<img src="${project.imagen}" alt="${project.nombre}" style="width:100%; border-radius:8px;">`;
                }
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; 
            });

            grid.appendChild(card);
            console.log('Tarjeta agregada:', project.nombre);
        });

        console.log('Total de tarjetas generadas:', projects.length);

        // Filtros
        const filterBtns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.filter-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Filtro clickeado:', btn.getAttribute('data-filter'));
                
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

        // Cerrar modal
        const closeModal = () => {
            modal.style.display = 'none';
            modalMedia.innerHTML = '';
            modalContent.classList.remove('modal-horizontal', 'modal-vertical');
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
        console.error('Error general:', error);
        const grid = document.getElementById('projects-grid');
        if (grid) {
            grid.innerHTML = `
                <div style="color: white; text-align: center; padding: 40px;">
                    <p style="font-size: 2rem; margin-bottom: 20px;">⚠️</p>
                    <p>Error al cargar proyectos</p>
                    <p style="font-size: 0.8rem; margin-top: 10px; color: #a0a0b0;">${error.message}</p>
                </div>
            `;
        }
    }
});
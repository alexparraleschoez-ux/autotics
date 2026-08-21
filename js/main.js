document.addEventListener('DOMContentLoaded', async () => {
    try {
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.error('No se encontró #projects-grid');
            return;
        }

        let projects = [];
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            projects = await response.json();
            console.log('Proyectos cargados:', projects.length);
        } catch (error) {
            console.error('Error cargando JSON:', error);
            projects = [{
                id: 1,
                nombre: "Tipos de Wildcard",
                descripcion: "Tutorial sobre máscaras wildcard",
                tecnologias: ["Redes", "Cisco"],
                imagen: "assets/img/logo_autotics.jpg",
                videoLocal: "assets/videos/Wildcard.mp4",
                categoria: "redes",
                orientation: "vertical"
            }];
        }

        projects.forEach((project, index) => {
            let mediaHTML = '';
            const orientation = project.orientation || 'horizontal';

            if (project.videoLocal) {
                // ESTILOS INLINE para forzar visibilidad en móvil
                const videoHeight = orientation === 'vertical' ? '400px' : '200px';
                const videoWidth = orientation === 'vertical' ? '100%' : '100%';
                
                mediaHTML = `
                    <div style="
                        width: 100%; 
                        min-height: ${videoHeight};
                        background: #000;
                        display: block;
                        overflow: hidden;
                        border-radius: 16px 16px 0 0;
                        position: relative;
                    ">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="none"
                            playsinline
                            webkit-playsinline
                            x5-video-player-type="h5"
                            x5-video-player-fullscreen="true"
                            style="
                                width: ${videoWidth}; 
                                height: 100%; 
                                min-height: ${videoHeight};
                                object-fit: ${orientation === 'vertical' ? 'contain' : 'cover'};
                                display: block;
                                background: #000;
                            ">
                            <source src="${project.videoLocal}" type="video/mp4">
                            <p style="color: white; text-align: center; padding: 20px;">
                                Tu navegador no soporta videos HTML5. 
                                <a href="${project.videoLocal}" download style="color: #00f0ff;">Descargar video</a>
                            </p>
                        </video>
                    </div>`;
            } else {
                mediaHTML = `<div style="height: 180px; background: #1a1d2d; background-size: cover; background-position: center; background-image: url('${project.imagen}');"></div>`;
            }

            const card = document.createElement('article');
            card.className = 'project-card filter-item';
            card.setAttribute('data-category', project.categoria || 'all');
            
            // ESTILOS INLINE para forzar visibilidad
            card.style.cssText = `
                background: var(--bg-card, #121420);
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.05);
                margin-bottom: 20px;
                display: block !important;
                cursor: pointer;
            `;

            card.innerHTML = `
                ${mediaHTML}
                <div style="padding: 25px;">
                    <h3 style="margin-bottom: 10px; color: #ffffff; font-size: 1.2rem;">${project.nombre}</h3>
                    <p style="color: #a0a0b0; font-size: 0.9rem; margin-bottom: 20px;">${project.descripcion}</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${project.tecnologias.map(t => `<span style="padding: 5px 12px; background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(0, 240, 255, 0.2);">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            
            const videoElement = card.querySelector('video');
            if (videoElement) {
                videoElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                
                videoElement.addEventListener('error', (e) => {
                    console.error('Error al cargar video:', project.videoLocal);
                });
            }
            
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
                    return;
                }
                
                const modal = document.getElementById('project-modal');
                const modalContent = modal.querySelector('.modal-content');
                const modalMedia = document.getElementById('modal-media');
                const modalTitle = document.getElementById('modal-title');
                const modalDesc = document.getElementById('modal-desc');
                const modalTech = document.getElementById('modal-tech');
                
                modalTitle.textContent = project.nombre;
                modalDesc.textContent = project.descripcion;
                modalTech.innerHTML = project.tecnologias.map(t => `<span style="padding: 5px 12px; background: rgba(0, 240, 255, 0.1); color: #00f0ff; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(0, 240, 255, 0.2);">${t}</span>`).join('');
                
                modalContent.classList.remove('modal-horizontal', 'modal-vertical');
                
                if (project.videoLocal) {
                    const modalOrientation = project.orientation === 'vertical' ? 'vertical' : 'horizontal';
                    modalContent.classList.add(`modal-${modalOrientation}`);
                    const modalHeight = modalOrientation === 'vertical' ? '70vh' : 'auto';
                    
                    modalMedia.innerHTML = `
                        <div style="width: 100%; background: #000; display: flex; align-items: center; justify-content: center;">
                            <video 
                                controls 
                                autoplay 
                                poster="${project.imagen}"
                                preload="none"
                                playsinline
                                webkit-playsinline
                                style="width: 100%; max-height: ${modalHeight}; object-fit: ${modalOrientation === 'vertical' ? 'contain' : 'cover'}; display: block; background: #000;">
                                <source src="${project.videoLocal}" type="video/mp4">
                            </video>
                        </div>`;
                } else {
                    modalContent.classList.add('modal-horizontal');
                    modalMedia.innerHTML = `<img src="${project.imagen}" alt="${project.nombre}" style="width:100%; border-radius:8px; display: block;">`;
                }
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; 
            });

            grid.appendChild(card);
        });

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
                    } else {
                        item.classList.add('hide');
                        item.style.display = 'none';
                    }
                });
            });
        });

        const modal = document.getElementById('project-modal');
        const modalMedia = document.getElementById('modal-media');
        const modalContent = modal.querySelector('.modal-content');
        const closeModalBtn = document.querySelector('.close-modal');

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
    }
});
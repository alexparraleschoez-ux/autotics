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

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        projects.forEach((project, index) => {
            let mediaHTML = '';
            let cardClass = 'project-card';
            const orientation = project.orientation || 'horizontal';

            if (project.videoLocal) {
                let videoClass = orientation === 'vertical' ? 'vertical' : 'horizontal';
                if (orientation === 'vertical') {
                    cardClass += ' tall-card';
                }
                
                mediaHTML = `
                    <div class="video-wrapper ${videoClass}">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="none"
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
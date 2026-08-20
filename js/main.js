document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        const grid = document.getElementById('projects-grid');
        
        const modal = document.getElementById('project-modal');
        const modalMedia = document.getElementById('modal-media');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalTech = document.getElementById('modal-tech');
        const closeModalBtn = document.querySelector('.close-modal');

        projects.forEach((project, index) => {
            let mediaHTML = '';
            let cardClass = 'project-card'; 

            const orientation = project.orientation || 'auto';

            if (project.videoLocal) {
                let videoClass = 'horizontal';
                if (orientation === 'vertical') {
                    videoClass = 'vertical';
                    cardClass += ' tall-card';
                }
                
                mediaHTML = `
                    <div class="video-wrapper ${videoClass}">
                        <video 
                            controls 
                            poster="${project.imagen}" 
                            preload="metadata"
                            playsinline
                            webkit-playsinline
                            x5-video-player-type="h5"
                            x5-video-player-fullscreen="true"
                            x-webkit-airplay="allow"
                            style="background: #000; width: 100%; height: 100%;">
                            <source src="${project.videoLocal}" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;">
                            <p>Tu navegador no soporta videos HTML5. <a href="${project.videoLocal}" download style="color: var(--primary-cyan);">Descargar video</a></p>
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
                
                videoElement.addEventListener('play', () => {
                    videoElement.style.display = 'block';
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
                                x5-video-player-type="h5"
                                style="background: #000; width: 100%; height: 100%;">
                                <source src="${project.videoLocal}" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;">
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
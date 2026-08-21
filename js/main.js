document.addEventListener('DOMContentLoaded', async () => {
    // Debug visual en pantalla
    const debugInfo = [];
    function log(msg) {
        console.log(msg);
        debugInfo.push(msg);
    }
    
    try {
        log('✅ DOM cargado');
        
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            log(' ERROR: No se encontró #projects-grid');
            return;
        }
        log('✅ Grid encontrado');

        let projects = [];
        try {
            const response = await fetch('data/projects.json');
            log(' Response: ' + response.status);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            projects = await response.json();
            log('✅ Proyectos: ' + projects.length);
        } catch (error) {
            log('❌ JSON Error: ' + error.message);
            projects = [{
                id: 1,
                nombre: "Wildcard Test",
                descripcion: "Video de prueba",
                tecnologias: ["Redes"],
                imagen: "assets/img/logo_autotics.jpg",
                videoLocal: "assets/videos/Wildcard.mp4",
                categoria: "redes",
                orientation: "vertical"
            }];
        }

        projects.forEach((project, index) => {
            log('🎬 Creando: ' + project.nombre);
            
            let mediaHTML = '';
            if (project.videoLocal) {
                mediaHTML = `
                    <div style="background: #000; min-height: 300px; border: 3px solid #00f0ff; margin: 10px 0;">
                        <video controls poster="${project.imagen}" preload="none" 
                               playsinline webkit-playsinline
                               style="width: 100%; height: 100%; background: #000;">
                            <source src="${project.videoLocal}" type="video/mp4">
                            <p style="color: white; padding: 20px; text-align: center;">
                                ❌ Video no soportado
                            </p>
                        </video>
                    </div>`;
            }

            const card = document.createElement('article');
            card.className = 'project-card filter-item';
            card.setAttribute('data-category', project.categoria || 'all');
            card.style.cssText = 'border: 2px solid #ff0000; margin: 10px; background: #121420;';
            
            card.innerHTML = `
                ${mediaHTML}
                <div style="color: white; padding: 15px;">
                    <h3 style="color: #00f0ff; margin-bottom: 10px;">${project.nombre}</h3>
                    <p style="color: #a0a0b0;">${project.descripcion}</p>
                </div>
            `;
            
            grid.appendChild(card);
            log('✅ Tarjeta agregada');
        });
        
        log('🎉 Total: ' + projects.length + ' tarjetas');
        
        // Panel de debug flotante
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            color: #00ff00;
            padding: 15px;
            font-size: 11px;
            z-index: 9999;
            max-height: 250px;
            overflow-y: auto;
            border-top: 3px solid #00ff00;
            font-family: monospace;
        `;
        debugDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🔍 DEBUG AUTOICS</strong>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    ✕ Cerrar
                </button>
            </div>
            ${debugInfo.map(line => `<div style="margin: 3px 0; border-bottom: 1px solid #333; padding: 2px 0;">${line}</div>`).join('')}
            <div style="margin-top: 10px; padding-top: 10px; border-top: 2px solid #00ff00;">
                <strong>User Agent:</strong> ${navigator.userAgent}<br>
                <strong>URL:</strong> ${window.location.href}<br>
                <strong>Plataforma:</strong> ${navigator.platform}
            </div>
        `;
        document.body.appendChild(debugDiv);

    } catch (error) {
        log('❌ ERROR FATAL: ' + error.message);
        alert('Error: ' + error.message);
    }
});
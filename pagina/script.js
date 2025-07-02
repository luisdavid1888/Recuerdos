$(function() {
    var config = {};
    
    // Función para cargar y parsear el archivo de configuración
    function loadConfig() {
        $.get('config.txt')
            .done(function(data) {
                config = parseConfig(data);
                updatePageContent();
                updateCredits();
            })
            .fail(function() {
                console.log('No se pudo cargar config.txt, usando valores por defecto');
                updateCredits(); // Mostrar créditos por defecto
            });
    }
    
    // Función para parsear el archivo de configuración
    function parseConfig(data) {
        var config = {};
        var lines = data.split('\n');
        var currentSection = '';
        
        lines.forEach(function(line) {
            line = line.trim();
            if (line.startsWith('[') && line.endsWith(']')) {
                currentSection = line.slice(1, -1);
                config[currentSection] = {};
            } else if (line.includes('=') && currentSection) {
                var parts = line.split('=');
                var key = parts[0].trim();
                var value = parts.slice(1).join('=').trim();
                config[currentSection][key] = value;
            }
        });
        
        return config;
    }
    
    // Función para actualizar el contenido de las páginas
    function updatePageContent() {
        if (config.PAGINA_PRINCIPAL) {
            if (config.PAGINA_PRINCIPAL.titulo) {
                $('title').text(config.PAGINA_PRINCIPAL.titulo);
                $('.cover h1').text(config.PAGINA_PRINCIPAL.titulo);
            }
            if (config.PAGINA_PRINCIPAL.subtitulo) {
                $('.cover p').first().text(config.PAGINA_PRINCIPAL.subtitulo);
            }
        }
        
        // Actualizar páginas individuales
        for (var i = 1; i <= 6; i++) {
            var pageKey = 'PAGINA_' + i;
            if (config[pageKey]) {
                var pageElement = $('.bb-item').eq(i).find('.page');
                if (config[pageKey].titulo) {
                    pageElement.find('h2').text(config[pageKey].titulo);
                }
                if (config[pageKey].contenido) {
                    pageElement.find('p').text(config[pageKey].contenido);
                }
                if (config[pageKey].imagen) {
                    pageElement.find('img').attr('src', config[pageKey].imagen);
                }
            }
        }
        
        // Actualizar página final
        if (config.PAGINA_FINAL && config.PAGINA_FINAL.contenido) {
            $('.bb-item').last().find('.page p').text(config.PAGINA_FINAL.contenido);
        }
    }
    
    // Función para actualizar los créditos
    function updateCredits() {
        var creditsHtml = '<div class="credits">';
        creditsHtml += '<h3>Contáctanos</h3>';

        if (config.CREDITOS) {
            // Mostrar solo "Marmolería Señor de Muruhuay" sin el texto "Página creada por:"
            if (config.CREDITOS.creador) {
                creditsHtml += '<p><strong>Marmolería Señor de Muruhuay</strong></p>';
            }
            if (config.CREDITOS.contacto && config.CREDITOS.contacto !== 'Número de contacto por definir') {
                creditsHtml += '<p><strong>Contacto:</strong> ' + config.CREDITOS.contacto + '</p>';
            }
            if (config.CREDITOS.email && config.CREDITOS.email !== '') {
                creditsHtml += '<p><strong>Email:</strong> ' + config.CREDITOS.email + '</p>';
            }
            if (config.CREDITOS.direccion && config.CREDITOS.direccion !== '') {
                creditsHtml += '<p><strong>Dirección:</strong> ' + config.CREDITOS.direccion + '</p>';
            }
        } else {
            // Valores por defecto
            creditsHtml += '<p><strong>Marmolería Señor de Muruhuay</strong></p>';
            creditsHtml += '<p><strong>Contacto:</strong> Por definir</p>';
        }

        creditsHtml += '</div>';

        // Agregar los créditos después de la navegación
        $('nav').after(creditsHtml);
    }
    
    // Inicializar BookBlock
    var book = $('#book').bookblock({
        speed: 800,
        shadow: true
    });

    $('#bb-nav-prev').on('click', function() {
        book.bookblock('prev');
        return false;
    });

    $('#bb-nav-next').on('click', function() {
        book.bookblock('next');
        return false;
    });

    $(document).on('keydown', function(e) {
        var key = e.key;
        if (key === 'ArrowLeft') {
            book.bookblock('prev');
        } else if (key === 'ArrowRight') {
            book.bookblock('next');
        }
    });
    
    loadConfig();
});

// --- MÚSICA DE FONDO ---
$(function() {
    var audio = document.getElementById('bg-music');
    var allowPlay = false;
    var musicaInicio = 52; // segundos desde donde inicia la canción
    // Ocultar controles nativos
    if (audio) {
        audio.currentTime = musicaInicio;
        audio.controls = false;
        audio.style.display = 'none';
    }
    // Crear botón personalizado
    var $btn = $('<button id="custom-audio-btn" aria-label="Reproducir música" title="Reproducir/Pausar música"></button>');
    $btn.css({
        position: 'fixed',
        bottom: '18px',
        left: '18px',
        zIndex: 10000,
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s',
        fontSize: '28px',
        color: '#a98e71',
        outline: 'none',
    });
    $btn.html('<svg id="icon-audio-play" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#fff"/><polygon points="12,9 25,16 12,23" fill="#a98e71"/></svg>');
    $('body').append($btn);
    function setBtnState(isPlaying) {
        if (isPlaying) {
            $btn.html('<svg id="icon-audio-pause" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#fff"/><rect x="11" y="10" width="3.5" height="12" rx="1.5" fill="#a98e71"/><rect x="17.5" y="10" width="3.5" height="12" rx="1.5" fill="#a98e71"/></svg>');
        } else {
            $btn.html('<svg id="icon-audio-play" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#fff"/><polygon points="12,9 25,16 12,23" fill="#a98e71"/></svg>');
        }
    }
    $btn.on('click', function() {
        if (!audio) return;
        if (audio.paused) {
            audio.currentTime = musicaInicio;
            audio.play();
            setBtnState(true);
        } else {
            audio.pause();
            setBtnState(false);
        }
    });
    if (audio) {
        audio.addEventListener('play', function() { setBtnState(true); });
        audio.addEventListener('pause', function() { setBtnState(false); });
    }
    // Forzar play en la primera interacción del usuario
    $(document).one('click touchstart', function() {
        allowPlay = true;
        if (audio) {
            try {
                audio.currentTime = musicaInicio;
                var playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function(err) {
                        alert('El navegador bloqueó la reproducción automática. Usa el botón de música para escucharla.');
                        setBtnState(false);
                    });
                }
            } catch (e) {
                alert('No se pudo reproducir el audio automáticamente. Usa el botón de música.');
                setBtnState(false);
            }
        }
    });
    // Estado inicial
    setBtnState(false);
});

// --- EFECTO ZOOM EN IMÁGENES ---
$(function() {
    // --- EFECTO ZOOM EN IMÁGENES ---
    function closeZoom() {
        $('.zoom-overlay').fadeOut(150, function() { $(this).remove(); });
        $('body').removeClass('zoom-active');
    }
    $(document).on('click touchend', '.page img', function(e) {
        e.stopPropagation();
        if ($('body').hasClass('zoom-active')) return;
        var src = $(this).attr('src');
        var alt = $(this).attr('alt');
        var overlay = $('<div class="zoom-overlay"></div>');
        var img = $('<img>').attr('src', src).attr('alt', alt).addClass('zoomed-img');
        overlay.append(img);
        $('body').append(overlay).addClass('zoom-active');
        overlay.css({display:'flex',alignItems:'center',justifyContent:'center'});
        img.css({maxWidth:'98vw',maxHeight:'98vh',width:'auto',height:'auto'});
        overlay.on('click touchend', function(e2) {
            if (e2.target === this) closeZoom();
        });
    });
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('body').hasClass('zoom-active')) {
            closeZoom();
        }
    });
});

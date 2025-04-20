document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Smooth cursor following
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('.bio-content, .skill-card, .glowing-text');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(2)`;
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
        });
    });

    // Parallax effect for header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        header.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    });

    // Создаем контейнер для магических частиц
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'magic-particles';
    document.body.appendChild(particlesContainer);

    // Функция создания магической частицы
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        
        // Случайные размеры и позиция
        const size = Math.random() * 10 + 3; // Уменьшаем размер частиц
        const startX = Math.random() * window.innerWidth;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}px`;
        particle.style.top = `${window.innerHeight + size}px`;
        
        // Увеличиваем длительность анимации
        const duration = Math.random() * 4 + 3;
        particle.style.setProperty('--duration', `${duration}s`);
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Уменьшаем частоту создания частиц
    setInterval(createParticle, 300);

    // Анимация при наведении на элементы
    const elements = document.querySelectorAll('.stat-card, .contact-links a, .contact-links div');
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-10px) scale(1.02)';
            element.style.boxShadow = '0 0 30px rgba(123, 31, 162, 0.9)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.boxShadow = '';
        });
    });

    // Эффект свечения при скролле
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const direction = scrollTop > lastScrollTop ? 'down' : 'up';
        
        document.querySelectorAll('.profile-header, .stat-card, .about-section, .contact-section').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercent = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
                const glowIntensity = Math.min(scrollPercent * 1.5, 1);
                element.style.boxShadow = `0 0 ${20 + glowIntensity * 20}px rgba(123, 31, 162, ${0.5 + glowIntensity * 0.3})`;
            }
        });
        
        lastScrollTop = scrollTop;
    });

    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем задержку для более плавного появления
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            }
        });
    }, {
        threshold: 0.2, // Увеличиваем порог для более плавного появления
        rootMargin: '50px'
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Добавляем эффект при наведении на карточки
    document.querySelectorAll('.stat-card, .contact-links a').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const glowEffect = document.createElement('div');
            glowEffect.classList.add('glow-effect');
            e.target.appendChild(glowEffect);
            
            setTimeout(() => {
                glowEffect.remove();
            }, 1000);
        });
    });

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Список всех музыкальных треков
    const musicTracks = [
        'music/Part-Time_Friends_-_Streets_and_Stories_63956883.mp3',
        'music/XdrianGM - Miracle.mp3'
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    // Функция для загрузки и воспроизведения трека
    function playTrack(index) {
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer) {
            currentTrackIndex = index;
            audioPlayer.src = musicTracks[index];
            audioPlayer.volume = 0.1; // Установка громкости на 10%
            
            // Обновляем название трека
            const trackName = document.querySelector('.track-name');
            if (trackName) {
                const fileName = musicTracks[index].split('/').pop().replace('.mp3', '');
                trackName.textContent = fileName;
            }

            // Если был на паузе, запускаем воспроизведение
            if (isPlaying) {
                audioPlayer.play();
            }
        }
    }

    // Функция для переключения на следующий трек
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
        playTrack(currentTrackIndex);
    }

    // Функция для переключения на предыдущий трек
    function previousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
        playTrack(currentTrackIndex);
    }

    // Функция для переключения воспроизведения/паузы
    function togglePlay() {
        const audioPlayer = document.querySelector('audio');
        const playButton = document.querySelector('.play-button');
        
        if (audioPlayer) {
            if (audioPlayer.paused) {
                audioPlayer.play();
                isPlaying = true;
                playButton.textContent = '⏸';
            } else {
                audioPlayer.pause();
                isPlaying = false;
                playButton.textContent = '▶';
            }
        }
    }

    // Инициализация плеера
    const audioPlayer = document.querySelector('audio');
    if (audioPlayer) {
        // Создаем контейнер для плеера
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';
        
        // Добавляем название трека
        const trackNameDiv = document.createElement('div');
        trackNameDiv.className = 'track-name';
        playerContainer.appendChild(trackNameDiv);

        // Добавляем кнопки управления
        const controlButtons = document.createElement('div');
        controlButtons.className = 'control-buttons';
        controlButtons.innerHTML = `
            <button class="control-button previous" onclick="previousTrack()">⏮</button>
            <button class="control-button play-button" onclick="togglePlay()">▶</button>
            <button class="control-button next" onclick="nextTrack()">⏭</button>
        `;
        playerContainer.appendChild(controlButtons);

        // Добавляем плеер в контейнер
        audioPlayer.parentNode.insertBefore(playerContainer, audioPlayer.nextSibling);
    }

    // Функция для создания случайных молний
    function createRandomLightning() {
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        
        // Уменьшаем диапазон углов для более естественного эффекта
        const randomAngle = Math.random() * 60 - 30; // от -30 до 30 градусов
        lightning.style.transform = `rotate(${randomAngle}deg)`;
        
        document.querySelector('.lightning-container').appendChild(lightning);
        
        setTimeout(() => {
            lightning.remove();
        }, 1000);
    }

    // Уменьшаем частоту молний и делаем их появление более случайным
    setInterval(() => {
        if (Math.random() < 0.2) { // 20% шанс создания молнии
            createRandomLightning();
        }
    }, 5000);

    // Более плавное движение тумана при движении мыши
    let currentX = 0;
    let currentY = 0;
    const fogContainer = document.querySelector('.fog-container');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Плавное обновление позиции
        requestAnimationFrame(() => {
            currentX += (mouseX - 0.5) * 30 - currentX * 0.1;
            currentY += (mouseY - 0.5) * 5 - currentY * 0.1;
            
            document.querySelectorAll('.fog').forEach(fog => {
                fog.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`;
            });
        });
    });
});
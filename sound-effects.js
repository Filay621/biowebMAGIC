// Создаем аудио элементы
const hoverSound = new Audio('sound/1.mp3');
const clickSound = new Audio('sound/1.mp3');
const avatarSound = new Audio('sound/VO_703_Demon_Hunter_18_F.mp3');
const backgroundMusic = new Audio('sound/GhostlandsNight.ogg');

// Устанавливаем громкость
hoverSound.volume = 0.1;
clickSound.volume = 0.15;
avatarSound.volume = 0.3;
backgroundMusic.volume = 0.3; // 30% громкости
backgroundMusic.loop = true; // Зацикливаем воспроизведение

// Переменная для отслеживания возможности воспроизведения звука аватара
let canPlayAvatarSound = true;

// Функция для начала воспроизведения фоновой музыки
function startBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.log('Автовоспроизведение заблокировано браузером. Нужно взаимодействие с страницей.');
    });
}

// Функция для воспроизведения звука при наведении
function playHoverSound() {
    hoverSound.currentTime = 0;
    hoverSound.play();
}

// Функция для воспроизведения звука при клике
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// Функция для воспроизведения звука аватара с кулдауном
function playAvatarSound() {
    if (canPlayAvatarSound) {
        avatarSound.currentTime = 0;
        avatarSound.play();
        canPlayAvatarSound = false;
        
        // Визуальный эффект кулдауна
        const avatar = document.querySelector('.profile-avatar');
        avatar.style.opacity = '0.7';
        
        // Восстанавливаем возможность воспроизведения через 6 секунд
        setTimeout(() => {
            canPlayAvatarSound = true;
            avatar.style.opacity = '1';
        }, 6000);
    }
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Находим все интерактивные элементы
    const interactiveElements = document.querySelectorAll('.stat-card, .wow-info-panel, .equipment-item, button, a');

    // Добавляем обработчики для каждого элемента
    interactiveElements.forEach(element => {
        // Звук при наведении
        element.addEventListener('mouseenter', playHoverSound);
        
        // Звук при клике
        element.addEventListener('click', playClickSound);
    });

    // Специальный обработчик для аватара
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.removeEventListener('click', playClickSound); // Убираем стандартный звук клика
        avatar.addEventListener('click', playAvatarSound);
    }

    // Предзагружаем звуки
    hoverSound.load();
    clickSound.load();
    avatarSound.load();
    backgroundMusic.load();

    // Начинаем воспроизведение фоновой музыки
    startBackgroundMusic();

    // Добавляем обработчик для любого клика на странице
    document.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            startBackgroundMusic();
        }
    });
}); 
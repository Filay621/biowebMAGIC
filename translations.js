// Объект с переводами для всего сайта
const translations = {
    ru: {
        // Общие элементы
        'about': 'Обо мне',
        'contact': 'Контакты',
        'projects': 'Проекты',
        'skills': 'Навыки',
        'experience': 'Опыт',
        'education': 'Образование',
        
        // WoW статистика
        'mPlusRating': 'M+ Рейтинг',
        'raidProgress': 'Прогресс рейда',
        'itemLevel': 'Уровень предметов',
        'overall': 'Общий',
        'dps': 'УВС',
        'hps': 'Исцеление',
        'tank': 'Танкование',
        'recentFights': 'Последние бои',
        'stats': 'Характеристики',
        'equipment': 'Экипировка',
        'refresh': 'Обновить',
        
        // Характеристики
        'strength': 'Сила',
        'agility': 'Ловкость',
        'intellect': 'Интеллект',
        'stamina': 'Выносливость',
        'crit': 'Критический удар',
        'haste': 'Скорость',
        'mastery': 'Искусность',
        'versatility': 'Универсальность',
        
        // Магические эффекты
        'magicEffects': 'Магические эффекты',
        'particles': 'Частицы',
        'lightning': 'Молнии',
        'fog': 'Туман',
        
        // Статусы
        'online': 'В сети',
        'offline': 'Не в сети',
        'updating': 'Обновление...',
        'noData': 'Нет данных',
        
        // Социальные сети
        'discord': 'Discord',
        'telegram': 'Telegram',
        'github': 'GitHub',
        'email': 'Почта'
    },
    en: {
        // General elements
        'about': 'About',
        'contact': 'Contact',
        'projects': 'Projects',
        'skills': 'Skills',
        'experience': 'Experience',
        'education': 'Education',
        
        // WoW stats
        'mPlusRating': 'M+ Rating',
        'raidProgress': 'Raid Progress',
        'itemLevel': 'Item Level',
        'overall': 'Overall',
        'dps': 'DPS',
        'hps': 'Healing',
        'tank': 'Tank',
        'recentFights': 'Recent Fights',
        'stats': 'Statistics',
        'equipment': 'Equipment',
        'refresh': 'Refresh',
        
        // Character stats
        'strength': 'Strength',
        'agility': 'Agility',
        'intellect': 'Intellect',
        'stamina': 'Stamina',
        'crit': 'Critical Strike',
        'haste': 'Haste',
        'mastery': 'Mastery',
        'versatility': 'Versatility',
        
        // Magic effects
        'magicEffects': 'Magic Effects',
        'particles': 'Particles',
        'lightning': 'Lightning',
        'fog': 'Fog',
        
        // Statuses
        'online': 'Online',
        'offline': 'Offline',
        'updating': 'Updating...',
        'noData': 'No data',
        
        // Social
        'discord': 'Discord',
        'telegram': 'Telegram',
        'github': 'GitHub',
        'email': 'Email'
    }
};

// Определение языка системы
function getSystemLanguage() {
    const userLanguage = navigator.language || navigator.userLanguage;
    return userLanguage.startsWith('ru') ? 'ru' : 'en';
}

// Текущий язык
let currentLanguage = getSystemLanguage();

// Функция для получения перевода
function translate(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Функция для обновления всех переводов на странице
function updatePageTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
            element.textContent = translate(key);
        }
    });
}

// Экспортируем функции для использования в других файлах
window.translations = {
    translate,
    updatePageTranslations,
    getCurrentLanguage: () => currentLanguage,
    setLanguage: (lang) => {
        currentLanguage = lang;
        updatePageTranslations();
    }
}; 
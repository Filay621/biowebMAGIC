// ==UserScript==
// @name         WarcraftLogs Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Автоматическое обновление данных с WarcraftLogs
// @author       Your Name
// @match        https://ru.warcraftlogs.com/character/eu/гордунни/Охаёшка*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const dungeonIcons = {
    'Рассвет Бесконечности: Галакронд': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_dawnoftheinfinite_galakrond.jpg',
    'Рассвет Бесконечности: Мурозонд': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_dawnoftheinfinite_murozond.jpg',
    'Академия Алгет\'ар': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_algethar.jpg',
    'Лазурное хранилище': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_azurevault.jpg',
    'Нелтарий': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_neltharus.jpg',
    'Крепость Нок\'уд': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_nokhudfensive.jpg',
    'Рубиновые Омуты Жизни': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_rubylifepools.jpg',
    'Чертоги Насыщения': 'https://wow.zamimg.com/images/wow/icons/large/achievement_dungeon_uldaman_legacy.jpg'
};

// Иконки для характеристик
const statIcons = {
    'Сила': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_strengthofarms.jpg',
    'Ловкость': 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_quickrecovery.jpg',
    'Выносливость': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_wordfortitude.jpg',
    'Скорость': 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_swiftness.jpg',
    'Критический удар': 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadliness.jpg',
    'Искусность': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_06.jpg',
    'Универсальность': 'https://wow.zamimg.com/images/wow/icons/large/ability_paladin_sheathoflight.jpg'
};

// Иконки для экипировки
const equipmentIcons = {
    'Маска торговца Скверной': 'https://wow.zamimg.com/images/wow/icons/large/inv_helm_cloth_raidwarlock_r_01.jpg',
    'Частично зачарованный амулет': 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_16.jpg',
    'Механические хламоплечники': 'https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_plate_raidpaladin_r_01.jpg',
    'Накидка хламоуправительницы': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_cape_deathwingraid_d_03.jpg',
    'Реактор душ торговца Скверной': 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_raidwarlock_r_01.jpg',
    'Загребатели торговца Скверной': 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_leather_raidrogue_s_01.jpg',
    'Импровизированный сефорисвый стимулятор': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_enggizmos_19.jpg',
    'Хромовзрывчатый сапёрный костюм': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_enggizmos_20.jpg',
    'Выкованный навеки длинный меч': 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_1h_artifactdoomhammer_d_01.jpg',
    'Повышатели градуса': 'https://wow.zamimg.com/images/wow/icons/large/inv_bracer_plate_raidpaladin_r_01.jpg',
    'Застежка выброса адреналина': 'https://wow.zamimg.com/images/wow/icons/large/inv_belt_plate_raidpaladin_r_01.jpg',
    'Меховой килт торговца Скверной': 'https://wow.zamimg.com/images/wow/icons/large/inv_pants_leather_raidmonk_q_01.jpg',
    'Ботинки-спинодолы': 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_plate_raidpaladin_r_01.jpg',
    'Перстень Цирции': 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_03.jpg',
    'Кольцо Затуманенного': 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_16.jpg'
};

class WarcraftLogsUpdater {
    constructor() {
        this.characterName = 'Охаёшка';
        this.realm = 'Гордунни';
        this.region = 'eu';
        this.updateInterval = 60000; // 1 минута
        this.lastUpdate = 0;
        this.isUpdating = false;
        
        // Обновленные иконки WoW
        this.statIcons = {
            itemLevel: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gear_01.jpg',
            strength: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_strengthofarms.jpg',
            agility: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_quickrecovery.jpg',
            intellect: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
            stamina: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_wordfortitude.jpg',
            crit: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadliness.jpg',
            haste: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_bloodlust.jpg',
            mastery: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_championsgrace.jpg',
            versatility: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_intensifyrage.jpg',
            mythicPlus: 'https://wow.zamimg.com/images/wow/icons/large/achievement_challengemode_gold.jpg'
        };

        // Базовая статистика персонажа
        this.characterStats = {
            itemLevel: 668.06,
            mythicPlusRating: 3011,
            raidProgress: '1/8 Эпохальный',
            allStars: 48,
            rank: 6505,
            spec: 'DemonHunter-Vengeance',
            class: 'Охотник на демонов',
            race: 'Эльфы крови',
            equipment: [
                { name: 'Маска торговца Скверной', level: 662, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_cloth_raidfelfire_d_01.jpg' },
                { name: 'Частично зачарованный амулет', level: 662, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_legionraid_03_blue.jpg', 
                  gems: ['Рубин универсальности'] },
                { name: 'Механические хламоплечники', level: 658, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_plate_raidwarrior_r_01.jpg' },
                { name: 'Накидка хламоуправительницы', level: 658, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_cape_draenorraid_d_01.jpg' },
                { name: 'Реактор душ торговца Скверной', level: 678, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_raidwarlock_r_01.jpg' },
                { name: 'Повышатели градуса', level: 665, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_bracer_leather_raiddruid_i_01.jpg' },
                { name: 'Загребатели торговца Скверной', level: 662, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_cloth_raidwarlock_r_01.jpg' },
                { name: 'Застежка выброса адреналина', level: 675, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_belt_leather_raiddruid_i_01.jpg' },
                { name: 'Меховой килт торговца Скверной', level: 678, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_pants_cloth_raidwarlock_r_01.jpg' },
                { name: 'Ботинки-спиноломы', level: 675, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_plate_raiddeathknight_i_01.jpg' },
                { name: 'Перстень Цирци', level: 658, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_legionraid_06_blue.jpg', 
                  gems: ['Искрящийся цитрин владыки грома', 'Рунный цитрин обитателя глубин', 'Рунный цитрин песни ветра'] },
                { name: 'Кольцо Зачумленного', level: 678, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_legionraid_03_blue.jpg',
                  gems: ['Рубин универсальности', 'Рубин универсальности'] },
                { name: 'Импровизированный сефориевый стимулятор', level: 665, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_trinket_80_dungeon_trinket2d.jpg' },
                { name: 'Хромовзрывчатый саперный костюм', level: 665, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_trinket_80_dungeon_trinket1d.jpg' },
                { name: 'Выкованный навеки длинный меч', level: 675, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_2h_felforgeddemonblade_d_01.jpg' },
                { name: 'Выкованный навеки длинный меч', level: 675, 
                  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_2h_felforgeddemonblade_d_01.jpg' }
            ]
        };
        
        // Элементы UI
        this.progressElement = document.querySelector('.stat-value');
        this.raidProgress = document.querySelector('[data-raid-progress]');
        
        // Звуки
        this.refreshSound = new Audio('sound/1.mp3');
        this.refreshSound.volume = 0.1;
        
        // Initialize
        this.init();
    }

    async init() {
        this.updateStats();
        this.startAutoRefresh();
        
        // Add refresh button handler
        const refreshButton = document.getElementById('refreshButton');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.refreshSound.currentTime = 0;
                this.refreshSound.play().catch(() => {});
                this.refreshData();
            });
        }
    }

    startAutoRefresh() {
        setInterval(() => this.refreshData(), this.updateInterval);
    }

    updateStats() {
        const statsGrid = document.querySelector('.stats-grid');
        statsGrid.innerHTML = '';

        const stats = {
            'Сила': '662',
            'Ловкость': '658',
            'Выносливость': '678',
            'Скорость': '665',
            'Критический удар': '675',
            'Искусность': '665',
            'Универсальность': '678'
        };

        Object.entries(stats).forEach(([stat, value]) => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <img src="${statIcons[stat]}" alt="${stat}" class="stat-icon">
                <div>
                    <div class="stat-label">${stat}</div>
                    <div class="stat-value">${value}</div>
                </div>
            `;
            statsGrid.appendChild(statItem);
        });
    }

    updateEquipment() {
        const equipmentList = document.querySelector('.equipment-list');
        equipmentList.innerHTML = '';

        const equipment = {
            'Маска торговца Скверной': '662',
            'Частично зачарованный амулет': '662',
            'Механические хламоплечники': '658',
            'Накидка хламоуправительницы': '658',
            'Реактор душ торговца Скверной': '678',
            'Загребатели торговца Скверной': '662',
            'Импровизированный сефорисвый стимулятор': '665',
            'Хромовзрывчатый сапёрный костюм': '665',
            'Выкованный навеки длинный меч': '675',
            'Повышатели градуса': '665',
            'Застежка выброса адреналина': '675',
            'Меховой килт торговца Скверной': '678',
            'Ботинки-спинодолы': '675',
            'Перстень Цирции': '658',
            'Кольцо Затуманенного': '678'
        };

        Object.entries(equipment).forEach(([item, itemLevel]) => {
            const equipmentItem = document.createElement('div');
            equipmentItem.className = 'equipment-item';
            
            // Проверяем наличие иконки и добавляем запасную, если нужно
            const iconUrl = equipmentIcons[item] || 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            
            // Добавляем обработчик ошибки загрузки изображения
            equipmentItem.innerHTML = `
                <img src="${iconUrl}" 
                     alt="${item}" 
                     class="stat-icon"
                     onerror="this.src='https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'">
                <div class="stat-content">
                    <div class="stat-label">${item}</div>
                    <div class="stat-value">Уровень предмета: ${itemLevel}</div>
                </div>
            `;
            equipmentList.appendChild(equipmentItem);
        });
    }

    async fetchWarcraftLogsData() {
        // В реальном приложении здесь был бы запрос к API WarcraftLogs
        // Для демонстрации используем задержку
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Здесь бы обновлялись данные из ответа API
        this.updateStats();
        this.updateEquipment();
    }

    async refreshData() {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        const refreshButton = document.getElementById('refreshButton');
        refreshButton.classList.add('updating');
        
        try {
            await this.fetchWarcraftLogsData();
        } catch (error) {
            console.error('Ошибка обновления данных:', error);
        } finally {
            this.isUpdating = false;
            refreshButton.classList.remove('updating');
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const updater = new WarcraftLogsUpdater();
});

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.width = bubble.style.height = `${Math.random() * 8 + 4}px`;
    bubble.style.animationDuration = `${Math.random() * 4 + 6}s`;
    bubbles.appendChild(bubble);
    
    // Удаление пузырька после анимации
    bubble.addEventListener('animationend', () => bubble.remove());
}

// Создание пузырьков каждые 800мс (меньше пузырьков)
setInterval(createBubble, 800); 
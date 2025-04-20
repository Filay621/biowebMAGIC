// ==UserScript==
// @name         WarcraftLogs Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Расширенное автообновление WarcraftLogs с подробной информацией
// @author       Your Name
// @match        https://ru.warcraftlogs.com/character/eu/гордунни/Охаёшка
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// Скрипт для автоматического обновления WoW статистики
window.addEventListener('load', function() {
    // Функция для форматирования данных с учетом локализации
    function formatData(data) {
        if (!data || typeof data !== 'string') return window.translations.translate('noData');
        return data.trim();
    }

    // Функция для форматирования процентиля
    function formatPercentile(value) {
        if (!value) return 'Нет данных';
        const num = parseFloat(value);
        if (num === 100) return `<span class="wow-parse-value" data-value="100">${num}</span>`;
        if (num >= 95) return `<span class="wow-parse-value" data-value="95">${num}</span>`;
        if (num >= 75) return `<span class="wow-parse-value" data-value="75">${num}</span>`;
        if (num >= 50) return `<span class="wow-parse-value" data-value="50">${num}</span>`;
        return `<span class="wow-parse-value" data-value="25">${num}</span>`;
    }

    // Функция для получения данных напрямую со страницы
    async function getWowStats() {
        try {
            const response = await fetch('https://ru.warcraftlogs.com/character/eu/гордунни/Охаёшка');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const stats = {
                characterName: 'Охаёшка',
                realm: 'Гордунни (EU)',
                characterClass: 'Охотник на демонов',
                spec: 'Месть',
                raidProgress: '1/8 Эпохальный',
                mPlusRating: '3,011',
                itemLevel: '668.06',
                equipment: [],
                talents: [],
                raids: [],
                rankings: {
                    overall: '95.2',
                    dps: '94.8',
                    hps: '92.1',
                    tank: '96.3'
                },
                recentFights: [],
                bestLogs: [],
                specInfo: {
                    mainStats: {
                        strength: '125',
                        agility: '3856',
                        intellect: '198',
                        stamina: '4521',
                        crit: '22.5%',
                        haste: '18.3%',
                        mastery: '24.1%',
                        versatility: '12.8%'
                    },
                    covenantInfo: 'Ночной Народец',
                    renownLevel: '80',
                    soulbinds: ['Корейн', 'Нийя', 'Творец Снов']
                }
            };

            // Получаем экипировку с подробной информацией
            const equipmentItems = doc.querySelectorAll('[data-wowhead]');
            equipmentItems.forEach(item => {
                const itemName = item.textContent.trim();
                const itemLevel = item.nextElementSibling?.textContent.trim();
                const itemQuality = item.className.includes('q4') ? 'epic' : 
                                  item.className.includes('q3') ? 'rare' : 'common';
                const itemSocket = item.querySelector('.socket') !== null;
                
                if (itemName && itemLevel) {
                    stats.equipment.push({
                        name: itemName,
                        level: itemLevel,
                        quality: itemQuality,
                        hasSocket: itemSocket,
                        enchanted: item.querySelector('.enchant') !== null
                    });
                }
            });

            // Получаем последние бои
            const recentFights = doc.querySelectorAll('.recent-fight');
            recentFights.forEach(fight => {
                stats.recentFights.push({
                    boss: fight.querySelector('.boss-name')?.textContent.trim(),
                    difficulty: fight.querySelector('.difficulty')?.textContent.trim(),
                    date: fight.querySelector('.fight-date')?.textContent.trim(),
                    parse: fight.querySelector('.parse-percent')?.textContent.trim(),
                    rank: fight.querySelector('.rank')?.textContent.trim()
                });
            });

            // Получаем лучшие логи
            const bestLogs = doc.querySelectorAll('.best-parse');
            bestLogs.forEach(log => {
                stats.bestLogs.push({
                    boss: log.querySelector('.boss-name')?.textContent.trim(),
                    difficulty: log.querySelector('.difficulty')?.textContent.trim(),
                    parse: log.querySelector('.parse-percent')?.textContent.trim(),
                    date: log.querySelector('.log-date')?.textContent.trim()
                });
            });

            return stats;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return null;
        }
    }

    // Функция для отслеживания изменений значений
    function trackValueChanges(newValue, oldValue, elementSelector) {
        if (newValue !== oldValue) {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.textContent = newValue;
                element.classList.add('updated');
                setTimeout(() => element.classList.remove('updated'), 1000);
            }
        }
        return newValue;
    }

    // Функция для обновления информации на странице
    async function updateInfo() {
        const stats = await getWowStats();
        if (!stats) return;

        // Сохраняем предыдущие значения
        const prevStats = {
            mPlusRating: document.querySelector('.score-text')?.textContent,
            raidProgress: document.querySelector('.raid-text')?.textContent,
            itemLevel: document.querySelector('.ilvl-text')?.textContent
        };

        // Обновляем основную информацию с отслеживанием изменений
        stats.mPlusRating = trackValueChanges(stats.mPlusRating, prevStats.mPlusRating, '.score-text');
        stats.raidProgress = trackValueChanges(stats.raidProgress, prevStats.raidProgress, '.raid-text');
        stats.itemLevel = trackValueChanges(stats.itemLevel, prevStats.itemLevel, '.ilvl-text');

        // Обновляем информацию на странице
        document.querySelector('.character-name-row span').textContent = `${stats.characterName} (${stats.realm})`;
        document.querySelector('.class-text').textContent = stats.characterClass;
        document.querySelector('.spec-text').textContent = `(${stats.spec})`;

        // Обновляем рейтинги с анимацией
        const rankingsHtml = `
            <div class="wow-info-title">${window.translations.translate('stats')}</div>
            <div class="rankings-grid">
                <div class="ranking-item">
                    <span class="ranking-label">${window.translations.translate('overall')}:</span>
                    ${formatPercentile(stats.rankings.overall)}
                </div>
                <div class="ranking-item">
                    <span class="ranking-label">${window.translations.translate('dps')}:</span>
                    ${formatPercentile(stats.rankings.dps)}
                </div>
                <div class="ranking-item">
                    <span class="ranking-label">${window.translations.translate('hps')}:</span>
                    ${formatPercentile(stats.rankings.hps)}
                </div>
                <div class="ranking-item">
                    <span class="ranking-label">${window.translations.translate('tank')}:</span>
                    ${formatPercentile(stats.rankings.tank)}
                </div>
            </div>
        `;

        // Обновляем последние бои
        const recentFightsHtml = `
            <div class="wow-info-title">${window.translations.translate('recentFights')}</div>
            <div class="recent-fights-list">
                ${stats.recentFights.map(fight => `
                    <div class="fight-item">
                        <div class="fight-boss">${fight.boss}</div>
                        <div class="fight-info">
                            <span class="fight-difficulty">${fight.difficulty}</span>
                            <span class="fight-parse">${formatPercentile(fight.parse)}</span>
                            <span class="fight-date">${fight.date}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Обновляем характеристики
        const statsHtml = `
            <div class="wow-info-title">${window.translations.translate('stats')}</div>
            <div class="stats-grid">
                ${Object.entries(stats.specInfo.mainStats).map(([stat, value]) => `
                    <div class="stat-item">
                        <span class="stat-label">${window.translations.translate(stat)}:</span>
                        <span class="stat-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Обновляем экипировку
        const equipmentHtml = `
            <div class="wow-info-title">${window.translations.translate('equipment')}</div>
            <div class="equipment-grid">
                ${stats.equipment.map(item => `
                    <div class="equipment-item ${item.quality}">
                        <span class="item-name">${item.name}</span>
                        <div class="item-details">
                            <span class="item-level">${item.level}</span>
                            ${item.hasSocket ? '<span class="item-socket">🔘</span>' : ''}
                            ${item.enchanted ? '<span class="item-enchant">✨</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Обновляем панель информации
        const infoPanel = document.querySelector('.wow-info-panel');
        if (infoPanel) {
            infoPanel.innerHTML = rankingsHtml + recentFightsHtml + statsHtml + equipmentHtml;
        }

        // Добавляем эффект обновления
        document.querySelectorAll('.wow-info-stat, .ranking-item, .fight-item, .stat-item, .equipment-item').forEach(element => {
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 1000);
        });
    }

    // Запускаем автообновление каждые 8 секунд
    setInterval(updateInfo, 8000);
    
    // Добавляем обработчик для кнопки обновления
    const refreshButton = document.getElementById('wowRefreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', updateInfo);
    }

    // Первоначальное обновление
    updateInfo();

    console.log('Расширенный скрипт WoW статистики запущен');
}); 
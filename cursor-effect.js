document.addEventListener('DOMContentLoaded', function() {
    // Создаем элемент для свечения
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    // Создаем элемент для мерцающего следа
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    // Массив для хранения точек следа
    const trailDots = [];
    const maxTrailLength = 10;

    // Обновление позиции курсора
    document.addEventListener('mousemove', (e) => {
        // Основное свечение следует за курсором
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Создаем новую точку следа
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        document.body.appendChild(dot);
        trailDots.push(dot);

        // Удаляем старые точки следа
        if (trailDots.length > maxTrailLength) {
            const oldDot = trailDots.shift();
            oldDot.remove();
        }

        // Добавляем случайное мерцание
        if (Math.random() < 0.3) { // 30% шанс мерцания
            cursor.style.opacity = (Math.random() * 0.5 + 0.5).toString(); // Мерцание от 50% до 100% прозрачности
        }
    });
}); 
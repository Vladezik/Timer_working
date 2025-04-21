let timer; // Змінна для збереження ідентифікатора таймера
let timeLeft; // Змінна для збереження залишкового часу
let isRunning = false; // Статус таймера (запущений чи ні)
let isWorkMode = true; // Статус режиму (робочий чи перерва)

const timerDisplay = document.getElementById('timer'); // Елемент для відображення часу
const startBtn = document.getElementById('startBtn'); // Кнопка "Старт"
const pauseBtn = document.getElementById('pauseBtn'); // Кнопка "Пауза"
const resetBtn = document.getElementById('resetBtn'); // Кнопка "Скинути"
const workModeBtn = document.getElementById('workMode'); // Кнопка для режиму "Робота"
const breakModeBtn = document.getElementById('breakMode'); // Кнопка для режиму "Перерва"
const timerCircle = document.querySelector('.timer-circle'); // Круг для відображення прогресу
const alarmSound = document.getElementById('alarmSound'); // Звук будильника
const workSelect = document.getElementById('workDuration'); // Селектор тривалості роботи
const breakSelect = document.getElementById('breakDuration'); // Селектор тривалості перерви

// Функція для отримання часу роботи в секундах
function getWorkTime() {
    return parseInt(workSelect.value) * 60; // Перетворюємо хвилини в секунди
}

// Функція для отримання часу перерви в секундах
function getBreakTime() {
    return parseInt(breakSelect.value) * 60; // Перетворюємо хвилини в секунди
}

// Оновлення відображення часу на екрані
function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0'); // Мінути
    const secs = (seconds % 60).toString().padStart(2, '0'); // Секунди
    timerDisplay.textContent = `${mins}:${secs}`; // Відображаємо час
}

// Оновлення прогресу на колі
function updateProgressCircle(timeLeft, totalTime) {
    const circumference = 283; // Окружність кола
    const offset = circumference - (timeLeft / totalTime) * circumference; // Відступ для прогресу
    timerCircle.style.strokeDashoffset = offset; // Оновлюємо відступ кола
}

// Перемикання між режимами "Робота" і "Перерва"
function switchMode(workMode) {
    isWorkMode = workMode; // Змінюємо режим
    timeLeft = workMode ? getWorkTime() : getBreakTime(); // Встановлюємо час залежно від режиму

    // Змінюємо активність кнопок режимів
    workModeBtn.classList.toggle('active', workMode);
    breakModeBtn.classList.toggle('active', !workMode);

    // Оновлюємо відображення часу та прогрес
    updateDisplay(timeLeft);
    updateProgressCircle(timeLeft, timeLeft);
    startBtn.disabled = false; // Дозволяємо натискати "Старт"
    pauseBtn.disabled = true; // Блокуємо кнопку "Пауза"
}

// Функція для запуску таймера
function startTimer() {
    if (!isRunning) { // Якщо таймер ще не запущено
        isRunning = true; // Змінюємо статус на "запущено"
        startBtn.disabled = true; // Блокуємо кнопку "Старт"
        pauseBtn.disabled = false; // Дозволяємо натискати "Пауза"

        const totalTime = isWorkMode ? getWorkTime() : getBreakTime(); // Загальний час для поточного режиму

        // Оновлюємо час кожну секунду
        timer = setInterval(() => {
            timeLeft--; // Зменшуємо залишковий час
            updateDisplay(timeLeft); // Оновлюємо відображення
            updateProgressCircle(timeLeft, totalTime); // Оновлюємо прогрес

            // Якщо час вийшов, змінюємо режим і відтворюємо звук
            if (timeLeft <= 0) {
                clearInterval(timer); // Зупиняємо таймер
                alarmSound.play(); // Відтворюємо звук
                isRunning = false; // Змінюємо статус на "не запущено"
                switchMode(!isWorkMode); // Перемикаємо режим
                startTimer(); // Запускаємо новий таймер для нового режиму
            }
        }, 1000); // Інтервал 1 секунда
    }
}

// Функція для призупинення таймера
function pauseTimer() {
    if (isRunning) { // Якщо таймер запущений
        clearInterval(timer); // Зупиняємо таймер
        isRunning = false; // Змінюємо статус на "не запущено"
        startBtn.disabled = false; // Дозволяємо натискати "Старт"
        pauseBtn.disabled = true; // Блокуємо кнопку "Пауза"
    }
}

// Функція для скидання таймера
function resetTimer() {
    clearInterval(timer); // Зупиняємо таймер
    isRunning = false; // Змінюємо статус на "не запущено"
    timeLeft = isWorkMode ? getWorkTime() : getBreakTime(); // Встановлюємо час на початковий
    updateDisplay(timeLeft); // Оновлюємо відображення часу
    updateProgressCircle(timeLeft, timeLeft); // Оновлюємо прогрес
    startBtn.disabled = false; // Дозволяємо натискати "Старт"
    pauseBtn.disabled = true; // Блокуємо кнопку "Пауза"
}

// Додаємо слухачі подій для кнопок
startBtn.addEventListener('click', startTimer); // Кнопка "Старт"
pauseBtn.addEventListener('click', pauseTimer); // Кнопка "Пауза"
resetBtn.addEventListener('click', resetTimer); // Кнопка "Скинути"
workModeBtn.addEventListener('click', () => switchMode(true)); // Кнопка "Робота"
breakModeBtn.addEventListener('click', () => switchMode(false)); // Кнопка "Перерва"

// Оновлюємо час при зміні тривалості роботи
workSelect.addEventListener('change', () => {
    if (isWorkMode) resetTimer(); // Якщо зараз робочий режим, скидаємо таймер
});

// Оновлюємо час при зміні тривалості перерви
breakSelect.addEventListener('change', () => {
    if (!isWorkMode) resetTimer(); // Якщо зараз перерва, скидаємо таймер
});

// Ініціалізуємо таймер на стартовий режим (робота)
switchMode(true);
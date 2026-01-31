const images = [
    "img/yellow1_mtb.jpg",
    "img/home-mtb.jpg",
    "img/red_mtb.jpg"
];

let current = 0;
let next = 1;

const mainBlock = document.querySelector(".main-block");

function changeBackground() {
    const before = window.getComputedStyle(mainBlock, "::before");
    const after = window.getComputedStyle(mainBlock, "::after");

    mainBlock.style.setProperty("--next-bg", `url(${images[next]})`);
    mainBlock.classList.add("fade");

    setTimeout(() => {
        mainBlock.style.backgroundImage = `url(${images[next]})`;
        mainBlock.classList.remove("fade");
        current = next;
        next = (next + 1) % images.length;
    }, 1000);
}

mainBlock.style.backgroundImage = `url(${images[current]})`;
setInterval(changeBackground, 2500);

// ====== КОД ДЛЯ БЕЗКІНЕЧНОЇ АНІМАЦІЇ БЛОКІВ З ВЕЛОСИПЕДАМИ ======

const blocks = document.querySelectorAll('.mtb_photo > div');
let currentBlockIndex = 0;
let isAnimating = false;
let animationTimeout;

// Функція для скидання тексту в блоці
function resetBlockText(block) {
    const items = block.querySelectorAll('li');
    items.forEach(item => {
        item.style.display = 'none';
        // Відновлюємо оригінальний текст
        if (item.dataset.originalText) {
            item.textContent = item.dataset.originalText;
        }
    });
}

// Функція для анімації друку тексту в конкретному блоці
function typeTextInBlock(block) {
    const items = block.querySelectorAll('li');
    let itemIndex = 0;
    let charIndex = 0;
    
    function typeNextItem() {
        if (itemIndex >= items.length) {
            // Текст надруковано, запускаємо таймер для наступного блоку
            isAnimating = false;
            animationTimeout = setTimeout(animateToNextBlock, 2000); // 2 секунди паузи
            return;
        }

        const item = items[itemIndex];
        item.style.display = 'block';
        const text = item.textContent;
        
        // Зберігаємо оригінальний текст (якщо ще не збережено)
        if (!item.dataset.originalText) {
            item.dataset.originalText = text;
        }
        
        // Очищаємо для анімації друку
        item.textContent = '';

        function typeNextChar() {
            if (charIndex < text.length) {
                item.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeNextChar, 30); // швидший друк
            } else {
                // Рядок завершено
                charIndex = 0;
                itemIndex++;
                setTimeout(typeNextItem, 200); // коротша пауза між рядками
            }
        }
        
        typeNextChar();
    }
    
    // Скидаємо текст перед початком нової анімації
    resetBlockText(block);
    
    // Починаємо друк
    isAnimating = true;
    typeNextItem();
}

// Функція для плавного переходу до наступного блоку
function animateToNextBlock() {
    if (isAnimating) return;
    
    isAnimating = true;
    const currentBlock = blocks[currentBlockIndex];
    const nextBlockIndex = (currentBlockIndex + 1) % blocks.length;
    const nextBlock = blocks[nextBlockIndex];
    
    // Плавно ховаємо поточний блок
    currentBlock.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    currentBlock.style.opacity = '0';
    currentBlock.style.transform = 'translateX(-20px)';
    
    // Показуємо наступний блок
    nextBlock.style.display = 'block';
    nextBlock.style.transition = 'none';
    nextBlock.style.opacity = '0';
    nextBlock.style.transform = 'translateX(20px)';
    
    // Невелика затримка для початку анімації
    setTimeout(() => {
        nextBlock.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        nextBlock.style.opacity = '1';
        nextBlock.style.transform = 'translateX(0)';
        
        // Після завершення анімації
        setTimeout(() => {
            // Ховаємо поточний блок повністю
            currentBlock.style.display = 'none';
            
            // Скидаємо стилі
            currentBlock.style.opacity = '1';
            currentBlock.style.transform = 'translateX(0)';
            currentBlock.style.transition = 'none';
            
            // Скидаємо текст у поточному блоці для наступного циклу
            resetBlockText(currentBlock);
            
            // Оновлюємо індекс
            currentBlockIndex = nextBlockIndex;
            
            // Запускаємо друк тексту в новому блоці без затримки
            typeTextInBlock(nextBlock);
            
        }, 500);
    }, 10);
}

// Ініціалізація блоків
function initializeBlocks() {
    blocks.forEach((block, index) => {
        if (index === 0) {
            block.style.display = 'block';
            block.style.opacity = '1';
            block.style.transform = 'translateX(0)';
        } else {
            block.style.display = 'none';
            block.style.opacity = '0';
            block.style.transform = 'translateX(20px)';
        }
        
        // Скидаємо текст в усіх блоках
        resetBlockText(block);
    });
}

// Ініціалізуємо блоки
initializeBlocks();

// Запускаємо перший цикл анімації без затримки
typeTextInBlock(blocks[0]);

// Код для каруселі (залишаємо без змін)
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot2');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Функція для оновлення каруселі
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Оновлення активних точок
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Перехід до певного слайду
    function goToSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        updateCarousel();
    }
    
    // Наступний слайд
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Попередній слайд
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Автоматична зміна слайдів кожні 5 секунд
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Зупинити автоматичну зміну при наведенні
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Відновити автоматичну зміну при відведенні курсора
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Обробники подій для кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Обробники подій для точок
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-index'));
            goToSlide(slideIndex);
        });
    });
    
    // Обробка клавіш стрілок на клавіатурі
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Ініціалізація каруселі
    updateCarousel();
});

// Додай в кінець script.js
document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
    const dot = wrapper.querySelector('.dot');
    const tooltip = wrapper.querySelector('.tooltip');
    
    // Плавне відкриття
    wrapper.addEventListener('mouseenter', () => {
        wrapper.classList.add('active');
        
        // Додаємо затримку для плавності
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
        }, 50);
    });
    
    // Плавне закриття
    wrapper.addEventListener('mouseleave', () => {
        wrapper.classList.remove('active');
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateX(-50%)';
    });
    
    // Клік фокусує увагу
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Видаляємо активний стан з інших
        document.querySelectorAll('.tooltip-wrapper').forEach(w => {
            if (w !== wrapper) {
                w.classList.remove('active');
                w.querySelector('.tooltip').style.opacity = '0';
                w.querySelector('.tooltip').style.visibility = 'hidden';
            }
        });
        
        // Активуємо поточний
        wrapper.classList.add('active');
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
    });
});

// Закриваємо всі тултіпи при кліку поза ними
document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-wrapper')) {
        document.querySelectorAll('.tooltip-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
            const tooltip = wrapper.querySelector('.tooltip');
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%)';
        });
    }
});

// Додаємо можливість зупинки анімації при наведенні на блок
blocks.forEach(block => {
    block.addEventListener('mouseenter', () => {
        if (animationTimeout) {
            clearTimeout(animationTimeout);
        }
    });
    
    block.addEventListener('mouseleave', () => {
        if (!isAnimating) {
            animationTimeout = setTimeout(animateToNextBlock, 1000);
        }
    });
});
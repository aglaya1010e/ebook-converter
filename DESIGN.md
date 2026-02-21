# Ebook Flow - Organic Design System

> **Источник истины для органического UI/UX дизайна**
> 
> Природно-вдохновленный дизайн с плавными формами и успокаивающими цветами

---

## 🎨 Цветовая палитра

### Основные цвета

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--sky-blue` | `#e0f2fe` | Фоновые градиенты, светлые акценты |
| `--mint-pastel` | `#f0fdf4` | Фоновые градиенты, мягкие элементы |
| `--leaf-green` | `#dcfce7` | Фоновые градиенты, природные акценты |
| `--sage-green` | `#d1d5db` | Вспомогательные элементы |

### Акцентные цвета

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--teal-accent` | `#2dd4bf` | Интерактивные элементы, кнопки |
| `--teal-dark` | `#0d9488` | Активные состояния |
| `--teal-light` | `#5eead4` | Ховер эффекты |

### Текстовые цвета

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--text-primary` | `#134e4a` (teal-900) | Основной текст |
| `--text-secondary` | `rgba(19, 78, 74, 0.7)` | Вторичный текст |
| `--text-muted` | `rgba(19, 78, 74, 0.5)` | Подсказки, метаданные |
| `--text-on-accent` | `#ffffff` | Текст на акцентных кнопках |

### Темная тема

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--dark-bg-start` | `#0f172a` | Начало градиента фона |
| `--dark-bg-end` | `#134e4a` | Конец градиента фона |
| `--dark-text-primary` | `#ccfbf1` (teal-100) | Основной текст |
| `--dark-text-secondary` | `rgba(204, 251, 241, 0.7)` | Вторичный текст |

### Градиенты

```css
/* Фоновый градиент (светлая тема) */
background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #dcfce7 100%);

/* Фоновый градиент (темная тема) */
background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%);

/* Акцентный градиент для кнопок */
background: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
```

---

## 📝 Типографика

### Семейства шрифтов

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--font-primary` | `'Nunito', sans-serif` | Все элементы интерфейса |

### Веса шрифтов

- **Light (300)**: Тонкие заголовки, декоративные элементы
- **Regular (400)**: Основной текст, описания
- **Semibold (600)**: Важные элементы, navigation
- **Bold (700)**: Заголовки, акцентный текст

### Размеры

```css
/* Заголовки */
h1 { font-size: 1.875rem; font-weight: 700; } /* 30px */
h2 { font-size: 1.25rem; font-weight: 700; }  /* 20px */
h3 { font-size: 1rem; font-weight: 600; }      /* 16px */

/* Текст */
body { font-size: 0.875rem; line-height: 1.6; } /* 14px */
.subtitle { font-size: 0.875rem; font-weight: 500; }
.small { font-size: 0.75rem; }                   /* 12px */
```

---

## 🌿 Органические формы

### Морфинг-формы

```css
.organic-shape {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  transition: all 0.5s ease-in-out;
}

.organic-shape:hover {
  border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%;
}
```

### Статичные радиусы

- **Маленькие**: `1rem` (16px) - бейджи
- **Средние**: `2rem` (32px) - кнопки, табы
- **Большие**: `2.5rem` (40px) - контейнеры
- **Полные**: `50%` - круглые элементы (dark mode toggle)

---

## ✨ Glassmorphism

### Светлая тема

```css
.glass-morphism {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Темная тема

```css
.dark .glass-morphism {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 🧩 Компоненты

### 1. Заголовок с иконкой

**Структура**:
```html
<h1 class="title">
  <span class="icon material-symbols-outlined leaf-icon">eco</span>
  Ebook Flow
</h1>
<p class="subtitle">Гармонизация вашей цифровой библиотеки</p>
```

**Стили**:
- Иконка с заливкой (filled)
- Цвет: teal-500 для иконки, teal-800 для текста
- Выравнивание по центру

---

### 2. Навигация табами

**Структура**:
```html
<div class="glass-morphism tab-nav">
  <button class="tab-btn active">
    <span class="material-symbols-outlined">auto_stories</span>
    <span>Конвертер</span>
  </button>
  <button class="tab-btn">
    <span class="material-symbols-outlined">content_cut</span>
    <span>Разделитель</span>
  </button>
</div>
```

**Стили**:
- Padding: `0.375rem` (6px)
- Gap: `0.5rem` (8px)
- Border-radius: `2.5rem`
- Активная кнопка: белый/полупрозрачный фон + тень

**Состояния**:
- **Default**: Прозрачный фон, полупрозрачный текст
- **Hover**: Более яркий текст
- **Active**: Белый фон (светлая тема) / полупрозрачный teal (темная)

---

### 3. Органическая зона загрузки

**Структура**:
```html
<div class="organic-drop-zone">
  <div class="icon-wrapper">
    <span class="material-symbols-outlined">water_drop</span>
  </div>
  <h2>Перетащите файлы сюда для конвертации</h2>
  <div class="format-badges">
    <span class="badge">EPUB</span>
    <span class="badge">MOBI</span>
    <span class="badge">FB2</span>
  </div>
  <span class="arrow">expand_more</span>
  <div class="output-badge">TXT</div>
</div>
```

**Стили**:
- Органическая форма с морфингом
- Glassmorphism эффект
- Min-height: `380px`
- Padding: `2.5rem`
- Фоновое свечение (blur-2xl)

**Элементы**:
- **Иконка**: 4.5rem размер, в круглом контейнере с фоном
- **Бейджи форматов**: Полупрозрачный teal фон, border
- **Стрелка**: Полупрозрачная
- **Выходной формат**: Teal gradient, белый текст, тень

---

### 4. Плавающие блобы

**Структура**:
```html
<div class="floating-blob blob-1"></div>
<div class="floating-blob blob-2"></div>
```

**Стили**:
```css
.floating-blob {
  position: absolute;
  z-index: -1;
  filter: blur(40px);
  opacity: 0.6;
  border-radius: 50%;
}

.blob-1 {
  width: 16rem;
  height: 16rem;
  background: #99f6e4; /* teal-200 */
  top: -10%;
  left: -10%;
}

.blob-2 {
  width: 20rem;
  height: 20rem;
  background: #bae6fd; /* sky-200 */
  bottom: -10%;
  right: -10%;
}
```

---

### 5. Кнопки

#### Основная кнопка

```css
.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(45, 212, 191, 0.2);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 212, 191, 0.3);
}
```

#### Вторичная кнопка

```css
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  background: rgba(45, 212, 191, 0.1);
  color: #0d9488;
  border: 2px solid rgba(45, 212, 191, 0.3);
  font-weight: 600;
}
```

#### Toggle кнопка (Dark Mode)

```css
.toggle-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.toggle-btn:hover {
  transform: scale(1.1);
}
```

---

### 6. Элемент файла

**Структура**:
```html
<div class="file-item glass-morphism">
  <div class="file-info">
    <span class="file-name">example.epub</span>
    <span class="file-meta">142.5 KB | В ожидании</span>
  </div>
  <button class="btn-primary btn-sm">Конвертировать</button>
</div>
```

**Стили**:
- Glassmorphism фон
- Padding: `1.25rem 1.875rem`
- Border-radius: `1rem`
- Flexbox layout с space-between

---

### 7. Бейджи форматов

```css
.format-badge {
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  background: rgba(45, 212, 191, 0.1);
  color: #0d9488;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(45, 212, 191, 0.2);
}
```

---

### 8. Футер с безопасностью

**Структура**:
```html
<footer class="security-footer">
  <div class="glass-morphism security-badge">
    <span class="material-symbols-outlined">verified_user</span>
    <p>Естественно безопасно. Только локальная обработка.</p>
  </div>
</footer>
```

**Стили**:
- Padding: `0.75rem 1.5rem`
- Border-radius: full
- Маленький шрифт (0.75rem)
- Иконка + текст с gap

---

### 9. Фиксированные контролы

**Структура**:
```html
<div class="fixed-controls">
  <button class="control-btn" onclick="toggleDarkMode()">
    <span class="material-symbols-outlined">dark_mode</span>
  </button>
  <button class="control-btn">
    <span class="material-symbols-outlined">settings</span>
  </button>
</div>
```

**Позиция**:
- Position: fixed
- Top: 1.5rem
- Right: 1.5rem
- Gap: 0.75rem

---

## 🎬 Анимации

### Переходы

```css
/* Стандартные */
transition: all 0.3s ease;

/* Плавные морфинги */
transition: all 0.5s ease-in-out;

/* Быстрые интерактивы */
transition: transform 0.2s ease;
```

### Ховер эффекты

1. **Органическая зона**: Морфинг формы + усиление свечения
2. **Кнопки**: Подъем вверх + усиление тени
3. **Табы**: Изменение фона и цвета
4. **Toggle**: Scale увеличение

### Material Symbols

Используются иконки с настройками:
```css
.leaf-icon {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
```

**Основные иконки**:
- `eco` - логотип (лист)
- `water_drop` - зона загрузки
- `auto_stories` - конвертер
- `content_cut` - разделитель
- `verified_user` - безопасность
- `dark_mode` / `light_mode` - переключатель темы
- `settings` - настройки
- `expand_more` - стрелка вниз

---

## 🌐 Темная тема

### Переключение

```javascript
document.documentElement.classList.toggle('dark');
```

### Основные изменения

| Элемент | Светлая тема | Темная тема |
|---------|--------------|-------------|
| Фон | Sky-Mint градиент | Slate-Teal градиент |
| Glass фон | `rgba(255,255,255,0.4)` | `rgba(15,23,42,0.6)` |
| Текст | Teal-900 | Teal-100 |
| Бордеры | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.1)` |

---

## 📐 Spacing Scale

- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `0.75rem` (12px)
- **lg**: `1rem` (16px)
- **xl**: `1.5rem` (24px)
- **2xl**: `2rem` (32px)
- **3xl**: `2.5rem` (40px)
- **4xl**: `3rem` (48px)

---

## 🎯 Принципы дизайна

### Органичность
- Плавные, природные формы
- Морфинг-анимации
- Мягкие переходы

### Прозрачность
- Glassmorphism везде
- Многослойность
- Размытие для глубины

### Природность
- Цвета воды и растений
- Иконки природных элементов
- Успокаивающая палитра

### Функциональность
- Каждый элемент имеет назначение
- Понятные визуальные подсказки
- Адаптивный дизайн

---

## 🚀 Использование с Stitch AI

При работе со Stitch AI используйте эти ключевые термины:

**Цвета**: `--teal-accent`, `--sky-blue`, `--mint-pastel`  
**Эффекты**: glassmorphism, organic shapes, floating blobs  
**Шрифт**: Nunito  
**Иконки**: Material Symbols (filled)  
**Тема**: Organic, nature-inspired, calming

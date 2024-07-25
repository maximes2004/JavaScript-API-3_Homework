// Константы для элементов DOM
const imageElement = document.getElementById("randomImage");
const photographerNameElement = document.getElementById("photographerName");
const likeButton = document.getElementById("likeButton");
const likeCounter = document.getElementById("likeCounter");
const newImageButton = document.getElementById("newImageButton");

// API ключ и базовый URL для получения случайного изображения
const UNSPLASH_API_KEY = "Вставить API ключ здесь (Access Key)";
const UNSPLASH_RANDOM_URL = "https://api.unsplash.com/photos/random";

// Текущий объект изображения для отслеживания состояния
let currentImage = null;
let likes = {};

// Функция для получения случайного изображения
async function fetchRandomImage() {
  try {
    // Отправка запроса на получение случайного изображения
    const response = await fetch(
      `${UNSPLASH_RANDOM_URL}?client_id=${UNSPLASH_API_KEY}`
    );
    const data = await response.json();

    // Обновление текущего изображения
    currentImage = {
      id: data.id,
      url: data.urls.regular,
      photographer: data.user.name,
    };

    // Обновление DOM элементов с данными изображения
    imageElement.src = currentImage.url;
    photographerNameElement.textContent = `Photo by: ${currentImage.photographer}`;

    // Обновление счетчика лайков
    updateLikeCounter();
  } catch (error) {
    console.error("Error fetching random image:", error);
  }
}

// Функция для обновления счетчика лайков
function updateLikeCounter() {
  // Проверка, если текущий объект изображения существует
  if (currentImage && likes[currentImage.id]) {
    likeCounter.textContent = `Likes: ${likes[currentImage.id]}`;
    likeButton.textContent = "Unlike";
  } else {
    likeCounter.textContent = "Likes: 0";
    likeButton.textContent = "Like";
  }
}

// Функция для обработки нажатия кнопки "лайк"
function handleLikeButtonClick() {
  if (!currentImage) return;

  // Проверка, если текущий объект изображения уже лайкнут
  if (likes[currentImage.id]) {
    // Удаление лайка
    delete likes[currentImage.id];
  } else {
    // Добавление лайка
    likes[currentImage.id] = 1;
  }

  // Сохранение лайков в localStorage
  localStorage.setItem("likes", JSON.stringify(likes));

  // Обновление счетчика лайков
  updateLikeCounter();
}

// Загрузка лайков из localStorage при инициализации
function loadLikes() {
  const savedLikes = localStorage.getItem("likes");
  if (savedLikes) {
    likes = JSON.parse(savedLikes);
  }
}

// Инициализация приложения
function init() {
  // Загрузка лайков из localStorage
  loadLikes();

  // Получение случайного изображения при загрузке страницы
  fetchRandomImage();

  // Добавление обработчика события для кнопки "лайк"
  likeButton.addEventListener("click", handleLikeButtonClick);

  // Добавление обработчика события для кнопки "новое изображение"
  newImageButton.addEventListener("click", fetchRandomImage);
}

// Запуск инициализации приложения
init();

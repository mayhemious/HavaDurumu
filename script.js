const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // BURAYA KENDİ OpenWeatherMap API ANAHTARINIZI GİRİN
// Örnek: const API_KEY = 'c77cd01d68d5e4922b8584bd74e351d9'; // Bu satırı silin veya yorumlayın ve üsttekini kullanın.
const BASE_URL_CURRENT = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loadingDiv = document.getElementById('loading');
const weatherResultDiv = document.getElementById('weatherResult');
const forecastResultDiv = document.getElementById('forecastResult');

const weatherIcons = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️', '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️', '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️'
};

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
    else { showError('Lütfen bir şehir adı girin!'); cityInput.focus(); }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
        else { showError('Lütfen bir şehir adı girin!'); cityInput.focus(); }
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        loadingDiv.classList.add('show');
        loadingDiv.textContent = '📍 Konumunuz alınıyor...';
        setButtonsDisabled(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                loadingDiv.textContent = '🔄 Hava durumu bilgileri getiriliyor...';
            }, handleLocationError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else { showError("Tarayıcınız konum servisini desteklemiyor."); }
});

function handleLocationError(error) {
    loadingDiv.classList.remove('show');
    setButtonsDisabled(false);
    let errorMsg = "Konum bilgisi alınamadı. ";
    switch(error.code) {
        case error.PERMISSION_DENIED: errorMsg += "Konum izni vermediniz."; break;
        case error.POSITION_UNAVAILABLE: errorMsg += "Konum bilgisi mevcut değil."; break;
        case error.TIMEOUT: errorMsg += "Konum alma isteği zaman aşımına uğradı."; break;
        default: errorMsg += "Bilinmeyen bir hata oluştu."; break;
    }
    showError(errorMsg); console.error("Konum Hatası:", error);
}

function setButtonsDisabled(isDisabled) {
    searchBtn.disabled = isDisabled; locationBtn.disabled = isDisabled;
}

async function fetchWeatherByCity(city) {
    const currentWeatherUrl = `${BASE_URL_CURRENT}?q=${encodeURIComponent(city)}&appid=${API_KEY}&lang=tr&units=metric`;
    const forecastUrl = `${BASE_URL_FORECAST}?q=${encodeURIComponent(city)}&appid=${API_KEY}&lang=tr&units=metric`;
    await fetchWeatherData(currentWeatherUrl, forecastUrl, city);
}

async function fetchWeatherByCoords(lat, lon) {
    const currentWeatherUrl = `${BASE_URL_CURRENT}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=tr&units=metric`;
    const forecastUrl = `${BASE_URL_FORECAST}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=tr&units=metric`;
    await fetchWeatherData(currentWeatherUrl, forecastUrl);
}

async function fetchWeatherData(currentUrl, forecastUrl, initialCityName = null) {
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
        showError('Lütfen script.js dosyasında geçerli bir OpenWeatherMap API anahtarı tanımlayın.');
        return;
    }

    setButtonsDisabled(true);
    searchBtn.innerHTML = '<span aria-hidden="true">🔄</span> Aranıyor...';
    loadingDiv.classList.add('show');
    weatherResultDiv.innerHTML = '';
    forecastResultDiv.innerHTML = '';

    const weatherCardEl = weatherResultDiv.querySelector('.weather-card');
    if (weatherCardEl) weatherCardEl.style.minHeight = 'auto';

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl), fetch(forecastUrl)
        ]);
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        let hasError = false;

        if (currentResponse.ok && currentData.cod === 200) {
            displayWeatherData(currentData);
            if (!cityInput.value && currentData.name) cityInput.value = currentData.name;
        } else {
            showError(currentData.message || `Anlık hava durumu alınamadı: ${initialCityName || 'konum'}`);
            hasError = true;
        }

        if (forecastResponse.ok && forecastData.cod === "200") {
            const processedForecast = processForecastData(forecastData.list);
            displayForecastData(processedForecast);
        } else {
            if (!hasError) showError(forecastData.message || `Tahmin verileri alınamadı: ${initialCityName || 'konum'}`);
        }
    } catch (error) {
        showError('Bağlantı hatası veya API ile iletişim kurulamadı.');
        console.error('Hata:', error);
    } finally {
        setButtonsDisabled(false);
        searchBtn.innerHTML = '<span aria-hidden="true">🔍</span> Ara';
        loadingDiv.classList.remove('show');
        if (loadingDiv.textContent.includes('Konumunuz')) {
            loadingDiv.textContent = '🔄 Hava durumu bilgileri getiriliyor...';
        }
    }
}

function displayWeatherData(data) {
    const { main, weather, wind = {speed:0}, sys = {}, name } = data;
    const icon = weatherIcons[weather[0].icon] || '🌡️';
    const currentTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const weatherHTML = `
        <div class="weather-card">
            <div class="city-name">🌍 ${name.toUpperCase()}</div>
            <div class="weather-main">
                <div class="weather-icon">${icon}</div>
                <div class="temperature">${Math.round(main.temp)}°C</div>
            </div>
            <div class="description">${weather[0].description}</div>
            <div class="feels-like">Hissedilen: ${Math.round(main.feels_like)}°C</div>
            <div class="weather-details">
                <div class="detail-item"><div class="detail-label">💧 Nem</div><div class="detail-value">${main.humidity}%</div></div>
                <div class="detail-item"><div class="detail-label">📊 Basınç</div><div class="detail-value">${main.pressure} hPa</div></div>
                <div class="detail-item"><div class="detail-label">🌪️ Rüzgar</div><div class="detail-value">${wind.speed.toFixed(1)} m/s</div></div>
                ${sys.sunrise ? `<div class="detail-item"><div class="detail-label">🌅 G.Doğumu</div><div class="detail-value">${new Date(sys.sunrise * 1000).toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})}</div></div>` : ''}
                ${sys.sunset ? `<div class="detail-item"><div class="detail-label">🌇 G.Batımı</div><div class="detail-value">${new Date(sys.sunset * 1000).toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})}</div></div>` : ''}
                <div class="detail-item"><div class="detail-label">🌡️ Min/Maks</div><div class="detail-value">${Math.round(main.temp_min)}°/${Math.round(main.temp_max)}°</div></div>
            </div>
            <div class="update-time">⏰ Güncelleme: ${currentTime}</div>
        </div>`;
    weatherResultDiv.innerHTML = weatherHTML;
    requestAnimationFrame(() => {
        const card = weatherResultDiv.querySelector('.weather-card');
        if (card) card.classList.add('show');
    });
}

function processForecastData(forecastList) {
    const dailyData = {};
    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = { temps: [], icons: {}, descriptions: {}, dateObj: new Date(item.dt * 1000) };
        }
        dailyData[date].temps.push(item.main.temp);
        const iconCode = item.weather[0].icon;
        const desc = item.weather[0].description;
        dailyData[date].icons[iconCode] = (dailyData[date].icons[iconCode] || 0) + 1;
        dailyData[date].descriptions[desc] = (dailyData[date].descriptions[desc] || 0) + 1;
    });
    const processedDays = [];
    const sortedDates = Object.keys(dailyData).sort((a, b) => dailyData[a].dateObj - dailyData[b].dateObj);
    const today = new Date(); today.setHours(0,0,0,0);

    for (const dateKey of sortedDates) {
        if (processedDays.length >= 3) break;
        const day = dailyData[dateKey];
        const forecastDate = new Date(day.dateObj); forecastDate.setHours(0,0,0,0);
        if (forecastDate > today) {
            const minTemp = Math.round(Math.min(...day.temps));
            const maxTemp = Math.round(Math.max(...day.temps));
            let mostFreqIcon = '01d';
            if(Object.keys(day.icons).length) mostFreqIcon = Object.keys(day.icons).reduce((a,b) => day.icons[a] > day.icons[b] ? a : b);
            let mostFreqDesc = 'açık';
            if(Object.keys(day.descriptions).length) mostFreqDesc = Object.keys(day.descriptions).reduce((a,b) => day.descriptions[a] > day.descriptions[b] ? a : b);
            processedDays.push({
                date: day.dateObj.toLocaleDateString('tr-TR', {day:'numeric',month:'short'}),
                dayName: day.dateObj.toLocaleDateString('tr-TR', {weekday:'short'}),
                minTemp, maxTemp, icon: weatherIcons[mostFreqIcon] || '🌡️', description: mostFreqDesc
            });
        }
    }
    return processedDays;
}

function displayForecastData(forecastDays) {
    let forecastHTML = '';
    if (!forecastDays || forecastDays.length === 0) {
        forecastResultDiv.innerHTML = '<div class="error" style="text-align:center;">Sonraki günler için tahmin verisi bulunamadı.</div>';
        adjustWeatherCardHeight();
        return;
    }
    forecastDays.forEach(day => {
        forecastHTML += `
            <div class="forecast-card">
                <div class="forecast-day-name">${day.dayName}</div>
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-icon">${day.icon}</div>
                <div class="forecast-temps">${day.maxTemp}° <span class="min">${day.minTemp}°</span></div>
                <div class="forecast-description">${day.description}</div>
            </div>`;
    });
    forecastResultDiv.innerHTML = forecastHTML;

    requestAnimationFrame(() => {
        const forecastCards = forecastResultDiv.querySelectorAll('.forecast-card');
        forecastCards.forEach((card) => {
            card.classList.add('show');
        });
        adjustWeatherCardHeight();
    });
}

function adjustWeatherCardHeight() {
    const weatherCard = weatherResultDiv.querySelector('.weather-card');
    if (!weatherCard) return;

    // Weather card'ı görünür yapalım ki yüksekliği doğru hesaplansın (eğer gizliyse)
    if (!weatherCard.classList.contains('show') && weatherCard.innerHTML.trim() !== '' && !weatherCard.querySelector('.error')) {
         requestAnimationFrame(() => weatherCard.classList.add('show'));
    }

    const forecastCards = forecastResultDiv.querySelectorAll('.forecast-card.show');
    let totalForecastHeight = 0;
    const forecastGap = 10;

    if (forecastCards.length > 0) {
        forecastCards.forEach((card, index) => {
            totalForecastHeight += card.offsetHeight;
            if (index < forecastCards.length - 1) {
                totalForecastHeight += forecastGap;
            }
        });
    }

    if (totalForecastHeight > 0) {
        weatherCard.style.minHeight = `${totalForecastHeight}px`;
    } else {
        // Eğer tahmin kartı yoksa veya hata mesajı gösteriliyorsa,
        // anlık hava durumu kartı kendi içeriğine göre boyutlansın.
        // Hata mesajı varsa, weatherCard'ın minHeight'ını sıfırlamadan önce
        // weatherCard'ın içinde bir hata mesajı olup olmadığını kontrol edebiliriz.
        if (weatherResultDiv.querySelector('.error')) {
            weatherCard.style.minHeight = 'auto'; // Hata durumunda kendi yüksekliğine dönsün
        } else if (weatherCard.innerHTML.trim() !== '') {
            // Anlık hava durumu verisi var ama tahmin yoksa, yine auto.
            weatherCard.style.minHeight = 'auto';
        }
        // Eğer weatherCard boşsa zaten bir şey yapmaya gerek yok.
    }
}

function showError(message) {
    weatherResultDiv.innerHTML = `<div class="error" style="width:100%; text-align:center;">❌ ${message}</div>`;
    forecastResultDiv.innerHTML = ''; // Tahminleri temizle
    
    const errorCard = weatherResultDiv.querySelector('.error');
    if (errorCard) {
        requestAnimationFrame(() => { if(errorCard) errorCard.style.opacity = '1'; }); // Hata kartını görünür yap
    }
    // Hata durumunda, eğer bir weather-card varsa (içinde hata mesajı olan), yüksekliğini sıfırla.
    // Genellikle showError, weatherResultDiv'i tamamen değiştirdiği için weather-card kalmaz.
    // Ama eğer kalıyorsa diye bir kontrol:
    const existingWeatherCard = weatherResultDiv.querySelector('.weather-card');
    if(existingWeatherCard) existingWeatherCard.style.minHeight = 'auto';
    else adjustWeatherCardHeight(); // Eğer weather-card yoksa, genel yükseklik ayarını çağır (forecast'ı temizler)
}

document.addEventListener('DOMContentLoaded', () => {
    cityInput.focus();
     // Başlangıçta API anahtarı kontrolü
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
        showError('Lütfen script.js dosyasında geçerli bir OpenWeatherMap API anahtarı tanımlayın.');
        setButtonsDisabled(true); // Anahtar yoksa butonları devre dışı bırak
    }
});
# 🌤️ Modern Hava Durumu Uygulaması

Bu proje, kullanıcının girdiği şehir veya mevcut konumu için anlık hava durumu bilgilerini ve sonraki 3 günlük hava tahminlerini gösteren modern bir web uygulamasıdır. OpenWeatherMap API kullanılarak geliştirilmiştir.


## ✨ Özellikler

*   Şehir adına göre hava durumu arama
*   Kullanıcının coğrafi konumunu kullanarak hava durumu alma
*   Anlık hava durumu bilgileri:
    *   Sıcaklık, hissedilen sıcaklık
    *   Hava durumu açıklaması ve ikonu
    *   Nem, basınç, rüzgar hızı
    *   Gün doğumu ve gün batımı saatleri (mevcutsa)
    *   Günlük min/maks sıcaklık
*   Sonraki 3 gün için hava tahmini:
    *   Gün adı ve tarih
    *   Hava durumu ikonu
    *   Maksimum ve minimum sıcaklıklar
    *   Hava durumu açıklaması
*   Duyarlı (Responsive) tasarım
*   Yükleme ve hata durumları için kullanıcı dostu bildirimler
*   Modern ve çekici arayüz

## 🛠️ Kullanılan Teknolojiler

*   HTML5
*   CSS3 (Flexbox, Grid, Özel Özellikler, Geçişler)
*   JavaScript (ES6+ Asenkron Fonksiyonlar, Fetch API, Geolocation API)
*   [OpenWeatherMap API](https://openweathermap.org/api)

## 🚀 Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICIADINIZ/PROJEADINIZ.git
    cd PROJEADINIZ
    ```
    *(`KULLANICIADINIZ/PROJEADINIZ` kısmını kendi GitHub kullanıcı adınız ve depo adınızla değiştirin.)*

2.  **OpenWeatherMap API Anahtarı Alın:**
    *   [OpenWeatherMap web sitesine](https://openweathermap.org/appid) gidin ve ücretsiz bir hesap oluşturun.
    *   API anahtarınızı (API key) edinin. "Current Weather Data" ve "5 day / 3 hour forecast" API'lerinin bulunduğu planlar genellikle ücretsizdir.

3.  **API Anahtarını Yapılandırın:**
    *   Proje klasöründeki `script.js` dosyasını açın.
    *   Dosyanın başındaki `API_KEY` değişkenini kendi OpenWeatherMap API anahtarınızla güncelleyin:
        ```javascript
        const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // BURAYA KENDİ OpenWeatherMap API ANAHTARINIZI GİRİN
        // Örneğin: const API_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        ```

4.  **Uygulamayı Çalıştırın:**
    *   `index.html` dosyasını web tarayıcınızda açın.

## ⚙️ Nasıl Kullanılır

*   **Şehir Arama:** Arama kutusuna bir şehir adı yazın ve "Ara" düğmesine tıklayın veya Enter tuşuna basın.
*   **Konum Kullanma:** "Konum" düğmesine tıklayın. Tarayıcınız konum izni isterse, izin verin.
*   Hava durumu bilgileri ve tahminler ekranda görünecektir.

## 📂 Dosya Yapısı

# 🌾 TarpoVizyon AI

Tarım ve hayvancılık ala## 🚀 Kurulum

### Yerel Geliştirme
1. Projeyi klonlayın
2. Terminal'de: `python3 -m http.server 8000`
3. Tarayıcıda: `http://localhost:8000/tarpovizyon.html`
4. API çağrıları başarısız olacak (proxy yerel olarak çalışmaz)

### Netlify Deployment (Önerilen)
1. GitHub'a push edin
2. Netlify'da yeni site oluşturun
3. GitHub repository'nizi bağlayın
4. Site ayarlarından Environment Variables kısmına `GEMINI_API_KEY` ekleyin
5. Deploy edin (frontend `/api/gemini/chat` üzerinden Netlify Function'a istek atar)

### ⚠️ Önemli: Model İsimleri Güncellendi
- ✅ `gemini-2.5-pro` (En zeki model - kompleks analiz)
- ✅ `gemini-2.5-flash` (Hızlı ve çok yönlü - orta karmaşıklık)  
- ✅ `gemini-2.0-flash` (Hızlı yanıt - basit sorular)
- ✅ `gemini-2.5-flash-lite` (En hızlı ve ekonomik - yedek)
- ✅ `gemini-1.5-pro` (Eski nesil Pro - son çare)
- ✅ `gemini-1.5-flash` (Eski nesil Flash - en son yedek)
- ❌ Mistral API kaldırıldı, Gemini API kullanılıyor

## 🧠 Akıllı Model Seçimi
- **Kompleks Sorular**: Analiz, karşılaştırma, tablo → Gemini 2.5 Pro/Flash
- **Orta Karmaşıklık**: Nasıl, neden, ne zaman → 2.5 Flash, 2.0 Flash
- **Basit Sorular**: Merhaba, kısa sorular → 2.0 Flash ve sonrası
- **Rate Limit**: Otomatik model değiştirme ve yedek sistem

## 🔧 Konfigürasyon

### API Anahtarları
- Client tarafında API anahtarı tutulmaz. Netlify Function proxy kullanılır.
- Netlify Dashboard > Site Settings > Environment > Variables:
  - `GEMINI_API_KEY`: Google AI Studio'dan aldığınız key
- **Önemli**: API key'iniz [aistudio.google.com](https://aistudio.google.com/app/apikey)'dan alınmış ve geçerli olmalıpay zeka asistanı.

## 🚀 Özellikler

### 🤖 AI Asistanı
- **Tarım Uzmanlığı**: Bitkisel üretim, hastalık mücadelesi, sürdürülebilir tarım
- **Hayvancılık**: Beslenme, hastalıklar, verim artırma, mera yönetimi
- **Yaratıcı Mod**: Herhangi bir konuda detaylı bilgi ve profesyonel yanıtlar
- **Çoklu Model Desteği**: 3 farklı Gemini modeli ile yüksek başarı oranı

### 🎤 Sesli Asistan
- **Sesli Komutlar**: Mikrofon ile kolay kullanım
- **ElevenLabs Entegrasyonu**: Doğal ve kaliteli ses
- **Özel Ses Profilleri**: Kişiselleştirilmiş ses ayarları
- **Türkçe Ses Tanıma**: Yerel dil desteği

### 📊 Admin Paneli
- **Sohbet Kayıtları**: Tüm konuşmaların detaylı kaydı
- **Analitik Grafikler**: Kullanım istatistikleri ve trendler
- **Ses Yönetimi**: Ses profilleri ve ayarları
- **Sistem Durumu**: API durumu ve performans metrikleri

## 🛠️ Teknolojiler

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Tailwind CSS
- **AI API**: Google Gemini AI (3 farklı model)
- **Ses API**: Web Speech API, ElevenLabs TTS
- **Grafikler**: Chart.js
- **Deployment**: Netlify

## 📁 Dosya Yapısı

```
tarpovizyon/
├── index.html          # Ana sayfa (landing page)
├── tarpovizyon.html    # AI chat arayüzü  
├── admin.html          # Admin paneli
├── mobile.html         # Mobil optimize versiyonu
├── netlify.toml        # Netlify konfigürasyonu
└── README.md           # Proje dokümantasyonu
```

## 🚀 Kurulum

### Yerel Geliştirme
1. Projeyi klonlayın
2. `index.html` dosyasını tarayıcıda açın
3. AI asistanını kullanmaya başlayın

### Netlify Deployment (Önerilen)
1. GitHub'a push edin
2. Netlify'da yeni site oluşturun
3. GitHub repository'nizi bağlayın
4. Site ayarlarından Environment Variables kısmına `MISTRAL_API_KEY` ekleyin
5. Deploy edin (frontend `/api/mistral/chat` üzerinden Netlify Function'a istek atar)

## 🔧 Konfigürasyon

### API Anahtarları
- Client tarafında API anahtarı tutulmaz. Netlify Function proxy kullanılır.
- Netlify Dashboard > Site Settings > Environment > Variables:
	- `MISTRAL_API_KEY`: Mistral Console'dan aldığınız key
- **ElevenLabs API**: Admin panelinden ayarlanabilir

### Ses Ayarları
- **Konuşma Hızı**: 0.5x - 2.0x
- **Ses Tonu**: 0.5 - 2.0
- **Ses Seviyesi**: 0.0 - 1.0
- **Özel Ses Profilleri**: MP3/WAV dosya yükleme

## 📱 Kullanım

### AI Asistanı
1. Ana sayfadan "AI Asistanına Başla" butonuna tıklayın
2. Sorunuzu yazın veya sesli komut verin
3. AI'dan detaylı yanıt alın
4. Yaratıcı mod için "yaratıcı moda geç" yazın

### Admin Paneli
1. `admin.html` sayfasına gidin
2. Sohbet kayıtlarını görüntüleyin
3. Analitik grafikleri inceleyin
4. Ses ayarlarını yapılandırın

## 🎯 Özellik Detayları

### Yaratıcı Mod
- Tarım/hayvancılık sınırı yok
- Herhangi bir konuda uzman yanıtlar
- Profesyonel ve kaliteli açıklamalar
- Bilimsel ve teknik detaylar

### Sesli Asistan
- Türkçe ses tanıma
- Doğal ses sentezi
- Özel ses profilleri
- ElevenLabs entegrasyonu

### Admin Paneli
- Gerçek zamanlı istatistikler
- Sohbet geçmişi
- Model performans analizi
- Ses yönetimi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje Veteriner Hekim Öner Özbey tarafından geliştirilmiştir.

## 📞 İletişim

- **Geliştirici**: Veteriner Hekim Öner Özbey
- **Proje**: TarpoVizyon AI
- **Alan**: Tarım ve Hayvancılık AI Asistanı

---

🌾 **TarpoVizyon AI** - Tarım ve hayvancılığın geleceği için yapay zeka 
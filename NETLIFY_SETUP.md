# 🚀 TarpoVizyon AI - Netlify Deployment Rehberi

## 📋 Hızlı Kurulum

### 1. Site Bağlantısı
- Netlify Dashboard: https://app.netlify.com/projects/tarpovizyonai/overview
- GitHub Repository: https://github.com/veteroner/tarpovizyon

### 2. Environment Variables Ayarlama

Netlify Dashboard > Site Settings > Environment Variables bölümüne gidin ve şu değişkenleri ekleyin:

```
GEMINI_API_KEY = your_gemini_api_key_here
HUGGING_FACE_API_KEY = your_hugging_face_api_key_here
```

#### API Anahtarları Nasıl Alınır:

**Gemini API Key:**
1. https://aistudio.google.com/app/apikey adresine gidin
2. "Create API Key" butonuna tıklayın
3. Anahtarı kopyalayın

**Hugging Face API Key:**
1. https://huggingface.co/settings/tokens adresine gidin
2. "New token" oluşturun
3. "Read" yetkisi verin
4. Anahtarı kopyalayın

### 3. Deploy Ayarları

**Build Settings:**
- Build command: (boş bırakın)
- Publish directory: `.` (root dizin)
- Functions directory: `netlify/functions`

### 4. Domain Ayarları

**Önerilen Domain:**
- tarpovizyonai.netlify.app
- Veya kendi domain'inizi bağlayabilirsiniz

### 5. Test Edilecek Özellikler

✅ Ana sayfa (`tarpovizyon.html`)
✅ AI Chat fonksiyonu
✅ Sesli asistan (TTS)
✅ Admin paneli (`admin.html`)
✅ Mobil versiyon (`mobile.html`)

## 🔧 Sorun Giderme

### Yaygın Sorunlar:

**1. API Key Hataları:**
```
Error: GEMINI_API_KEY environment variable is required
```
Çözüm: Environment Variables'ı kontrol edin.

**2. Function Hataları:**
```
Function not found
```
Çözüm: Deploy'ı yeniden tetikleyin.

**3. CORS Hataları:**
```
Access-Control-Allow-Origin
```
Çözüm: netlify.toml dosyası doğru yapılandırılmış.

### Logs Kontrol Etme:
1. Netlify Dashboard > Functions > View logs
2. Site Dashboard > Deploys > Deploy log

## 📊 Özellikler

### AI Modelleri:
- ✅ Gemini 2.5 Pro (kompleks sorular)
- ✅ Gemini 2.5 Flash (hızlı yanıtlar)
- ✅ Gemini 2.0 Flash (basit sorular)
- ✅ Otomatik model değiştirme

### Sesli Özellikler:
- ✅ Türkçe ses tanıma
- ✅ ElevenLabs TTS entegrasyonu
- ✅ Özel ses profilleri

### Admin Paneli:
- ✅ Sohbet kayıtları
- ✅ Analitik grafikler
- ✅ Sistem durumu

## 🌐 URL'ler

- **Ana Site:** https://tarpovizyonai.netlify.app/
- **AI Chat:** https://tarpovizyonai.netlify.app/tarpovizyon.html
- **Admin Panel:** https://tarpovizyonai.netlify.app/admin.html
- **Mobil:** https://tarpovizyonai.netlify.app/mobile.html

## 🔒 Güvenlik

- ✅ API anahtarları server-side
- ✅ CORS koruması aktif
- ✅ XSS koruması
- ✅ Content-Type koruması

---

**Geliştirici:** Veteriner Hekim Öner Özbey  
**Proje:** TarpoVizyon AI  
**Tarih:** Eylül 2025

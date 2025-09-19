# TarpoVizyon AI - Deployment Guide

## 🚀 Hızlı Deployment (Netlify)

### 1. API Key Hazırlık
1. [console.mistral.ai](https://console.mistral.ai/api-keys) adresine gidin
2. Yeni API key oluşturun (ödeme planınız olduğundan emin olun)
3. API key'i kopyalayın

### 2. Netlify Deployment
1. Bu projeyi GitHub'a push edin
2. [netlify.com](https://netlify.com) → "New site from Git"
3. GitHub repository'nizi seçin
4. **Site Settings** → **Environment Variables**:
   ```
   MISTRAL_API_KEY = your_real_api_key_here
   ```
5. **Deploy** butonuna tıklayın

### 3. Test
- Siteniz deploy olduktan sonra AI chat'i test edin
- Console'da hata varsa API key'i kontrol edin

## 🔧 Teknik Detaylar

### Dosya Yapısı
```
├── netlify.toml                    # Netlify config
├── netlify/functions/
│   └── mistral-proxy.js           # API proxy function
├── tarpovizyon.html               # Ana chat arayüzü
├── admin.html                     # Admin paneli
└── index.html                     # Landing page
```

### API Proxy Çalışma Şekli
1. Frontend → `/api/mistral/chat` (POST)
2. Netlify redirect → `/.netlify/functions/mistral-proxy`
3. Function → `https://api.mistral.ai/v1/chat/completions`
4. Response ← Client

### Güvenlik
- ✅ API key server-side'da tutulur
- ✅ CORS aktif
- ✅ Rate limiting handled
- ✅ Error handling

## 📊 Mevcut Modeller (2025)
- `mistral-medium-latest` (Ana model)
- `mistral-small-latest` (Yedek)  
- `ministral-8b-latest` (Edge)

## 🐛 Sorun Giderme

### 401 Unauthorized
- API key eksik/geçersiz
- Netlify environment variable kontrol edin

### 429 Too Many Requests  
- Rate limit aşıldı
- Retry mekanizması otomatik çalışır

### 500 Server Error
- API key environment variable eksik
- Function logs kontrol edin

## 📞 İletişim
Sorun olursa: API key'inizi [console.mistral.ai](https://console.mistral.ai/usage) üzerinden kontrol edin.

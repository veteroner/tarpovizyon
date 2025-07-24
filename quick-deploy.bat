@echo off
echo Hızlı Deploy - TarpoVizyon AI
echo ==============================

:: Gereksiz dosyaları temizle
if exist sw.js del sw.js
if exist manifest.json del manifest.json

:: Git işlemleri
git add .
git commit -m "Site güncellendi - %date% %time:~0,5%"

:: Remote varsa push yap (main branch kullan)
git remote -v | findstr origin >nul
if not errorlevel 1 (
    git push origin main
    echo ✅ Netlify otomatik deploy edecek!
    echo 🌐 Site: https://tarpovizyon.netlify.app
) else (
    echo ⚠️  Remote repository yok!
    echo 📦 Manuel deploy için netlify drop kullanın:
    start https://app.netlify.com/drop
)

timeout /t 3 >nul

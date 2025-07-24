@echo off
echo ====================================
echo TarpoVizyon AI - Netlify Deploy
echo ====================================
echo.

:: Değişiklikleri kontrol et
echo [1/5] Git durumu kontrol ediliyor...
git status
echo.

:: Değişiklikleri staging area'ya ekle
echo [2/5] Değişiklikler staging area'ya ekleniyor...
git add .
echo.

:: Commit mesajı al
set /p commit_message="Commit mesajını girin (Enter = varsayılan): "
if "%commit_message%"=="" set commit_message=Mobil tasarım güncellemesi

:: Commit yap
echo [3/5] Değişiklikler commit ediliyor...
git commit -m "%commit_message%"
echo.

:: Remote repository olup olmadığını kontrol et
echo [4/5] Remote repository kontrol ediliyor...
git remote -v

:: Eğer remote yoksa sadece local commit, varsa push yap
for /f %%i in ('git remote') do set has_remote=%%i
if defined has_remote (
    echo Remote repository bulundu, push yapılıyor...
    git push origin master
    if errorlevel 1 (
        echo Git push başarısız oldu, manuel deploy yapın.
        goto manual_deploy
    )
    echo Git push başarılı!
) else (
    echo Remote repository bulunamadı, manuel deploy gerekiyor.
    goto manual_deploy
)

echo.
echo [5/5] Deploy tamamlandı!
echo Netlify otomatik olarak yeni değişiklikleri deploy edecek.
echo Site URL: https://tarpovizyon.netlify.app
goto end

:manual_deploy
echo.
echo [5/5] Manuel deploy seçenekleri:
echo.
echo A) Netlify CLI kullan (önerilen):
echo    npm install -g netlify-cli
echo    netlify login
echo    netlify deploy --prod --dir .
echo.
echo B) Netlify Dashboard kullan:
echo    1. https://app.netlify.com sitesine gidin
echo    2. Sites sekmesinde sitenizi bulun
echo    3. "Deploy manually" seçeneğini kullanın
echo    4. Bu klasörü zip olarak yükleyin
echo.
echo C) GitHub bağlantısı kur:
echo    git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
echo    git push -u origin master
echo.

:end
echo.
echo Deploy işlemi tamamlandı!
echo Tarayıcınızı açıp sitenizi kontrol edebilirsiniz.
echo.
pause

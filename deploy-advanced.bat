@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════╗
echo ║        TarpoVizyon AI Deploy Tool      ║
echo ╚════════════════════════════════════════╝
echo.

:: Renkli çıktı için
set "green=[92m"
set "red=[91m"
set "yellow=[93m"
set "blue=[94m"
set "reset=[0m"

:: Başlangıç zamanı
set start_time=%time%

:: Dosya kontrolü
echo %blue%[INFO]%reset% Proje dosyaları kontrol ediliyor...
if not exist "index.html" (
    echo %red%[ERROR]%reset% index.html dosyası bulunamadı!
    goto error_exit
)
if not exist "ai-nova.html" (
    echo %red%[ERROR]%reset% ai-nova.html dosyası bulunamadı!
    goto error_exit
)
echo %green%[OK]%reset% Tüm gerekli dosyalar mevcut.
echo.

:: Git durumu kontrol
echo %blue%[INFO]%reset% Git repository durumu...
git status --porcelain > temp_git_status.txt
set /a file_count=0
for /f %%a in (temp_git_status.txt) do set /a file_count+=1
del temp_git_status.txt

if %file_count% equ 0 (
    echo %yellow%[WARNING]%reset% Hiç değişiklik bulunamadı.
    set /p continue="Yine de deploy etmek istiyor musunuz? (y/N): "
    if /i not "!continue!"=="y" goto end
) else (
    echo %green%[OK]%reset% %file_count% değişiklik bulundu.
)

:: Build öncesi temizlik
echo.
echo %blue%[INFO]%reset% Gereksiz dosyalar temizleniyor...
if exist "sw.js" (
    echo %yellow%[CLEAN]%reset% sw.js dosyası siliniyor...
    del "sw.js"
)
if exist "manifest.json" (
    echo %yellow%[CLEAN]%reset% manifest.json dosyası siliniyor...
    del "manifest.json"
)

:: Dosya boyutları kontrol
echo.
echo %blue%[INFO]%reset% Dosya boyutları:
for %%f in (*.html) do (
    set size=%%~zf
    set /a size_kb=!size!/1024
    if !size_kb! gtr 1000 (
        echo %yellow%[WARNING]%reset% %%f - !size_kb! KB ^(büyük dosya^)
    ) else (
        echo %green%[OK]%reset% %%f - !size_kb! KB
    )
)

:: Commit işlemi
echo.
echo %blue%[INFO]%reset% Git commit işlemi...
git add .

:: Commit mesajı seçenekleri
echo.
echo Commit mesajı seçin:
echo 1. Mobil tasarım güncellemesi
echo 2. Bug fix ve iyileştirmeler  
echo 3. Yeni özellik eklendi
echo 4. Performance optimizasyonu
echo 5. Özel mesaj gir
echo.
set /p choice="Seçiminiz (1-5): "

if "%choice%"=="1" set commit_msg=Mobil tasarım güncellemesi - ChatGPT benzeri interface
if "%choice%"=="2" set commit_msg=Bug fix ve iyileştirmeler
if "%choice%"=="3" set commit_msg=Yeni özellik eklendi
if "%choice%"=="4" set commit_msg=Performance optimizasyonu
if "%choice%"=="5" (
    set /p commit_msg="Commit mesajınızı girin: "
)
if not defined commit_msg set commit_msg=Site güncellemesi

git commit -m "%commit_msg% - %date% %time:~0,5%"
if errorlevel 1 (
    echo %red%[ERROR]%reset% Git commit başarısız!
    goto error_exit
)

:: Remote kontrol ve push
echo.
echo %blue%[INFO]%reset% Remote repository kontrol ediliyor...
git remote -v | findstr origin >nul
if errorlevel 1 (
    echo %yellow%[WARNING]%reset% Remote repository bulunamadı.
    goto manual_deploy_options
) else (
    echo %green%[OK]%reset% Remote repository bulundu.
    echo %blue%[INFO]%reset% Değişiklikler push ediliyor...
    git push origin master
    if errorlevel 1 (
        echo %red%[ERROR]%reset% Git push başarısız!
        goto manual_deploy_options
    )
    echo %green%[SUCCESS]%reset% Git push başarılı!
    goto deploy_success
)

:manual_deploy_options
echo.
echo %yellow%[MANUAL DEPLOY]%reset% Manuel deploy seçenekleri:
echo.
echo 1. Netlify CLI ile deploy
echo 2. Netlify Drop ile deploy  
echo 3. GitHub repository bağla
echo 4. Zip dosyası oluştur
echo.
set /p deploy_choice="Seçiminiz (1-4): "

if "%deploy_choice%"=="1" goto netlify_cli
if "%deploy_choice%"=="2" goto netlify_drop  
if "%deploy_choice%"=="3" goto github_setup
if "%deploy_choice%"=="4" goto create_zip

:netlify_cli
echo.
echo %blue%[NETLIFY CLI]%reset% Netlify CLI kurulumu ve deploy...
where netlify >nul 2>&1
if errorlevel 1 (
    echo %yellow%[INFO]%reset% Netlify CLI kuruluyor...
    npm install -g netlify-cli
)
echo %blue%[INFO]%reset% Netlify'a giriş yapın...
netlify login
echo %blue%[INFO]%reset% Deploy başlatılıyor...
netlify deploy --prod --dir .
goto deploy_success

:netlify_drop
echo.
echo %blue%[NETLIFY DROP]%reset% Manuel yükleme için talimatlar:
echo.
echo 1. Şu adrese gidin: https://app.netlify.com/drop
echo 2. Bu klasörü tarayıcıya sürükleyin: %cd%
echo 3. Site linkini kopyalayın
echo.
start https://app.netlify.com/drop
goto end

:github_setup
echo.
echo %blue%[GITHUB SETUP]%reset% GitHub repository setup...
echo.
set /p github_url="GitHub repository URL'sini girin: "
git remote add origin %github_url%
git push -u origin master
if errorlevel 1 (
    echo %red%[ERROR]%reset% GitHub push başarısız!
    goto error_exit
)
echo %green%[SUCCESS]%reset% GitHub'a push edildi!
echo %blue%[INFO]%reset% Şimdi Netlify'da GitHub repository'yi bağlayın.
start https://app.netlify.com/start
goto end

:create_zip
echo.
echo %blue%[ZIP CREATE]%reset% Deploy paketi oluşturuluyor...
set zip_name=tarpovizyon-deploy-%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%.zip
powershell -command "Compress-Archive -Path '*.html','*.toml','_headers','*.png' -DestinationPath '%zip_name%' -Force"
echo %green%[SUCCESS]%reset% Deploy paketi oluşturuldu: %zip_name%
echo %blue%[INFO]%reset% Bu dosyayı Netlify'da manuel olarak yükleyebilirsiniz.
goto end

:deploy_success
echo.
echo %green%╔════════════════════════════════════════╗%reset%
echo %green%║            DEPLOY BAŞARILI!            ║%reset%
echo %green%╚════════════════════════════════════════╝%reset%
echo.
echo %blue%[INFO]%reset% Site URL'leri:
echo • Ana site: https://tarpovizyon.netlify.app
echo • Custom domain: https://www.tarpovizyon.com (eğer ayarlandıysa)
echo.
echo %blue%[INFO]%reset% Deploy süresi: %start_time% - %time%
echo.
set /p open_site="Siteyi tarayıcıda açmak istiyor musunuz? (Y/n): "
if /i not "%open_site%"=="n" start https://tarpovizyon.netlify.app
goto end

:error_exit
echo.
echo %red%╔════════════════════════════════════════╗%reset%
echo %red%║               HATA OLUŞTU!             ║%reset%
echo %red%╚════════════════════════════════════════╝%reset%
echo.
echo %yellow%[HELP]%reset% Sorun giderme önerileri:
echo • Git konfigürasyonunu kontrol edin: git config --list
echo • Network bağlantınızı kontrol edin  
echo • GitHub/Netlify erişim izinlerinizi kontrol edin
echo • Admin olarak çalıştırmayı deneyin
echo.
goto end

:end
echo.
echo %blue%[INFO]%reset% Deploy scripti tamamlandı.
echo.
pause

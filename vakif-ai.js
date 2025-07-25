// Vakıf AI Yanıt Sistemi
class VakifAI {
  constructor() {
    this.vakifData = null;
    this.loadVakifData();
  }

  // Vakıf verilerini yükle
  async loadVakifData() {
    try {
      const response = await fetch('vakif-data.json');
      this.vakifData = await response.json();
    } catch (error) {
      console.log('Vakıf verileri yüklenemedi, varsayılan veriler kullanılıyor');
      this.vakifData = this.getDefaultData();
    }
  }

  // Varsayılan vakıf verileri
  getDefaultData() {
    return {
      vakif_bilgileri: {
        adi: "Tarım ve Hayvancılık Vakfı",
        kurulus_tarihi: "2020",
        misyon: "Sürdürülebilir tarım ve hayvancılık için yenilikçi çözümler geliştirmek",
        vizyon: "Türkiye'nin önde gelen tarım teknolojileri vakfı olmak"
      },
      yonetim: {
        kurucu: "Dr. Mehmet Mehdi Eker",
        baskan: "Veteriner Hekim Öner Özbey"
      },
      iletisim: {
        adres: "Ankara, Türkiye",
        telefon: "+90 xxx xxx xx xx",
        email: "info@tarpovizyon.org"
      }
    };
  }

  // Vakıf sorularını yanıtla
  getVakifResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Vakıf hakkında sorular
    if (message.includes('vakıf') || message.includes('vakif')) {
      if (message.includes('nedir') || message.includes('ne')) {
        return `🌾 **${this.vakifData.vakif_bilgileri.adi}**\n\n${this.vakifData.vakif_bilgileri.misyon}\n\n**Kuruluş:** ${this.vakifData.vakif_bilgileri.kurulus_tarihi}\n**Vizyon:** ${this.vakifData.vakif_bilgileri.vizyon}`;
      }
      
      if (message.includes('misyon') || message.includes('amac')) {
        return `🎯 **Vakfımızın Misyonu:**\n\n${this.vakifData.vakif_bilgileri.misyon}\n\nDeğerlerimiz:\n${this.vakifData.vakif_bilgileri.degerler.map(deger => `• ${deger}`).join('\n')}`;
      }
      
      if (message.includes('vizyon')) {
        return `🔮 **Vakfımızın Vizyonu:**\n\n${this.vakifData.vakif_bilgileri.vizyon}`;
      }
    }

    // Yönetim hakkında sorular
    if (message.includes('kurucu') || message.includes('kim kurdu')) {
      return `👨‍💼 **Vakfımızın Kurucusu:**\n\n**${this.vakifData.yonetim.kurucu}**\n\nVeteriner Hekim ve Tarım Ekonomisti olan kendisi, Ankara Üniversitesi Veteriner Fakültesi mezunu olup Aberdeen Üniversitesi'nde yüksek lisans yapmıştır.`;
    }
    
    if (message.includes('başkan') || message.includes('baskan') || message.includes('yönetim')) {
      return `👨‍💼 **Vakfımızın Başkanı:**\n\n**${this.vakifData.yonetim.baskan}**\n\nFırat Üniversitesi Veteriner Fakültesi mezunu olup, tarım ve yapay zeka entegrasyonu konusunda sektörde çığır açan çalışmalara imza atmıştır.`;
    }

    // Faaliyetler hakkında sorular
    if (message.includes('faaliyet') || message.includes('ne yapıyor') || message.includes('proje')) {
      return `🚀 **Vakfımızın Faaliyetleri:**\n\n**Eğitim Programları:**\n${this.vakifData.faaliyet_alanlari.egitim.map(item => `• ${item}`).join('\n')}\n\n**Araştırma Projeleri:**\n${this.vakifData.faaliyet_alanlari.arastirma.map(item => `• ${item}`).join('\n')}\n\n**Aktif Projeler:**\n${this.vakifData.faaliyet_alanlari.projeler.map(item => `• ${item}`).join('\n')}`;
    }

    // İletişim bilgileri
    if (message.includes('iletişim') || message.includes('adres') || message.includes('telefon') || message.includes('email')) {
      return `📞 **İletişim Bilgileri:**\n\n**Adres:** ${this.vakifData.iletisim.adres}\n**Telefon:** ${this.vakifData.iletisim.telefon}\n**E-posta:** ${this.vakifData.iletisim.email}\n**Website:** ${this.vakifData.iletisim.website}`;
    }

    // İstatistikler
    if (message.includes('istatistik') || message.includes('sayı') || message.includes('kaç')) {
      return `📊 **Vakfımızın İstatistikleri:**\n\n**Eğitilen Çiftçi:** ${this.vakifData.istatistikler.egitilen_ciftci} kişi\n**Tamamlanan Proje:** ${this.vakifData.istatistikler.tamamlanan_proje} adet\n**Çalışan Sayısı:** ${this.vakifData.istatistikler.calisan_sayisi} kişi\n**Yıllık Bütçe:** ${this.vakifData.istatistikler.yillik_butce}`;
    }

    // Güncel projeler
    if (message.includes('güncel') || message.includes('aktif') || message.includes('devam eden')) {
      let response = `🔄 **Güncel Projelerimiz:**\n\n`;
      this.vakifData.guncel_projeler.forEach(proje => {
        response += `**${proje.adi}**\n${proje.aciklama}\nDurum: ${proje.durum}\n\n`;
      });
      return response;
    }

    // Genel vakıf bilgisi
    if (message.includes('hakkında') || message.includes('bilgi')) {
      return `🌾 **${this.vakifData.vakif_bilgileri.adi} Hakkında:**\n\n**Misyon:** ${this.vakifData.vakif_bilgileri.misyon}\n**Vizyon:** ${this.vakifData.vakif_bilgileri.vizyon}\n**Kuruluş:** ${this.vakifData.vakif_bilgileri.kurulus_tarihi}\n**Başkan:** ${this.vakifData.yonetim.baskan}\n\nDaha detaylı bilgi için "faaliyetler", "projeler" veya "iletişim" sorabilirsiniz.`;
    }

    return null; // Vakıf ile ilgili değilse null döndür
  }

  // Ana AI yanıt fonksiyonu
  async getAIResponse(userMessage) {
    // Önce vakıf yanıtını kontrol et
    const vakifResponse = this.getVakifResponse(userMessage);
    if (vakifResponse) {
      return vakifResponse;
    }

    // Vakıf ile ilgili değilse normal AI yanıtına geç
    return await this.getNormalAIResponse(userMessage);
  }

  // Normal AI yanıtı (mevcut sistem)
  async getNormalAIResponse(userMessage) {
    // Mevcut AI yanıt sistemi buraya gelecek
    return "Bu konuda size yardımcı olabilirim. Vakıf hakkında bilgi almak isterseniz 'vakıf nedir', 'faaliyetler', 'projeler' gibi sorular sorabilirsiniz.";
  }
}

// Global vakıf AI instance'ı
window.vakifAI = new VakifAI(); 
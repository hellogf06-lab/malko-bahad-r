# Hukuk Bürosu Mali Takip

Kısa açıklama ve Vercel deploy adımları.

Önerilen deploy yollar (en mantıklı):

- A) GitHub + Vercel (kalıcı, güvenilir)
  1. Yerelde hazırladığım commit'i GitHub'a push edin veya yeni bir repo oluşturarak aşağıyı çalıştırın:

```bash
git remote add origin git@github.com:<kullanici>/<repo>.git
git branch -M main
git push -u origin main
```

  2. Vercel'e gidin (https://vercel.com), yeni proje oluşturun ve GitHub repo'yu import edin. Vercel otomatik olarak `npm run build` kullanır ve siteyi yayınlar.

- B) Doğrudan Vercel CLI (hesap gerektirir)

```bash
npm i -g vercel
vercel login
cd /path/to/project
vercel --prod
```

Notlar:
- Proje bir Create React App uygulamasıdır; Vercel varsayılan olarak `npm run build` ile deploy eder.
- Eğer isterseniz benim yerelde oluşturduğum commit'i GitHub'a push etmem için bir uzaktan repo URL'si veya erişim bilgisi sağlayabilirsiniz.

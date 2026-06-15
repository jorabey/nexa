# Nexa — Ilovalar markazi (Frontend)

React + Vite bilan yozilgan to'liq frontend. Server bilan `/api/v1` orqali bog'lanadi.

## Texnologiyalar

- **React 18** + **React Router v6**
- **Vite 5** (bundler)
- **Vanilla CSS** (no frameworks — custom design system with CSS variables)
- **Fetch API** (no axios)

## Papka tuzilmasi

```
src/
  api/          # Server bilan muloqot (auth, user, apps, connections)
  components/
    common/     # Button, Field, Sheet, AppCard, Icons, OrbitMark
    context-menu/ # Right-click / long-press context menu
    layout/     # AppShell, NavBar, TopBar, PageHeader
    modals/     # Connect, Disconnect, Block, Report modals
  context/      # AuthContext, LangContext, ToastContext
  hooks/        # useContextTrigger (long-press + right-click)
  pages/
    Auth/       # Login, Register, Verify, ForgotPassword, ResetPassword
    Apps/       # AppsPage, AppDetailPage, WebViewPage
    Profile/    # ProfilePage + barcha sub-pages
  styles/       # Global tokens, fonts, toast
  utils/        # i18n (uz/ru/en)
```

## O'rnatish

```bash
npm install
```

## Sozlash

`.env.example` ni `.env.local` ga nusxalang va to'ldiring:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Ishga tushirish

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Sahifalar (Routes)

| Route | Tavsif |
|---|---|
| `/login` | Kirish (email/username + parol) |
| `/register` | Ro'yxatdan o'tish |
| `/verify` | Email OTP tasdiqlash |
| `/forgot-password` | Parolni tiklash |
| `/reset-password` | Yangi parol o'rnatish |
| `/apps` | Ilovalar katalogi (qidiruv, filter, infinite scroll) |
| `/:username` | Ilova haqida sahifa |
| `/run/:username` | WebView (sandboxed iframe) |
| `/profile` | Profil bosh sahifasi |
| `/profile-edit` | Profilni tahrirlash |
| `/sessions` | Faol sessiyalar |
| `/app-connections` | Ulangan ilovalar |
| `/security` | Xavfsizlik sozlamalari |
| `/language` | Til tanlash (uz/ru/en) |
| `/app-info` | Ilova haqida / versiya |

## Backend endpoint eslatmalari

Quyidagi endpointlar server kodida hali yo'q — frontendda UI/UX to'liq tayyor, server tomonida qo'shilishi kerak:

- `POST /api/v1/client/connections/block` — ilovani bloklash
- `POST /api/v1/client/connections/unblock` — blokdan chiqarish
- `POST /api/v1/client/connections/report` — hisobot yuborish
- `POST /api/v1/client/auth/reset-password` — parolni tiklash (OTP bilan)

## Dizayn tizimi

Design tokens: `src/styles/tokens.css`

| Token | Qiymat | Maqsad |
|---|---|---|
| `--accent` | `#C2F94E` | "Ulangan" holati, CTA |
| `--violet` | `#8B7CFF` | Interaktiv elementlar, focus |
| `--bg-0..3` | Qora skalasi | Surface hierarchy |
| `--danger` | `#FF6B6B` | Bloklash, xatolik |

**OrbitMark** — ilovaning imzo elementi: foydalanuvchi (markaziy nuqta) va ilova (aylanuvchi halqa) o'rtasidagi ulanishni ifodalaydi.

## Mobil app ko'rinishi

- `position: fixed` + `overflow: hidden` — brauzer scrollini to'sib qo'yadi
- `touch-action: none` HTML/body darajasida — zoom/rubber-band yo'q
- `overscroll-behavior-y: contain` — pull-to-refresh yo'q
- Safe area insets — iPhone notch/home indicator bilan mos
- Desktopda: chapdan rail navbar (84px) + kontent ustun — o'rnatilgan dastur ko'rinishi

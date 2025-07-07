import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Крон Мастер: Удобный онлайн генератор Cron-заданий',
    template: '%s | Крон Мастер',
  },
  description: 'Создавайте, анализируйте и управляйте cron-заданиями с помощью простого и интуитивно понятного онлайн-генератора. Крон Мастер помогает настроить расписание для автоматизации задач на вашем сервере. Подходит как для новичков, так и для опытных администраторов.',
  keywords: ['cron', 'crontab', 'генератор cron', 'планировщик задач', 'cron-задания', 'linux', 'unix', 'автоматизация', 'крон мастер', 'cron job generator', 'яндекс крон'],
  
  robots: {
    index: true,
    follow: true,
  },
    
  alternates: {
    canonical: '/',
  },
  
  openGraph: {
    title: 'Крон Мастер: Удобный онлайн генератор Cron-заданий',
    description: 'Простой и удобный генератор для создания и настройки cron-заданий.',
    url: '/',
    siteName: 'Крон Мастер',
    images: [
      {
        url: '/safari-pinned-tab.svg',
        width: 1200,
        height: 630,
        alt: 'Онлайн генератор Cron-заданий',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  icons: {
    icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/safari-pinned-tab.svg',
  },
  themeColor: '#F0F0F5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="yandex-verification" content="9a9949aab2947a94" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="mask-icon" href="/icon.svg" color="#663399" />
        <meta name="msapplication-TileColor" content="#663399" />
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103233022, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true
              });
            `,
          }}
        />
        {/* /Yandex.Metrika counter */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103233022" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}

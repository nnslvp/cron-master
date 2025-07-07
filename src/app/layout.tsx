import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cron-master.ru'),
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
  
  verification: {
    yandex: 'ВАШ_КОД_ВЕРИФИКАЦИИ_ЯНДЕКС',
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
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Онлайн генератор Cron-заданий',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

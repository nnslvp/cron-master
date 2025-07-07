"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CronGenerator from "@/components/cron/cron-generator";
import Examples from "@/components/cron/examples";
import Faq from "@/components/cron/faq";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Logo className="h-12 w-12 text-primary" />
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary">Крон Мастер</h1>
            <p className="text-muted-foreground mt-1">Простой и удобный генератор cron-заданий</p>
          </div>
        </div>
      </header>
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="generator">Генератор</TabsTrigger>
              <TabsTrigger value="examples">Примеры</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="generator" className="mt-6">
              <CronGenerator />
            </TabsContent>
            <TabsContent value="examples" className="mt-6">
              <Examples />
            </TabsContent>
            <TabsContent value="faq" className="mt-6">
              <Faq />
            </TabsContent>
          </Tabs>
        </div>
      </main>
       <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Крон Мастер. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

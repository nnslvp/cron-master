"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CronGenerator from "@/components/cron/cron-generator";
import Examples from "@/components/cron/examples";
import Faq from "@/components/cron/faq";
import { Logo } from "@/components/logo";

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 sm:px-6 lg:px-8" itemScope itemType="https://schema.org/SoftwareApplication">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Logo className="h-12 w-12 text-primary" />
          <div>
            <h1 itemProp="name" className="font-headline text-3xl sm:text-4xl font-bold text-primary">Крон Мастер</h1>
            <p itemProp="description" className="text-muted-foreground mt-1">Простой и удобный генератор cron-заданий</p>
             <div itemProp="offers" itemScope itemType="https://schema.org/Offer" style={{display: "none"}}>
                <meta itemProp="price" content="0" />
                <meta itemProp="priceCurrency" content="RUB" />
             </div>
          </div>
        </div>
      </header>
      <main className="pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </section>
      </main>
       <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto">
          {currentYear && <p>&copy; {currentYear} Крон Мастер. Все права защищены.</p>}
        </div>
      </footer>
    </div>
  );
}

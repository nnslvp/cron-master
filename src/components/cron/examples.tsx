"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";

const examples = [
  {
    title: "Каждую минуту",
    cron: "* * * * *",
    description: "Эта задача будет выполняться каждую минуту, каждый час, каждый день. Используется для задач, требующих постоянного выполнения, например, мониторинга.",
    command: "/path/to/script.sh"
  },
  {
    title: "Каждые 5 минут",
    cron: "*/5 * * * *",
    description: "Задача выполняется каждые 5 минут. Удобно для частых, но не ежеминутных проверок, например, синхронизации данных.",
    command: "php /path/to/your/script.php"
  },
  {
    title: "Дважды в час",
    cron: "0,30 * * * *",
    description: "Выполняется в начале и в середине каждого часа (в 0 и 30 минут).",
    command: "curl -s https://example.com/api/heartbeat"
  },
  {
    title: "Каждый час в 15 минут",
    cron: "15 * * * *",
    description: "Задача запускается на 15-й минуте каждого часа.",
    command: "/usr/bin/some-utility"
  },
  {
    title: "Каждую ночь в 3:30",
    cron: "30 3 * * *",
    description: "Идеальное время для ежедневных задач обслуживания, таких как резервное копирование, когда сервер наименее загружен.",
    command: "backup-script.sh"
  },
  {
    title: "Каждое воскресенье в 4:00",
    cron: "0 4 * * 0",
    description: "Еженедельная задача, выполняемая в ночь с субботы на воскресенье. Подходит для генерации отчетов или полной очистки кеша.",
    command: "generate-weekly-report.js"
  },
  {
    title: "Каждый будний день в 9:00",
    cron: "0 9 * * 1-5",
    description: "Задача выполняется с понедельника по пятницу в 9 утра. Может использоваться для отправки утренних уведомлений или отчетов.",
    command: "send-daily-briefing.py"
  },
  {
    title: "Первого числа каждого месяца в полдень",
    cron: "0 12 1 * *",
    description: "Задача выполняется раз в месяц. Подходит для выставления счетов, архивации логов за прошлый месяц и т.д.",
    command: "monthly-billing.sh"
  },
];

export default function Examples() {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Скопировано!", description: "Команда скопирована в буфер обмена." });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Примеры Cron-заданий</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Здесь собраны популярные примеры cron-строк для различных задач. Используйте их как основу для своих собственных расписаний.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <div className="relative">
                <code className="block bg-secondary p-3 rounded-md text-sm font-mono break-all">
                  {example.cron} {example.command}
                </code>
                 <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleCopy(`${example.cron} ${example.command}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

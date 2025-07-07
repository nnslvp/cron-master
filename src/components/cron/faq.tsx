"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Что такое cron?",
    answer: "Cron — это планировщик задач в Unix-подобных операционных системах. Он позволяет автоматически выполнять скрипты, команды или программы в определенное время или с определенной периодичностью. Название 'cron' происходит от греческого слова 'chronos', что означает 'время'."
  },
  {
    question: "Как читать cron-строку?",
    answer: `
      <p>Cron-строка состоит из пяти полей, определяющих время выполнения, за которыми следует команда. Каждое поле разделено пробелом:</p>
      <pre class="bg-secondary p-3 rounded-md my-2 font-mono text-sm">* * * * * command_to_execute
┬ ┬ ┬ ┬ ┬
│ │ │ │ │
│ │ │ │ │
│ │ │ │ └───── день недели (0 - 7) (Воскресенье = 0 или 7)
│ │ │ └────────── месяц (1 - 12)
│ │ └─────────────── день месяца (1 - 31)
│ └──────────────────── час (0 - 23)
└───────────────────────── минута (0 - 59)</pre>
      <p>Специальные символы:</p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li><code>*</code> (звездочка): Означает "каждый". Например, <code>*</code> в поле часов означает "каждый час".</li>
        <li><code>,</code> (запятая): Позволяет перечислить несколько значений. Например, <code>1,15,30</code> в поле минут означает "в 1, 15 и 30 минут".</li>
        <li><code>-</code> (дефис): Задает диапазон. Например, <code>9-17</code> в поле часов означает "с 9 до 17 часов включительно".</li>
        <li><code>/</code> (косая черта): Задает шаг. Например, <code>*/15</code> в поле минут означает "каждые 15 минут".</li>
      </ul>
    `
  },
  {
    question: "Как добавить задачу в crontab?",
    answer: `
      <p>Для управления задачами cron используется команда <code>crontab</code>.</p>
      <ol class="list-decimal pl-5 mt-2 space-y-2">
        <li><strong>Открыть редактор crontab:</strong> Выполните в терминале команду <code>crontab -e</code>. Это откроет файл crontab текущего пользователя в текстовом редакторе по умолчанию (например, nano или vim).</li>
        <li><strong>Добавить новую задачу:</strong> Перейдите на новую строку и вставьте сгенерированную cron-строку (например, <code>0 2 * * * /path/to/backup.sh</code>).</li>
        <li><strong>Сохранить и выйти:</strong> Сохраните изменения и закройте редактор. Если все правильно, вы увидите сообщение вроде <code>crontab: installing new crontab</code>.</li>
        <li><strong>Просмотреть список задач:</strong> Чтобы убедиться, что ваша задача добавлена, используйте команду <code>crontab -l</code>.</li>
        <li><strong>Удалить все задачи:</strong> Будьте осторожны! Команда <code>crontab -r</code> удалит все ваши cron-задачи без подтверждения.</li>
      </ol>
    `
  },
  {
    question: "Как настроить логирование для cron-задач?",
    answer: "По умолчанию cron отправляет вывод команд на системную почту. Чтобы перенаправить вывод в файл логов, используйте операторы перенаправления. Наш генератор предлагает опцию для автоматического добавления стандартного логирования. Пример: <code>>> /var/log/my-cron.log 2>&1</code>. Это добавит стандартный вывод (stdout) в конец файла <code>/var/log/my-cron.log</code>, а <code>2>&1</code> перенаправит стандартный поток ошибок (stderr) в тот же файл."
  },
  {
    question: "В каком окружении выполняются cron-задачи?",
    answer: "Cron-задачи выполняются в очень ограниченном окружении. Переменные окружения, доступные в вашей обычной командной строке (например, $PATH), могут отсутствовать. Поэтому рекомендуется всегда использовать полные пути к исполняемым файлам (например, <code>/usr/bin/php</code> вместо <code>php</code>). Также можно определить переменные окружения в самом файле crontab перед списком задач."
  }
];

export default function Faq() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Часто задаваемые вопросы</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Все, что вы хотели знать о cron, но боялись спросить.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
        <CardContent className="p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <AccordionTrigger className="text-left font-headline text-lg">
                  <span itemProp="name">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div itemProp="text" className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}

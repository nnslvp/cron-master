# **App Name**: Крон Мастер

## Core Features:

- Выбор пресетов: Предлагает готовые пресеты cron-задач (например, резервное копирование базы данных, продление SSL-сертификата, очистка Docker).
- Визуальный редактор расписания: Позволяет за несколько кликов настроить расписание под конкретные нужды (выбор минут, часов, дней недели и т.д.).
- Генерация и описание cron-строки: Отображает итоговую cron-строку и предоставляет подробное описание, что она выполняет.
- Добавление логирования: Автоматически добавляет блок логирования (>> /var/log/... 2>&1) к cron-строке.
- Подстановка команды (AI): При добавлении команды, использует LLM как a tool для синтаксического анализа введенной команды пользователя с предоставлением релевантных лучших практик, обеспечивая правильность команды.
- Страница примеров: Демонстрационная страница с готовыми примерами cron-строк и подробными пояснениями их работы.
- Страница FAQ: Страница с часто задаваемыми вопросами и подробными объяснениями о том, как работает cron, как читать строки, как добавить задачу в crontab.

## Style Guidelines:

- Primary color: Deep Indigo (#663399) to evoke a sense of reliability, expertise, and technology.
- Background color: Very light gray (#F0F0F5) to provide a clean and modern base.
- Accent color: Electric Violet (#8F00FF) to highlight interactive elements and CTAs, ensuring they stand out.
- Font pairing: 'Space Grotesk' (sans-serif) for headings, providing a tech-focused, modern aesthetic paired with 'Inter' (sans-serif) for body text, ensuring readability and clarity.
- Use simple, clear icons to represent different types of cron jobs (e.g., database backup, SSL renewal).  Consider using the open-source library Tabler Icons.
- Design a clean, intuitive layout that guides users through the process of creating a cron job step-by-step, emphasizing ease of use and clarity.
- Incorporate subtle animations or transitions to enhance user engagement, such as highlighting the active element in the cron job configuration process.
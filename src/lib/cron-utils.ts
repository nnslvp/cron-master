export interface CronState {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  command: string;
}

export function generateCronString(cron: CronState, useLogging: boolean): string {
  const parts = [cron.minute, cron.hour, cron.dayOfMonth, cron.month, cron.dayOfWeek, cron.command];
  let cronString = parts.join(" ");
  if (useLogging) {
    cronString += " >> /var/log/cron.log 2>&1";
  }
  return cronString;
}

function describePart(value: string, singular: string, pluralGenitive: string, pluralNominative: string): string | null {
  if (value === "*") {
    return null; // Don't describe if it's "every"
  }
  if (value.startsWith("*/")) {
    const step = value.substring(2);
    return `каждые ${step} ${pluralGenitive}`;
  }
  if (value.includes(",")) {
    return `в ${value} ${pluralGenitive}`;
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `с ${start} по ${end} ${pluralGenitive}`;
  }
  if (parseInt(value) >= 0) {
    return `в ${value} ${singular}`;
  }
  return value;
}

const dayOfWeekMap: { [key: string]: string } = {
  "0": "воскресенье", "1": "понедельник", "2": "вторник", "3": "среду", "4": "четверг", "5": "пятницу", "6": "субботу", "7": "воскресенье"
};
const dayOfWeekRangeMap: { [key: string]: string } = {
  "0": "воскресеньям", "1": "понедельникам", "2": "вторникам", "3": "средам", "4": "четвергам", "5": "пятницам", "6": "субботам", "7": "воскресеньям"
};

function describeDayOfWeek(value: string): string | null {
  if (value === "*") return null;

  if (value.includes(",")) {
    const days = value.split(',').map(d => dayOfWeekMap[d] || d).join(', ');
    return `по ${days}`;
  }

  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `с ${dayOfWeekMap[start] || start} по ${dayOfWeekMap[end] || end}`;
  }

  if (parseInt(value) >= 0 && dayOfWeekMap[value]) {
    return `в ${dayOfWeekMap[value]}`;
  }
  
  return value;
}

export function generateCronDescription(cron: CronState): string {
  if (!cron.command) {
    return "Введите команду для генерации описания.";
  }
  
  let parts: string[] = [];

  const timeParts = [];
  const minuteDesc = describePart(cron.minute, "минуту", "минут", "минуты");
  if (minuteDesc) timeParts.push(minuteDesc);
  
  const hourDesc = describePart(cron.hour, "час", "часов", "часа");
  if (hourDesc) timeParts.push(hourDesc);

  let timeString = "";
  if (timeParts.length > 0) {
    timeString = `в ${timeParts.join(" ")}`;
  } else {
    if (cron.hour === "*" && cron.minute === "*") {
      timeString = "каждую минуту";
    } else if(cron.hour !== "*" && cron.minute === "*") {
      timeString = `каждую минуту ${describePart(cron.hour, "часа", "часов", "часов")}`;
    } else if(cron.hour === "*" && cron.minute !== "*") {
      timeString = `каждый час ${describePart(cron.minute, "минуту", "минут", "минуты")}`;
    }
  }
  parts.push(timeString);

  const dayOfWeekDesc = describeDayOfWeek(cron.dayOfWeek);

  if (cron.dayOfMonth === "*" && cron.month === "*" && !dayOfWeekDesc) {
    parts.push("каждый день");
  } else {
    if (dayOfWeekDesc) {
       parts.push(dayOfWeekDesc);
    }
    const dayOfMonthDesc = describePart(cron.dayOfMonth, "число", "чисел", "числа");
    if (dayOfMonthDesc) parts.push(dayOfMonthDesc);
    
    const monthDesc = describePart(cron.month, "месяц", "месяцев", "месяца");
    if (monthDesc) parts.push(monthDesc);
  }

  const capitalized = parts.filter(p => p).join(", ").charAt(0).toUpperCase() + parts.filter(p => p).join(", ").slice(1);
  return `Выполнять команду "${cron.command}" ${capitalized}.`;
}

export function generateSystemdTimer(cron: CronState) {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;
    
    // systemd format: DayOfWeek Year-Month-Day Hour:Minute:Second
    // DayOfWeek is optional: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const dowMap: { [key: string]: string } = { '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat', '0': 'Sun', '7': 'Sun' };

    let onCalendar = "";
    if (dayOfWeek !== "*") {
        onCalendar += `${dayOfWeek.split(',').map(d => dowMap[d] || "").join(",")} `;
    }

    onCalendar += `*-${month}-${dayOfMonth} ${hour}:${minute}:00`;

    const description = `Run '${cron.command}' based on cron schedule`;

    const serviceFileContent = `[Unit]
Description=${description}

[Service]
Type=oneshot
ExecStart=${cron.command}
`;

    const timerFileContent = `[Unit]
Description=Timer for: ${description}

[Timer]
OnCalendar=${onCalendar}
Persistent=true

[Install]
WantedBy=timers.target
`;
    
    return {
        description,
        onCalendar,
        serviceFile: serviceFileContent,
        timerFile: timerFileContent,
        raw: timerFileContent // for copy-paste
    };
}

"use client";

import { analyzeCommand, type AnalyzeCommandOutput } from "@/ai/flows/command-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateCronDescription, generateCronString, generateSystemdTimer, type CronState } from "@/lib/cron-utils";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeCheck, BadgeAlert, BrainCircuit, ChevronDown, Copy, Database, Loader2, Package, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Separator } from "../ui/separator";

const presets = [
  { name: "Резервное копирование БД", icon: Database, cron: { minute: "0", hour: "2", dayOfMonth: "*", month: "*", dayOfWeek: "*", command: "pg_dump -U user -d dbname | gzip > /path/to/backup/db_$(date +%F).sql.gz" }},
  { name: "Продление SSL", icon: ShieldCheck, cron: { minute: "0", hour: "0", dayOfMonth: "1", month: "*/2", dayOfWeek: "*", command: "certbot renew --quiet" }},
  { name: "Очистка Docker", icon: Package, cron: { minute: "15", hour: "4", dayOfMonth: "*", month: "*", dayOfWeek: "0", command: "docker system prune -af" }},
  { name: "Очистить /tmp", icon: Trash2, cron: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*", command: "find /tmp -type f -atime +30 -delete" }},
];

const timeUnits = {
  minute: { label: "Минута", max: 59, min: 0 },
  hour: { label: "Час", max: 23, min: 0 },
  dayOfMonth: { label: "День месяца", max: 31, min: 1 },
  month: { label: "Месяц", max: 12, min: 1 },
  dayOfWeek: { label: "День недели", max: 6, min: 0, labels: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] },
};

type TimeUnit = keyof typeof timeUnits;

const TimeUnitEditor = ({ unitKey, value, onChange }: { unitKey: TimeUnit, value: string, onChange: (value: string) => void }) => {
  const unit = timeUnits[unitKey];
  const [mode, setMode] = useState("common");
  const [specificValues, setSpecificValues] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (value.includes(",")) {
      setMode("specific");
      setSpecificValues(new Set(value.split(",").map(Number)));
    } else if (value.startsWith("*/")) {
      setMode("every");
    } else if (value === "*") {
      setMode("common");
    } else {
      setMode("specific");
       setSpecificValues(new Set(value.split(",").map(Number)));
    }
  }, [value]);

  const toggleSpecificValue = (num: number) => {
    const newValues = new Set(specificValues);
    if (newValues.has(num)) {
      newValues.delete(num);
    } else {
      newValues.add(num);
    }
    setSpecificValues(newValues);
    onChange(Array.from(newValues).sort((a,b) => a-b).join(','));
  };

  const options = Array.from({ length: unit.max - unit.min + 1 }, (_, i) => i + unit.min);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{unit.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={mode} onValueChange={setMode} className="mb-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="common" id={`${unitKey}-common`} onClick={() => onChange("*")} />
            <Label htmlFor={`${unitKey}-common`}>Каждый ({unit.label.toLowerCase()})</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="every" id={`${unitKey}-every`} />
            <Label htmlFor={`${unitKey}-every`} className="flex items-center gap-2">
              Каждые
              <Input type="number" min="1" max={unit.max} className="w-20 h-8" defaultValue={value.startsWith('*/') ? value.substring(2) : '5'} onChange={(e) => onChange(`*/${e.target.value}`)} />
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specific" id={`${unitKey}-specific`} />
            <Label htmlFor={`${unitKey}-specific`}>Конкретные</Label>
          </div>
        </RadioGroup>
        
        {mode === 'specific' && (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-2 p-4">
              {options.map(i => (
                <Button key={i} variant={specificValues.has(i) ? "default" : "outline"} size="sm" className="h-9 w-9" onClick={() => toggleSpecificValue(i)}>
                  {unit.labels ? unit.labels[i] : i}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};


export default function CronGenerator() {
  const { toast } = useToast();
  const [cron, setCron] = useState<CronState>({ minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*", command: "" });
  const [useLogging, setUseLogging] = useState(false);
  const [showSystemd, setShowSystemd] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeCommandOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cronString = useMemo(() => generateCronString(cron, useLogging), [cron, useLogging]);
  const cronDescription = useMemo(() => generateCronDescription(cron), [cron]);
  const systemdUnit = useMemo(() => generateSystemdTimer(cron), [cron]);

  const updateCron = (part: keyof CronState, value: string) => {
    setCron(prev => ({ ...prev, [part]: value }));
  };

  const handlePreset = (presetCron: CronState) => {
    setCron(presetCron);
    setAnalysis(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Скопировано!", description: "Текст скопирован в буфер обмена." });
  };

  const handleAnalyze = async () => {
    if (!cron.command) {
      toast({ variant: "destructive", title: "Ошибка", description: "Поле команды не может быть пустым." });
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeCommand({ command: cron.command });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({ variant: "destructive", title: "Ошибка анализа", description: "Не удалось проанализировать команду." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Пресеты</CardTitle>
          <CardDescription>Начните с готового шаблона</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presets.map(p => (
            <Button key={p.name} variant="outline" className="h-auto py-3 flex flex-col gap-2 sm:flex-row sm:justify-start" onClick={() => handlePreset(p.cron)}>
              <p.icon className="h-5 w-5 text-primary" />
              <span className="text-left text-wrap">{p.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible defaultValue="schedule">
        <AccordionItem value="schedule">
          <AccordionTrigger className="text-xl font-headline">Расписание</AccordionTrigger>
          <AccordionContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {(Object.keys(timeUnits) as TimeUnit[]).map(unitKey => (
                 <TimeUnitEditor key={unitKey} unitKey={unitKey} value={cron[unitKey]} onChange={(value) => updateCron(unitKey, value)} />
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>


      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Команда</CardTitle>
          <CardDescription>Укажите команду для выполнения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="your-command --here"
              value={cron.command}
              onChange={(e) => updateCron("command", e.target.value)}
              className="text-base font-mono"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
              <span>Анализировать (AI)</span>
            </Button>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Анализ команды...</span>
            </div>
          )}
          {analysis && (
            <Card className={cn("transition-all", analysis.isValid ? "border-green-500/50" : "border-amber-500/50")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-lg">
                  {analysis.isValid ? <BadgeCheck className="text-green-500" /> : <BadgeAlert className="text-amber-500" />}
                  Результат анализа
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>{analysis.analysis}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl">Дополнительно</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="logging" checked={useLogging} onCheckedChange={(checked) => setUseLogging(Boolean(checked))} />
                <Label htmlFor="logging" className="flex-grow">Добавить логирование в <code>/var/log/cron.log</code></Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="systemd" checked={showSystemd} onCheckedChange={(checked) => setShowSystemd(Boolean(checked))} />
                <Label htmlFor="systemd" className="flex-grow">Показать пример systemd unit-файла</Label>
            </div>
        </CardContent>
      </Card>

      <Card className="sticky bottom-4 shadow-2xl border-primary/50">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Результат</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cron-строка</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={cronString} className="font-mono text-base bg-secondary" />
              <Button size="icon" variant="ghost" onClick={() => handleCopy(cronString)}><Copy/></Button>
            </div>
          </div>
          <div>
            <Label>Описание</Label>
            <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md mt-1 min-h-10 flex items-center">{cronDescription}</p>
          </div>
          {showSystemd && (
            <div>
              <Label>Пример Systemd Timer</Label>
              <div className="relative mt-1">
                <pre className="bg-secondary text-sm text-secondary-foreground p-4 rounded-md overflow-x-auto font-mono">
                  <code>
                    <span className="text-primary">[Unit]</span><br/>
                    Description={systemdUnit.description}<br/><br/>
                    <span className="text-primary">[Timer]</span><br/>
                    OnCalendar={systemdUnit.onCalendar}<br/>
                    Persistent=true<br/><br/>
                    <span className="text-primary">[Install]</span><br/>
                    WantedBy=timers.target
                  </code>
                </pre>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => handleCopy(systemdUnit.raw)}><Copy/></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

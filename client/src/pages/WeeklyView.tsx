import { useState, useEffect } from "react";
import { startOfWeek, addDays, format, getDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import WeekNavigator from "@/components/WeekNavigator";
import DayEntry from "@/components/DayEntry";
import WeekendEntry from "@/components/WeekendEntry";
import PaySummary from "@/components/PaySummary";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import headerBg from "@assets/stock_images/warm_sunny_family_ho_bb6a331d.jpg";
import type { TimeEntry } from "@shared/schema";

interface LocalTimeEntry {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  skipped?: boolean;
}

const getDefaultEndTime = (date: Date): string => {
  const dayOfWeek = getDay(date);
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    return '13:00';
  }
  if (dayOfWeek === 2 || dayOfWeek === 4) {
    return '15:30';
  }
  return '';
};

const initializeWeekDefaults = (weekStart: Date): Record<string, LocalTimeEntry> => {
  const entries: Record<string, LocalTimeEntry> = {};
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayOfWeek = getDay(day);
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      entries[dateKey] = {
        date: dateKey,
        startTime: '08:30',
        endTime: getDefaultEndTime(day),
      };
    }
  }
  return entries;
};

export default function WeeklyView() {
  const { toast } = useToast();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [localEntries, setLocalEntries] = useState<Record<string, LocalTimeEntry>>(() =>
    initializeWeekDefaults(startOfWeek(new Date(), { weekStartsOn: 1 }))
  );

  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');

  // Fetch time entries for the week
  const { data: entriesData = [] } = useQuery<TimeEntry[]>({
    queryKey: ['/api/time-entries-week', currentWeekKey],
  });

  // Fetch confirmed weeks
  const { data: confirmedWeeksData = [] } = useQuery<any[]>({
    queryKey: ['/api/confirmed-weeks'],
  });

  // Fetch hourly rate
  const { data: rateData = { rate: '35' } } = useQuery<{ rate: string }>({
    queryKey: ['/api/hourly-rate'],
  });

  // Mutations
  const createEntryMutation = useMutation({
    mutationFn: (entry: LocalTimeEntry) =>
      fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries-week', currentWeekKey] });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: (entry: LocalTimeEntry & { id: string }) =>
      fetch(`/api/time-entries/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: entry.date, startTime: entry.startTime, endTime: entry.endTime, skipped: entry.skipped }),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries-week', currentWeekKey] });
    },
  });

  const confirmWeekMutation = useMutation({
    mutationFn: () =>
      fetch('/api/confirmed-weeks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStart: currentWeekKey }),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/confirmed-weeks'] });
      toast({ title: "Week confirmed!" });
    },
  });

  const unconfirmWeekMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/confirmed-weeks/${currentWeekKey}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/confirmed-weeks'] });
      toast({ title: "Week unconfirmed" });
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: (rate: number) =>
      fetch('/api/hourly-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate }),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hourly-rate'] });
    },
  });

  // Sync local state with fetched data
  useEffect(() => {
    const newEntries = { ...localEntries };
    entriesData.forEach(entry => {
      newEntries[entry.date] = entry as LocalTimeEntry;
    });
    setLocalEntries(newEntries);
  }, [entriesData]);

  // Update week defaults when week changes
  useEffect(() => {
    setLocalEntries((prev) => {
      const newDefaults = initializeWeekDefaults(currentWeekStart);
      const merged: Record<string, LocalTimeEntry> = {};
      
      Object.keys(newDefaults).forEach((dateKey) => {
        if (prev[dateKey]) {
          merged[dateKey] = prev[dateKey];
        } else {
          merged[dateKey] = newDefaults[dateKey];
        }
      });
      
      return merged;
    });
  }, [currentWeekStart]);

  const isCurrentWeekConfirmed = (confirmedWeeksData || []).some(
    (week: any) => week.weekStart === currentWeekKey
  );

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const handleTimeChange = async (date: Date, field: 'startTime' | 'endTime', value: string) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entry = localEntries[dateKey];
    const updated = { ...entry, [field]: value };
    
    setLocalEntries((prev) => ({
      ...prev,
      [dateKey]: updated,
    }));

    if (entry?.id) {
      await updateEntryMutation.mutateAsync(updated as LocalTimeEntry & { id: string });
    } else {
      await createEntryMutation.mutateAsync(updated);
    }
  };

  const handleSkipToggle = async (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entry = localEntries[dateKey];
    const updated = { ...entry, skipped: !entry?.skipped };
    
    setLocalEntries((prev) => ({
      ...prev,
      [dateKey]: updated,
    }));

    if (entry?.id) {
      await updateEntryMutation.mutateAsync(updated as LocalTimeEntry & { id: string });
    } else {
      await createEntryMutation.mutateAsync(updated);
    }
  };

  const calculateTotals = () => {
    let totalHours = 0;
    let daysWorked = 0;
    
    weekDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const entry = localEntries[dateKey];
      
      if (entry?.skipped) {
        return;
      }
      
      if (entry?.startTime && entry?.endTime) {
        const [startHour, startMin] = entry.startTime.split(':').map(Number);
        const [endHour, endMin] = entry.endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const totalMinutes = endMinutes - startMinutes;
        
        if (totalMinutes > 0) {
          totalHours += totalMinutes / 60;
          daysWorked += 1;
        }
      }
    });
    
    return { totalHours, daysWorked };
  };
  
  const { totalHours, daysWorked } = calculateTotals();
  const hourlyRate = rateData?.rate ? parseInt(rateData.rate) : 35;
  const weekdayDays = weekDays.slice(0, 5);
  const saturdayDay = weekDays[5];
  const sundayDay = weekDays[6];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-heading text-primary" data-testid="text-page-title">
            Ani Janika
          </h1>
          <ThemeToggle />
        </div>
        
        <WeekNavigator
          currentWeekStart={currentWeekStart}
          onWeekChange={setCurrentWeekStart}
        />
        
        <div className="space-y-2" data-testid="container-week-entries">
          {weekdayDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const entry = localEntries[dateKey] || { date: dateKey, startTime: '', endTime: '' };
            
            return (
              <DayEntry
                key={dateKey}
                date={day}
                startTime={entry.startTime}
                endTime={entry.endTime}
                skipped={entry.skipped}
                onStartTimeChange={(time) => handleTimeChange(day, 'startTime', time)}
                onEndTimeChange={(time) => handleTimeChange(day, 'endTime', time)}
                onSkipToggle={() => handleSkipToggle(day)}
                isLocked={isCurrentWeekConfirmed}
              />
            );
          })}
          
          <WeekendEntry
            saturday={{
              date: saturdayDay,
              startTime: localEntries[format(saturdayDay, 'yyyy-MM-dd')]?.startTime || '',
              endTime: localEntries[format(saturdayDay, 'yyyy-MM-dd')]?.endTime || '',
              skipped: localEntries[format(saturdayDay, 'yyyy-MM-dd')]?.skipped,
              onStartTimeChange: (time) => handleTimeChange(saturdayDay, 'startTime', time),
              onEndTimeChange: (time) => handleTimeChange(saturdayDay, 'endTime', time),
              onSkipToggle: () => handleSkipToggle(saturdayDay),
            }}
            sunday={{
              date: sundayDay,
              startTime: localEntries[format(sundayDay, 'yyyy-MM-dd')]?.startTime || '',
              endTime: localEntries[format(sundayDay, 'yyyy-MM-dd')]?.endTime || '',
              skipped: localEntries[format(sundayDay, 'yyyy-MM-dd')]?.skipped,
              onStartTimeChange: (time) => handleTimeChange(sundayDay, 'startTime', time),
              onEndTimeChange: (time) => handleTimeChange(sundayDay, 'endTime', time),
              onSkipToggle: () => handleSkipToggle(sundayDay),
            }}
            isLocked={isCurrentWeekConfirmed}
          />
        </div>
        
        <PaySummary
          totalHours={totalHours}
          daysWorked={daysWorked}
          hourlyRate={hourlyRate}
          onHourlyRateChange={(rate) => updateRateMutation.mutate(rate)}
          isWeekConfirmed={isCurrentWeekConfirmed}
          onConfirmWeek={() => confirmWeekMutation.mutate()}
          onUnconfirmWeek={() => unconfirmWeekMutation.mutate()}
        />
      </div>
    </div>
  );
}

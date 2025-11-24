import { useState, useEffect } from "react";
import { startOfWeek, addDays, format, getDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import WeekNavigator from "@/components/WeekNavigator";
import DayEntry from "@/components/DayEntry";
import WeekendEntry from "@/components/WeekendEntry";
import PaySummary from "@/components/PaySummary";
import headerBg from "@assets/stock_images/warm_sunny_family_ho_bb6a331d.jpg";

interface TimeEntry {
  date: string;
  startTime: string;
  endTime: string;
  skipped?: boolean;
}

const getDefaultEndTime = (date: Date): string => {
  const dayOfWeek = getDay(date);
  // Monday (1), Wednesday (3), Friday (5) -> 1pm (13:00)
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    return '13:00';
  }
  // Tuesday (2), Thursday (4) -> 3:30pm (15:30)
  if (dayOfWeek === 2 || dayOfWeek === 4) {
    return '15:30';
  }
  // Weekend - no default
  return '';
};

const initializeWeekDefaults = (weekStart: Date): Record<string, TimeEntry> => {
  const entries: Record<string, TimeEntry> = {};
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayOfWeek = getDay(day);
    
    // Only set defaults for weekdays (Monday-Friday)
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
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry>>(() =>
    initializeWeekDefaults(startOfWeek(new Date(), { weekStartsOn: 1 }))
  );
  const [hourlyRate, setHourlyRate] = useState(35);
  const [confirmedWeeks, setConfirmedWeeks] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('confirmedWeeks');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  
  useEffect(() => {
    setTimeEntries((prev) => {
      const newDefaults = initializeWeekDefaults(currentWeekStart);
      const merged: Record<string, TimeEntry> = {};
      
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
  
  useEffect(() => {
    localStorage.setItem('confirmedWeeks', JSON.stringify(Array.from(confirmedWeeks)));
  }, [confirmedWeeks]);
  
  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');
  const isCurrentWeekConfirmed = confirmedWeeks.has(currentWeekKey);
  
  const handleConfirmWeek = () => {
    setConfirmedWeeks((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentWeekKey);
      return newSet;
    });
  };
  
  const handleUnconfirmWeek = () => {
    setConfirmedWeeks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentWeekKey);
      return newSet;
    });
  };
  
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );
  
  const handleTimeChange = (date: Date, field: 'startTime' | 'endTime', value: string) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setTimeEntries((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        date: dateKey,
        [field]: value,
      },
    }));
  };
  
  const handleSkipToggle = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setTimeEntries((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        date: dateKey,
        skipped: !prev[dateKey]?.skipped,
      },
    }));
  };
  
  const calculateTotals = () => {
    let totalHours = 0;
    let daysWorked = 0;
    
    weekDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const entry = timeEntries[dateKey];
      
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
            const entry = timeEntries[dateKey] || { date: dateKey, startTime: '', endTime: '' };
            
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
              startTime: timeEntries[format(saturdayDay, 'yyyy-MM-dd')]?.startTime || '',
              endTime: timeEntries[format(saturdayDay, 'yyyy-MM-dd')]?.endTime || '',
              skipped: timeEntries[format(saturdayDay, 'yyyy-MM-dd')]?.skipped,
              onStartTimeChange: (time) => handleTimeChange(saturdayDay, 'startTime', time),
              onEndTimeChange: (time) => handleTimeChange(saturdayDay, 'endTime', time),
              onSkipToggle: () => handleSkipToggle(saturdayDay),
            }}
            sunday={{
              date: sundayDay,
              startTime: timeEntries[format(sundayDay, 'yyyy-MM-dd')]?.startTime || '',
              endTime: timeEntries[format(sundayDay, 'yyyy-MM-dd')]?.endTime || '',
              skipped: timeEntries[format(sundayDay, 'yyyy-MM-dd')]?.skipped,
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
          onHourlyRateChange={setHourlyRate}
          isWeekConfirmed={isCurrentWeekConfirmed}
          onConfirmWeek={handleConfirmWeek}
          onUnconfirmWeek={handleUnconfirmWeek}
        />
      </div>
    </div>
  );
}

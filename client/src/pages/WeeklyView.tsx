import { useState, useEffect } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import WeekNavigator from "@/components/WeekNavigator";
import DayEntry from "@/components/DayEntry";
import PaySummary from "@/components/PaySummary";

interface TimeEntry {
  date: string;
  startTime: string;
  endTime: string;
}

export default function WeeklyView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry>>({});
  const [hourlyRate, setHourlyRate] = useState(35);
  
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
  
  const calculateTotals = () => {
    let totalHours = 0;
    let daysWorked = 0;
    
    weekDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const entry = timeEntries[dateKey];
      
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
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8" data-testid="text-page-title">
          Nanny Hours Tracker
        </h1>
        
        <WeekNavigator
          currentWeekStart={currentWeekStart}
          onWeekChange={setCurrentWeekStart}
        />
        
        <div className="space-y-2" data-testid="container-week-entries">
          {weekDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const entry = timeEntries[dateKey] || { date: dateKey, startTime: '', endTime: '' };
            
            return (
              <DayEntry
                key={dateKey}
                date={day}
                startTime={entry.startTime}
                endTime={entry.endTime}
                onStartTimeChange={(time) => handleTimeChange(day, 'startTime', time)}
                onEndTimeChange={(time) => handleTimeChange(day, 'endTime', time)}
              />
            );
          })}
        </div>
        
        <PaySummary
          totalHours={totalHours}
          daysWorked={daysWorked}
          hourlyRate={hourlyRate}
          onHourlyRateChange={setHourlyRate}
        />
      </div>
    </div>
  );
}

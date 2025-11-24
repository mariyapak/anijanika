import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DayEntryProps {
  date: Date;
  startTime: string;
  endTime: string;
  skipped?: boolean;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onSkipToggle: () => void;
  isLocked?: boolean;
}

export default function DayEntry({
  date,
  startTime,
  endTime,
  skipped = false,
  onStartTimeChange,
  onEndTimeChange,
  onSkipToggle,
  isLocked = false,
}: DayEntryProps) {
  const dayName = format(date, 'EEEE');
  const dateStr = format(date, 'MMM d');
  const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
  
  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const totalMinutes = endMinutes - startMinutes;
    return totalMinutes > 0 ? (totalMinutes / 60).toFixed(1) : 0;
  };
  
  const hours = calculateHours();
  const hasWorked = startTime && endTime && Number(hours) > 0;
  
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_auto] gap-4 md:gap-6 p-4 rounded-md border ${
        isWeekend ? 'bg-muted/30' : ''
      } ${isLocked ? 'opacity-60' : ''} ${skipped ? 'opacity-40' : ''}`}
      data-testid={`day-entry-${format(date, 'yyyy-MM-dd')}`}
    >
      <div className="flex flex-col">
        <Label className="text-sm font-medium mb-1">{dayName}</Label>
        <span className="text-sm text-muted-foreground tabular-nums" data-testid={`text-date-${format(date, 'yyyy-MM-dd')}`}>
          {dateStr}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`start-${format(date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
            Start Time
          </Label>
          <Input
            id={`start-${format(date, 'yyyy-MM-dd')}`}
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="tabular-nums"
            data-testid={`input-start-time-${format(date, 'yyyy-MM-dd')}`}
            disabled={isLocked || skipped}
            step="1800"
          />
        </div>
        
        <div>
          <Label htmlFor={`end-${format(date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
            End Time
          </Label>
          <Input
            id={`end-${format(date, 'yyyy-MM-dd')}`}
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="tabular-nums"
            data-testid={`input-end-time-${format(date, 'yyyy-MM-dd')}`}
            disabled={isLocked || skipped}
            step="1800"
          />
        </div>
      </div>
      
      <div className="flex flex-col justify-end">
        <Label className="text-sm mb-1.5">Hours Worked</Label>
        <div
          className="h-10 flex items-center px-3 rounded-md bg-muted/50 tabular-nums font-medium"
          data-testid={`text-hours-${format(date, 'yyyy-MM-dd')}`}
        >
          {hours} hrs
        </div>
      </div>
      
      <div className="flex flex-col justify-end">
        <Button
          variant={skipped ? "default" : "outline"}
          size="sm"
          onClick={onSkipToggle}
          disabled={isLocked}
          data-testid={`button-skip-${format(date, 'yyyy-MM-dd')}`}
          className="h-10"
        >
          {skipped ? "Unskip" : "Skip"}
        </Button>
      </div>
    </div>
  );
}

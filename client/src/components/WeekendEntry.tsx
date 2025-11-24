import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface WeekendEntryProps {
  saturday: {
    date: Date;
    startTime: string;
    endTime: string;
    skipped?: boolean;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
    onSkipToggle: () => void;
  };
  sunday: {
    date: Date;
    startTime: string;
    endTime: string;
    skipped?: boolean;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
    onSkipToggle: () => void;
  };
  isLocked?: boolean;
}

export default function WeekendEntry({ saturday, sunday, isLocked = false }: WeekendEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const calculateHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const totalMinutes = endMinutes - startMinutes;
    return totalMinutes > 0 ? (totalMinutes / 60).toFixed(1) : 0;
  };
  
  const satHours = calculateHours(saturday.startTime, saturday.endTime);
  const sunHours = calculateHours(sunday.startTime, sunday.endTime);
  const totalWeekendHours = (Number(satHours) + Number(sunHours)).toFixed(1);
  
  return (
    <div className={`rounded-md border bg-muted/30 ${isLocked ? 'opacity-60' : ''}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover-elevate active-elevate-2 rounded-md"
        data-testid="button-toggle-weekend"
        disabled={isLocked}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">Weekend (Optional)</span>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums" data-testid="text-weekend-hours">
          {totalWeekendHours} hrs total
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 rounded-md border bg-background ${saturday.skipped ? 'opacity-40' : ''}`}>
            <div className="md:col-span-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium">Saturday</Label>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    checked={saturday.skipped}
                    onCheckedChange={saturday.onSkipToggle}
                    disabled={isLocked}
                    data-testid={`checkbox-skip-${format(saturday.date, 'yyyy-MM-dd')}`}
                    className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Skip</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">
                {format(saturday.date, 'MMM d')}
              </span>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`start-${format(saturday.date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
                  Start Time
                </Label>
                <Input
                  id={`start-${format(saturday.date, 'yyyy-MM-dd')}`}
                  type="time"
                  value={saturday.startTime}
                  onChange={(e) => saturday.onStartTimeChange(e.target.value)}
                  className="tabular-nums"
                  data-testid={`input-start-time-${format(saturday.date, 'yyyy-MM-dd')}`}
                  disabled={isLocked || saturday.skipped}
                  step="1800"
                />
              </div>
              
              <div>
                <Label htmlFor={`end-${format(saturday.date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
                  End Time
                </Label>
                <Input
                  id={`end-${format(saturday.date, 'yyyy-MM-dd')}`}
                  type="time"
                  value={saturday.endTime}
                  onChange={(e) => saturday.onEndTimeChange(e.target.value)}
                  className="tabular-nums"
                  data-testid={`input-end-time-${format(saturday.date, 'yyyy-MM-dd')}`}
                  disabled={isLocked || saturday.skipped}
                  step="1800"
                />
              </div>
            </div>
            
            <div className="md:col-span-1 flex flex-col justify-end">
              <Label className="text-sm mb-1.5">Hours Worked</Label>
              <div
                className="h-10 flex items-center px-3 rounded-md bg-muted/50 tabular-nums font-medium"
                data-testid={`text-hours-${format(saturday.date, 'yyyy-MM-dd')}`}
              >
                {satHours} hrs
              </div>
            </div>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 rounded-md border bg-background ${sunday.skipped ? 'opacity-40' : ''}`}>
            <div className="md:col-span-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium">Sunday</Label>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    checked={sunday.skipped}
                    onCheckedChange={sunday.onSkipToggle}
                    disabled={isLocked}
                    data-testid={`checkbox-skip-${format(sunday.date, 'yyyy-MM-dd')}`}
                    className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Skip</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">
                {format(sunday.date, 'MMM d')}
              </span>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`start-${format(sunday.date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
                  Start Time
                </Label>
                <Input
                  id={`start-${format(sunday.date, 'yyyy-MM-dd')}`}
                  type="time"
                  value={sunday.startTime}
                  onChange={(e) => sunday.onStartTimeChange(e.target.value)}
                  className="tabular-nums"
                  data-testid={`input-start-time-${format(sunday.date, 'yyyy-MM-dd')}`}
                  disabled={isLocked || sunday.skipped}
                  step="1800"
                />
              </div>
              
              <div>
                <Label htmlFor={`end-${format(sunday.date, 'yyyy-MM-dd')}`} className="text-sm mb-1.5">
                  End Time
                </Label>
                <Input
                  id={`end-${format(sunday.date, 'yyyy-MM-dd')}`}
                  type="time"
                  value={sunday.endTime}
                  onChange={(e) => sunday.onEndTimeChange(e.target.value)}
                  className="tabular-nums"
                  data-testid={`input-end-time-${format(sunday.date, 'yyyy-MM-dd')}`}
                  disabled={isLocked || sunday.skipped}
                  step="1800"
                />
              </div>
            </div>
            
            <div className="md:col-span-1 flex flex-col justify-end">
              <Label className="text-sm mb-1.5">Hours Worked</Label>
              <div
                className="h-10 flex items-center px-3 rounded-md bg-muted/50 tabular-nums font-medium"
                data-testid={`text-hours-${format(sunday.date, 'yyyy-MM-dd')}`}
              >
                {sunHours} hrs
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

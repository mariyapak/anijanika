import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface WeekendEntryProps {
  saturday: {
    date: Date;
    startTime: string;
    endTime: string;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
  };
  sunday: {
    date: Date;
    startTime: string;
    endTime: string;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
  };
}

export default function WeekendEntry({ saturday, sunday }: WeekendEntryProps) {
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
    <div className="rounded-md border bg-muted/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover-elevate active-elevate-2 rounded-md"
        data-testid="button-toggle-weekend"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 rounded-md border bg-background">
            <div className="md:col-span-1 flex flex-col">
              <Label className="text-sm font-medium mb-1">Saturday</Label>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 rounded-md border bg-background">
            <div className="md:col-span-1 flex flex-col">
              <Label className="text-sm font-medium mb-1">Sunday</Label>
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

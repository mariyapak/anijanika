import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
}

export default function WeekNavigator({ currentWeekStart, onWeekChange }: WeekNavigatorProps) {
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  const handlePrevWeek = () => {
    onWeekChange(subWeeks(currentWeekStart, 1));
  };
  
  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeekStart, 1));
  };
  
  const formatWeekRange = () => {
    const startMonth = format(currentWeekStart, 'MMMM');
    const endMonth = format(weekEnd, 'MMMM');
    const startDay = format(currentWeekStart, 'd');
    const endDay = format(weekEnd, 'd');
    const year = format(weekEnd, 'yyyy');
    
    if (startMonth === endMonth) {
      return `Week of ${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      return `Week of ${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };
  
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevWeek}
        data-testid="button-prev-week"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-2xl font-heading tabular-nums" data-testid="text-week-range">
        {formatWeekRange()}
      </h2>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextWeek}
        data-testid="button-next-week"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

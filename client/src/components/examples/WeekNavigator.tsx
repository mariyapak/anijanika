import WeekNavigator from '../WeekNavigator';
import { startOfWeek } from 'date-fns';

export default function WeekNavigatorExample() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  return (
    <WeekNavigator
      currentWeekStart={currentWeekStart}
      onWeekChange={(date) => console.log('Week changed to:', date)}
    />
  );
}

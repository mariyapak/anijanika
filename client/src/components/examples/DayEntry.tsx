import { useState } from 'react';
import DayEntry from '../DayEntry';

export default function DayEntryExample() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  
  return (
    <DayEntry
      date={new Date()}
      startTime={startTime}
      endTime={endTime}
      onStartTimeChange={setStartTime}
      onEndTimeChange={setEndTime}
    />
  );
}

import PaySummary from '../PaySummary';

export default function PaySummaryExample() {
  return (
    <PaySummary
      totalHours={32.5}
      daysWorked={4}
      hourlyRate={35}
      onHourlyRateChange={(rate) => console.log('Hourly rate changed to:', rate)}
    />
  );
}

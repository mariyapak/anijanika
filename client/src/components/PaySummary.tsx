import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaySummaryProps {
  totalHours: number;
  daysWorked: number;
  hourlyRate?: number;
  onHourlyRateChange?: (rate: number) => void;
  isWeekConfirmed?: boolean;
  onConfirmWeek?: () => void;
  onUnconfirmWeek?: () => void;
}

export default function PaySummary({
  totalHours,
  daysWorked,
  hourlyRate: initialRate = 35,
  onHourlyRateChange,
  isWeekConfirmed = false,
  onConfirmWeek,
  onUnconfirmWeek,
}: PaySummaryProps) {
  const [hourlyRate, setHourlyRate] = useState(initialRate);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(String(initialRate));
  
  const billableHours = Math.max(totalHours, 25);
  const gasReimbursement = daysWorked * 20;
  const hourlyPay = billableHours * hourlyRate;
  const totalPay = hourlyPay + gasReimbursement;
  
  const handleEditRate = () => {
    setIsEditingRate(true);
    setTempRate(String(hourlyRate));
  };
  
  const handleSaveRate = () => {
    const newRate = parseFloat(tempRate);
    if (!isNaN(newRate) && newRate > 0) {
      setHourlyRate(newRate);
      onHourlyRateChange?.(newRate);
    } else {
      setTempRate(String(hourlyRate));
    }
    setIsEditingRate(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditingRate(false);
    setTempRate(String(hourlyRate));
  };
  
  return (
    <Card className="mt-8" data-testid="card-pay-summary">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Weekly Pay Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Total Hours</Label>
              <span className="tabular-nums font-medium" data-testid="text-total-hours">
                {totalHours.toFixed(1)} hours
              </span>
            </div>
            
            {totalHours < 25 && (
              <div className="flex justify-between items-center">
                <Label className="text-sm text-muted-foreground">Billable Hours (min 25)</Label>
                <span className="tabular-nums font-medium" data-testid="text-billable-hours">
                  {billableHours.toFixed(1)} hours
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Hourly Rate</Label>
              {isEditingRate ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-24 h-8 tabular-nums"
                    step="0.50"
                    min="0"
                    data-testid="input-hourly-rate"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSaveRate}
                    data-testid="button-save-rate"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={handleEditRate}
                  className="flex items-center gap-2 tabular-nums font-medium hover-elevate active-elevate-2 px-2 py-1 rounded-md"
                  data-testid="button-edit-rate"
                >
                  ${hourlyRate.toFixed(2)}
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Hourly Pay</Label>
              <span className="tabular-nums font-medium" data-testid="text-hourly-pay">
                ${hourlyPay.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Days Worked</Label>
              <span className="tabular-nums font-medium" data-testid="text-days-worked">
                {daysWorked} {daysWorked === 1 ? 'day' : 'days'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Gas Reimbursement</Label>
              <span className="tabular-nums font-medium" data-testid="text-gas-reimbursement">
                ${gasReimbursement.toFixed(2)} <span className="text-xs text-muted-foreground">(@$20/day)</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-lg font-semibold">Total Weekly Pay</Label>
            <span className="text-2xl font-bold tabular-nums" data-testid="text-total-pay">
              ${totalPay.toFixed(2)}
            </span>
          </div>
          
          {onConfirmWeek && onUnconfirmWeek && (
            <div className="flex justify-end gap-2 mt-4">
              {isWeekConfirmed ? (
                <>
                  <span className="text-sm text-muted-foreground flex items-center gap-2" data-testid="text-confirmed">
                    Week confirmed - entries locked
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onUnconfirmWeek}
                    data-testid="button-unconfirm-week"
                  >
                    Unlock Week
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onConfirmWeek}
                  data-testid="button-confirm-week"
                >
                  Confirm Week
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

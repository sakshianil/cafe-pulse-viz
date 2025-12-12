import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { FilterState } from '@/types/sales';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableProducts: string[];
  availableTimeOfDay: string[];
  availableWeekdays: string[];
  dateRange: { min: Date | null; max: Date | null };
}

export function FilterPanel({
  filters,
  setFilters,
  availableProducts,
  availableTimeOfDay,
  availableWeekdays,
  dateRange,
}: FilterPanelProps) {
  const handleProductChange = (product: string, checked: boolean) => {
    const newProducts = checked
      ? [...filters.products, product]
      : filters.products.filter((p) => p !== product);
    setFilters({ ...filters, products: newProducts });
  };

  const handleTimeOfDayChange = (time: string, checked: boolean) => {
    const newTimes = checked
      ? [...filters.timeOfDay, time]
      : filters.timeOfDay.filter((t) => t !== time);
    setFilters({ ...filters, timeOfDay: newTimes });
  };

  const handleWeekdayChange = (day: string, checked: boolean) => {
    const newDays = checked
      ? [...filters.weekdays, day]
      : filters.weekdays.filter((d) => d !== day);
    setFilters({ ...filters, weekdays: newDays });
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      products: [],
      timeOfDay: [],
      weekdays: [],
    });
  };

  const hasActiveFilters =
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.products.length > 0 ||
    filters.timeOfDay.length > 0 ||
    filters.weekdays.length > 0;

  return (
    <div className="filter-panel space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
            Clear all
          </Button>
        )}
      </div>

      {/* Date Range */}
      <div>
        <p className="filter-label">Date Range</p>
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange.start && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange.start
                  ? format(filters.dateRange.start, "MMM d, yyyy")
                  : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateRange.start || undefined}
                onSelect={(date) =>
                  setFilters({ ...filters, dateRange: { ...filters.dateRange, start: date || null } })
                }
                disabled={(date) =>
                  (dateRange.min && date < dateRange.min) ||
                  (dateRange.max && date > dateRange.max) ||
                  false
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange.end && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange.end
                  ? format(filters.dateRange.end, "MMM d, yyyy")
                  : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateRange.end || undefined}
                onSelect={(date) =>
                  setFilters({ ...filters, dateRange: { ...filters.dateRange, end: date || null } })
                }
                disabled={(date) =>
                  (dateRange.min && date < dateRange.min) ||
                  (dateRange.max && date > dateRange.max) ||
                  false
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Products */}
      <div>
        <p className="filter-label">Coffee Products</p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableProducts.map((product) => (
            <div key={product} className="flex items-center space-x-2">
              <Checkbox
                id={`product-${product}`}
                checked={filters.products.includes(product)}
                onCheckedChange={(checked) => handleProductChange(product, checked === true)}
              />
              <Label htmlFor={`product-${product}`} className="text-sm font-normal cursor-pointer">
                {product}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <p className="filter-label">Time of Day</p>
        <div className="space-y-2">
          {availableTimeOfDay.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox
                id={`time-${time}`}
                checked={filters.timeOfDay.includes(time)}
                onCheckedChange={(checked) => handleTimeOfDayChange(time, checked === true)}
              />
              <Label htmlFor={`time-${time}`} className="text-sm font-normal cursor-pointer">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Weekdays */}
      <div>
        <p className="filter-label">Weekday</p>
        <div className="grid grid-cols-2 gap-2">
          {availableWeekdays.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={filters.weekdays.includes(day)}
                onCheckedChange={(checked) => handleWeekdayChange(day, checked === true)}
              />
              <Label htmlFor={`day-${day}`} className="text-sm font-normal cursor-pointer">
                {day}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface SalesRecord {
  hour_of_day: number;
  cash_type: string;
  money: number;
  coffee_name: string;
  Time_of_Day: string;
  Weekday: string;
  Month_name: string;
  Weekdaysort: number;
  Monthsort: number;
  Date: string;
  Time: string;
}

export interface FilterState {
  dateRange: { start: Date | null; end: Date | null };
  products: string[];
  timeOfDay: string[];
  weekdays: string[];
}

export interface KPIData {
  totalRevenue: number;
  totalTransactions: number;
  avgTicketSize: number;
  bestSellingProduct: string;
  peakHour: number;
}

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { SalesRecord, FilterState, KPIData } from '@/types/sales';

export function useSalesData() {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: null, end: null },
    products: [],
    timeOfDay: [],
    weekdays: [],
  });

  useEffect(() => {
    fetch('/data/coffee_sales.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<SalesRecord>(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsed = results.data.filter(row => row.money && row.coffee_name);
            setData(parsed);
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const recordDate = new Date(record.Date);
        if (filters.dateRange.start && recordDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && recordDate > filters.dateRange.end) return false;
      }
      
      // Product filter
      if (filters.products.length > 0 && !filters.products.includes(record.coffee_name)) {
        return false;
      }
      
      // Time of day filter
      if (filters.timeOfDay.length > 0 && !filters.timeOfDay.includes(record.Time_of_Day)) {
        return false;
      }
      
      // Weekday filter
      if (filters.weekdays.length > 0 && !filters.weekdays.includes(record.Weekday)) {
        return false;
      }
      
      return true;
    });
  }, [data, filters]);

  const availableProducts = useMemo(() => {
    return [...new Set(data.map((r) => r.coffee_name))].sort();
  }, [data]);

  const availableTimeOfDay = useMemo(() => {
    return [...new Set(data.map((r) => r.Time_of_Day))];
  }, [data]);

  const availableWeekdays = useMemo(() => {
    const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekdayOrder.filter((day) => data.some((r) => r.Weekday === day));
  }, [data]);

  const dateRange = useMemo(() => {
    if (data.length === 0) return { min: null, max: null };
    const dates = data.map((r) => new Date(r.Date));
    return {
      min: new Date(Math.min(...dates.map((d) => d.getTime()))),
      max: new Date(Math.max(...dates.map((d) => d.getTime()))),
    };
  }, [data]);

  const kpiData = useMemo<KPIData>(() => {
    if (filteredData.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        avgTicketSize: 0,
        bestSellingProduct: '-',
        peakHour: 0,
      };
    }

    const totalRevenue = filteredData.reduce((sum, r) => sum + r.money, 0);
    const totalTransactions = filteredData.length;
    const avgTicketSize = totalRevenue / totalTransactions;

    // Best selling product by revenue
    const productRevenue: Record<string, number> = {};
    filteredData.forEach((r) => {
      productRevenue[r.coffee_name] = (productRevenue[r.coffee_name] || 0) + r.money;
    });
    const bestSellingProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    // Peak hour by revenue
    const hourRevenue: Record<number, number> = {};
    filteredData.forEach((r) => {
      hourRevenue[r.hour_of_day] = (hourRevenue[r.hour_of_day] || 0) + r.money;
    });
    const peakHour = Number(Object.entries(hourRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || 0);

    return {
      totalRevenue,
      totalTransactions,
      avgTicketSize,
      bestSellingProduct,
      peakHour,
    };
  }, [filteredData]);

  // Revenue by hour
  const revenueByHour = useMemo(() => {
    const hourData: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourData[i] = 0;
    filteredData.forEach((r) => {
      hourData[r.hour_of_day] += r.money;
    });
    return Object.entries(hourData).map(([hour, revenue]) => ({
      hour: Number(hour),
      hourLabel: `${hour}:00`,
      revenue,
    }));
  }, [filteredData]);

  // Revenue by product
  const revenueByProduct = useMemo(() => {
    const productData: Record<string, number> = {};
    filteredData.forEach((r) => {
      productData[r.coffee_name] = (productData[r.coffee_name] || 0) + r.money;
    });
    return Object.entries(productData)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  // Monthly revenue trend
  const monthlyRevenue = useMemo(() => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthData: Record<string, number> = {};
    filteredData.forEach((r) => {
      monthData[r.Month_name] = (monthData[r.Month_name] || 0) + r.money;
    });
    return monthOrder
      .filter((month) => monthData[month] !== undefined)
      .map((month) => ({ month, revenue: monthData[month] }));
  }, [filteredData]);

  // Revenue by weekday
  const revenueByWeekday = useMemo(() => {
    const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekdayData: Record<string, number> = {};
    filteredData.forEach((r) => {
      weekdayData[r.Weekday] = (weekdayData[r.Weekday] || 0) + r.money;
    });
    return weekdayOrder
      .filter((day) => weekdayData[day] !== undefined)
      .map((day) => ({ day, revenue: weekdayData[day] }));
  }, [filteredData]);

  // Product revenue by time of day
  const productByTimeOfDay = useMemo(() => {
    const timeOrder = ['Morning', 'Afternoon', 'Night'];
    const products = [...new Set(filteredData.map((r) => r.coffee_name))].sort();
    
    return timeOrder.map((time) => {
      const timeData: Record<string, number | string> = { time };
      products.forEach((product) => {
        timeData[product] = filteredData
          .filter((r) => r.Time_of_Day === time && r.coffee_name === product)
          .reduce((sum, r) => sum + r.money, 0);
      });
      return timeData;
    });
  }, [filteredData]);

  const productNames = useMemo(() => {
    return [...new Set(filteredData.map((r) => r.coffee_name))].sort();
  }, [filteredData]);

  return {
    data: filteredData,
    loading,
    error,
    filters,
    setFilters,
    availableProducts,
    availableTimeOfDay,
    availableWeekdays,
    dateRange,
    kpiData,
    revenueByHour,
    revenueByProduct,
    monthlyRevenue,
    revenueByWeekday,
    productByTimeOfDay,
    productNames,
  };
}

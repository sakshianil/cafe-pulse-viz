import { Coffee, DollarSign, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { useSalesData } from '@/hooks/useSalesData';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { RevenueByHourChart } from '@/components/dashboard/charts/RevenueByHourChart';
import { RevenueByProductChart } from '@/components/dashboard/charts/RevenueByProductChart';
import { MonthlyRevenueChart } from '@/components/dashboard/charts/MonthlyRevenueChart';
import { RevenueByWeekdayChart } from '@/components/dashboard/charts/RevenueByWeekdayChart';
import { ProductByTimeChart } from '@/components/dashboard/charts/ProductByTimeChart';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number) => 
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatHour = (hour: number) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${suffix}`;
};

export default function Index() {
  const {
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
  } = useSalesData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-display font-semibold text-foreground">Error loading data</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Generate insights
  const peakHourInsight = kpiData.peakHour 
    ? `Peak sales occur at ${formatHour(kpiData.peakHour)}, suggesting optimal staffing during this time.`
    : 'Analyzing hourly patterns...';

  const topProduct = revenueByProduct[0];
  const productInsight = topProduct 
    ? `${topProduct.name} leads with ${formatCurrency(topProduct.revenue)} in revenue, representing your strongest product.`
    : 'Analyzing product performance...';

  const highestMonth = monthlyRevenue.reduce((max, m) => m.revenue > max.revenue ? m : max, { month: '', revenue: 0 });
  const monthlyInsight = highestMonth.month 
    ? `${highestMonth.month} shows the highest revenue at ${formatCurrency(highestMonth.revenue)}. Consider promotional campaigns during slower months.`
    : 'Analyzing monthly trends...';

  const highestDay = revenueByWeekday.reduce((max, d) => d.revenue > max.revenue ? d : max, { day: '', revenue: 0 });
  const weekdayInsight = highestDay.day 
    ? `${highestDay.day} is your busiest day. Ensure adequate inventory and staff coverage.`
    : 'Analyzing weekday patterns...';

  const timeOfDayInsight = 'Morning and afternoon drive the majority of sales. Consider special evening promotions to boost night revenue.';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Coffee className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Coffee Shop Analytics</h1>
              <p className="text-sm text-muted-foreground">Sales performance dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {loading ? (
              <div className="filter-panel space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                availableProducts={availableProducts}
                availableTimeOfDay={availableTimeOfDay}
                availableWeekdays={availableWeekdays}
                dateRange={dateRange}
              />
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="kpi-card">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))
              ) : (
                <>
                  <KPICard
                    title="Total Revenue"
                    value={formatCurrency(kpiData.totalRevenue)}
                    icon={DollarSign}
                    delay={0}
                  />
                  <KPICard
                    title="Transactions"
                    value={kpiData.totalTransactions.toLocaleString()}
                    icon={ShoppingCart}
                    delay={50}
                  />
                  <KPICard
                    title="Avg Ticket"
                    value={formatCurrency(kpiData.avgTicketSize)}
                    icon={TrendingUp}
                    delay={100}
                  />
                  <KPICard
                    title="Best Seller"
                    value={kpiData.bestSellingProduct}
                    icon={Coffee}
                    subtitle="By revenue"
                    delay={150}
                  />
                  <KPICard
                    title="Peak Hour"
                    value={formatHour(kpiData.peakHour)}
                    icon={Clock}
                    subtitle="Highest revenue"
                    delay={200}
                  />
                </>
              )}
            </section>

            {/* Charts - Row 1 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <div className="chart-card"><Skeleton className="h-[280px]" /></div>
                  <div className="chart-card"><Skeleton className="h-[280px]" /></div>
                </>
              ) : (
                <>
                  <ChartCard title="Revenue by Hour of Day" insight={peakHourInsight}>
                    <RevenueByHourChart data={revenueByHour} />
                  </ChartCard>
                  <ChartCard title="Revenue by Coffee Product" insight={productInsight}>
                    <RevenueByProductChart data={revenueByProduct} />
                  </ChartCard>
                </>
              )}
            </section>

            {/* Charts - Row 2 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <div className="chart-card"><Skeleton className="h-[280px]" /></div>
                  <div className="chart-card"><Skeleton className="h-[280px]" /></div>
                </>
              ) : (
                <>
                  <ChartCard title="Monthly Revenue Trend" insight={monthlyInsight}>
                    <MonthlyRevenueChart data={monthlyRevenue} />
                  </ChartCard>
                  <ChartCard title="Revenue by Weekday" insight={weekdayInsight}>
                    <RevenueByWeekdayChart data={revenueByWeekday} />
                  </ChartCard>
                </>
              )}
            </section>

            {/* Charts - Row 3 */}
            <section>
              {loading ? (
                <div className="chart-card"><Skeleton className="h-[280px]" /></div>
              ) : (
                <ChartCard title="Product Revenue by Time of Day" insight={timeOfDayInsight}>
                  <ProductByTimeChart data={productByTimeOfDay} productNames={productNames} />
                </ChartCard>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

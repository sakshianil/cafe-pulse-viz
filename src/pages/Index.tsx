import {
  BarChart3,
  CalendarDays,
  Clock,
  Coffee,
  Database,
  DollarSign,
  Download,
  Github,
  LineChart,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
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

const scrollToDashboard = () => {
  document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const topProduct = revenueByProduct[0];
  const highestMonth = monthlyRevenue.reduce((max, m) => (m.revenue > max.revenue ? m : max), {
    month: '',
    revenue: 0,
  });
  const highestDay = revenueByWeekday.reduce((max, d) => (d.revenue > max.revenue ? d : max), {
    day: '',
    revenue: 0,
  });

  const peakHourInsight = kpiData.peakHour
    ? `Peak sales occur at ${formatHour(kpiData.peakHour)}, a useful signal for staffing and prep planning.`
    : 'Analyzing hourly patterns...';

  const productInsight = topProduct
    ? `${topProduct.name} leads with ${formatCurrency(topProduct.revenue)} in revenue across the selected view.`
    : 'Analyzing product performance...';

  const monthlyInsight = highestMonth.month
    ? `${highestMonth.month} shows the highest revenue at ${formatCurrency(highestMonth.revenue)}.`
    : 'Analyzing monthly trends...';

  const weekdayInsight = highestDay.day
    ? `${highestDay.day} is the strongest weekday in the current filter selection.`
    : 'Analyzing weekday patterns...';

  const timeOfDayInsight =
    'Compare product demand by daypart to plan menu pushes, inventory, and team coverage.';

  const samplePeriod =
    dateRange.min && dateRange.max
      ? `${dateRange.min.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.max.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : 'CSV sample';

  const productCount = availableProducts.length || productNames.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Coffee className="h-5 w-5" />
            </span>
            Cafe Pulse Viz
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#overview">
              Overview
            </a>
            <a className="transition-colors hover:text-foreground" href="#insights">
              Insights
            </a>
            <a className="transition-colors hover:text-foreground" href="#dataset">
              Dataset
            </a>
            <a className="transition-colors hover:text-foreground" href="#tech">
              Tech
            </a>
          </nav>
          <button className="showcase-button hidden sm:inline-flex" onClick={scrollToDashboard}>
            View Dashboard
            <LineChart className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main>
        <section id="overview" className="border-b border-border/70">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Cafe sales intelligence, from CSV to <span className="text-primary">decisions.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Interactive dashboard for exploring revenue, product mix, weekday patterns, hourly
                demand, and business-ready cafe insights from a simple sales dataset.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button className="showcase-button" onClick={scrollToDashboard}>
                  View Dashboard
                  <BarChart3 className="h-4 w-4" />
                </button>
                <a className="showcase-link" href="#dataset">
                  Explore the data
                  <Database className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-medium text-foreground shadow-sm transition hover:border-primary/40"
                  href="https://github.com/sakshianil/cafe-pulse-viz"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-4 w-4" />
                  Open source on GitHub
                </a>
                <span className="rounded-full border border-border bg-card px-4 py-2 shadow-sm">
                  React + Recharts + PapaParse
                </span>
              </div>
            </div>

            <div className="dashboard-preview">
              <div className="preview-sidebar">
                <div className="font-display text-lg font-bold">Cafe Pulse Viz</div>
                {['Overview', 'Products', 'Trends', 'Hourly', 'Weekdays'].map((item, index) => (
                  <div key={item} className={index === 0 ? 'preview-nav active' : 'preview-nav'}>
                    {item === 'Overview' && <BarChart3 className="h-4 w-4" />}
                    {item === 'Products' && <ShoppingBag className="h-4 w-4" />}
                    {item === 'Trends' && <TrendingUp className="h-4 w-4" />}
                    {item === 'Hourly' && <Clock className="h-4 w-4" />}
                    {item === 'Weekdays' && <CalendarDays className="h-4 w-4" />}
                    {item}
                  </div>
                ))}
                <Coffee className="mt-auto h-14 w-14 text-primary-foreground/70" />
              </div>
              <div className="preview-main">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Track key metrics and demand patterns</p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {samplePeriod}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <MiniMetric label="Revenue" value={formatCurrency(kpiData.totalRevenue)} />
                  <MiniMetric label="Orders" value={kpiData.totalTransactions.toLocaleString()} />
                  <MiniMetric label="Avg ticket" value={formatCurrency(kpiData.avgTicketSize)} />
                  <MiniMetric label="Products" value={`${productCount || 0}`} />
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <PreviewPanel title="Revenue over time">
                    <div className="preview-line" />
                  </PreviewPanel>
                  <PreviewPanel title="Product mix">
                    <div className="preview-donut" />
                  </PreviewPanel>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <PreviewPanel title="Hourly demand">
                    <div className="preview-bars">
                      {[18, 28, 44, 58, 72, 54, 84, 68, 76, 62, 50, 38, 24].map((height, index) => (
                        <span key={index} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </PreviewPanel>
                  <PreviewPanel title="Top products">
                    <div className="space-y-3">
                      {(revenueByProduct.slice(0, 4).length ? revenueByProduct.slice(0, 4) : [
                        { name: 'Latte', revenue: 2700 },
                        { name: 'Cappuccino', revenue: 2100 },
                        { name: 'Americano', revenue: 1700 },
                        { name: 'Mocha', revenue: 1400 },
                      ]).map((item) => (
                        <div key={item.name} className="grid grid-cols-[1fr_80px] items-center gap-3 text-xs">
                          <span className="truncate font-medium">{item.name}</span>
                          <span className="h-2 rounded-full bg-primary/20">
                            <span className="block h-2 rounded-full bg-primary" style={{ width: '72%' }} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </PreviewPanel>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="border-b border-border/70 bg-card">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-3 lg:px-8">
            <FeatureCard
              icon={BarChart3}
              title="Actionable Insights"
              text="Explore revenue trends, product performance, and customer demand across time."
            />
            <FeatureCard
              icon={Clock}
              title="Time-Based Patterns"
              text="Uncover hourly and weekday patterns to optimize staffing, inventory, and operations."
            />
            <FeatureCard
              icon={Database}
              title="CSV-Powered"
              text="Built for clarity: load a cafe sales CSV and turn everyday records into decisions."
            />
          </div>
        </section>

        <section id="dataset" className="border-b border-border/70">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                From raw data to better cafe decisions
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                Cafe Pulse Viz turns everyday transaction records into clear insight. Identify top
                performers, spot trends early, and make confident decisions around menu, inventory,
                and staffing.
              </p>
              <ul className="mt-7 space-y-4 text-sm font-medium text-foreground">
                {[
                  'Understand what drives revenue',
                  'Optimize menus and promotions',
                  'Plan staffing with demand patterns',
                  'Track progress over time',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="showcase-button mt-8" onClick={scrollToDashboard}>
                Use the dashboard
                <LineChart className="h-4 w-4" />
              </button>
            </div>

            <div className="story-panel">
              <div className="story-photo">
                <div className="story-cup">
                  <Coffee className="h-16 w-16" />
                </div>
                <div className="story-screen">
                  <div className="h-3 w-28 rounded-full bg-primary/30" />
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <span className="h-12 rounded-md bg-primary/20" />
                    <span className="h-12 rounded-md bg-primary/10" />
                    <span className="h-12 rounded-md bg-primary/20" />
                  </div>
                  <div className="mt-5 h-20 rounded-md bg-gradient-to-r from-primary/20 via-accent/30 to-primary/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StoryMetric icon={Coffee} value={`${productCount || 0}`} label="Products" />
                <StoryMetric icon={ShoppingCart} value={kpiData.totalTransactions.toLocaleString()} label="Orders" />
                <StoryMetric icon={CalendarDays} value={samplePeriod.split(' - ')[0] || 'CSV'} label="Starts" />
                <StoryMetric icon={Download} value="CSV" label="Data source" />
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="bg-dashboard py-14">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-4xl font-bold tracking-tight">Interactive dashboard</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Filter by product, time of day, weekday, or date range. Every KPI and chart updates
                  from the same CSV-backed data model.
                </p>
              </div>
              <a
                className="showcase-link self-start md:self-auto"
                href="https://github.com/sakshianil/cafe-pulse-viz/blob/main/public/data/coffee_sales.csv"
                target="_blank"
                rel="noreferrer"
              >
                View CSV
                <Database className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <aside>
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

              <div className="space-y-6">
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="kpi-card">
                        <Skeleton className="mb-2 h-4 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))
                  ) : (
                    <>
                      <KPICard title="Total Revenue" value={formatCurrency(kpiData.totalRevenue)} icon={DollarSign} />
                      <KPICard title="Transactions" value={kpiData.totalTransactions.toLocaleString()} icon={ShoppingCart} delay={50} />
                      <KPICard title="Avg Ticket" value={formatCurrency(kpiData.avgTicketSize)} icon={TrendingUp} delay={100} />
                      <KPICard title="Best Seller" value={kpiData.bestSellingProduct} icon={Coffee} subtitle="By revenue" delay={150} />
                      <KPICard title="Peak Hour" value={formatHour(kpiData.peakHour)} icon={Clock} subtitle="Highest revenue" delay={200} />
                    </>
                  )}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
          </div>
        </section>

        <section id="tech" className="bg-primary py-12 text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
            <div className="flex gap-5">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-primary-foreground/10">
                <LineChart className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Built as a practical analytics portfolio project</h2>
                <p className="mt-2 max-w-3xl text-primary-foreground/80">
                  React, TypeScript, Recharts, Tailwind CSS, shadcn/ui, PapaParse, and a static CSV
                  workflow that can be deployed easily on GitHub Pages or similar static hosting.
                </p>
              </div>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/25 px-5 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
              href="https://github.com/sakshianil/cafe-pulse-viz"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
              <Github className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}

function PreviewPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 h-28">{children}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-card">
      <div className="feature-icon">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}

function StoryMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  month: string;
  revenue: number;
}

interface Props {
  data: DataPoint[];
}

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function MonthlyRevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(25 70% 50%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(25 70% 50%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 88%)" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11, fill: 'hsl(30 10% 45%)' }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(30 20% 88%)' }}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: 'hsl(30 10% 45%)' }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(30 20% 88%)' }}
          width={60}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), 'Revenue']}
          contentStyle={{
            backgroundColor: 'hsl(30 20% 99%)',
            border: '1px solid hsl(30 20% 88%)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px -4px hsl(25 45% 25% / 0.1)',
          }}
          labelStyle={{ color: 'hsl(30 15% 15%)', fontWeight: 600 }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(25 70% 50%)" 
          strokeWidth={2.5}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

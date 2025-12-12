import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  day: string;
  revenue: number;
}

interface Props {
  data: DataPoint[];
}

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function RevenueByWeekdayChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 88%)" vertical={false} />
        <XAxis 
          dataKey="day" 
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
        <Bar 
          dataKey="revenue" 
          fill="hsl(30 40% 55%)" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

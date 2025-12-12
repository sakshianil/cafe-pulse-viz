import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: Record<string, number | string>[];
  productNames: string[];
}

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const COLORS = [
  'hsl(25 45% 35%)',
  'hsl(25 70% 50%)',
  'hsl(30 40% 55%)',
  'hsl(35 55% 65%)',
  'hsl(20 35% 45%)',
  'hsl(30 60% 45%)',
  'hsl(25 50% 40%)',
  'hsl(35 45% 50%)',
  'hsl(28 55% 42%)',
  'hsl(32 48% 58%)',
];

export function ProductByTimeChart({ data, productNames }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 88%)" vertical={false} />
        <XAxis 
          dataKey="time" 
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
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          contentStyle={{
            backgroundColor: 'hsl(30 20% 99%)',
            border: '1px solid hsl(30 20% 88%)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px -4px hsl(25 45% 25% / 0.1)',
          }}
          labelStyle={{ color: 'hsl(30 15% 15%)', fontWeight: 600 }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
        />
        {productNames.map((product, index) => (
          <Bar 
            key={product}
            dataKey={product} 
            stackId="a" 
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint {
  name: string;
  revenue: number;
}

interface Props {
  data: DataPoint[];
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
];

export function RevenueByProductChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 88%)" horizontal={true} vertical={false} />
        <XAxis 
          type="number"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: 'hsl(30 10% 45%)' }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(30 20% 88%)' }}
        />
        <YAxis 
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: 'hsl(30 15% 25%)' }}
          tickLine={false}
          axisLine={false}
          width={75}
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
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

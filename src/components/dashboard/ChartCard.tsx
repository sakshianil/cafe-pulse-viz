import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  insight: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, insight, children, className }: ChartCardProps) {
  return (
    <div className={cn("chart-card", className)}>
      <h3 className="text-lg font-display font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-[280px]">
        {children}
      </div>
      <p className="insight-text">
        💡 {insight}
      </p>
    </div>
  );
}

# Cafe Pulse Viz

Cafe Pulse Viz is a polished React dashboard for exploring cafe sales data from a CSV file. It turns everyday transaction records into clear business views: revenue, order volume, average ticket size, product mix, hourly demand, weekday patterns, and product performance by time of day.

This repository is designed as a portfolio-ready analytics project: it includes a public-facing showcase page, a live interactive dashboard, reusable chart components, filter controls, and a lightweight CSV data workflow.

## Live Project

- GitHub repository: <https://github.com/sakshianil/cafe-pulse-viz>
- Dataset location: [`public/data/coffee_sales.csv`](public/data/coffee_sales.csv)

## What It Shows

- CSV ingestion in the browser with PapaParse
- Derived KPI calculations from transaction-level records
- Interactive filters for date range, product, weekday, and time of day
- Recharts visualizations for revenue, products, weekdays, hours, and daypart mix
- Portfolio-style product presentation with a real dashboard section
- Responsive React UI built with Tailwind CSS and shadcn/ui primitives

## Dashboard Views

The dashboard currently includes:

- Total revenue
- Total transactions
- Average ticket size
- Best-selling product by revenue
- Peak sales hour
- Revenue by hour of day
- Revenue by coffee product
- Monthly revenue trend
- Revenue by weekday
- Product revenue by time of day

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- PapaParse
- Lucide React icons

## Project Structure

```text
.
├── public/
│   └── data/
│       └── coffee_sales.csv
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── charts/
│   │   │   ├── ChartCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── KPICard.tsx
│   │   └── ui/
│   ├── hooks/
│   │   └── useSalesData.ts
│   ├── pages/
│   │   └── Index.tsx
│   ├── types/
│   │   └── sales.ts
│   └── index.css
├── package.json
└── README.md
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Data Workflow

The app reads `public/data/coffee_sales.csv` at runtime. The `useSalesData` hook parses the CSV, filters the records, and derives all dashboard data models in memory.

Key derived outputs:

- KPI summary
- Product revenue ranking
- Hourly revenue
- Monthly revenue
- Weekday revenue
- Product revenue by time of day

## Portfolio Skills Demonstrated

- Frontend product design and responsive UI implementation
- React component composition and state-driven filtering
- Browser-side CSV parsing and data transformation
- Dashboard analytics and KPI modeling
- Chart design with Recharts
- Tailwind-based design system refinement
- Clear project documentation for recruiters and reviewers

## Notes

This project is intentionally lightweight: it does not require a backend, database, or authentication. It is suitable for static deployment and can be adapted to other small business datasets by replacing the CSV and mapping the relevant fields.

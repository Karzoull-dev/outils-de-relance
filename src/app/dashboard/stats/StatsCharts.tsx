"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint, StatusSlice } from "@/lib/stats";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const tooltipStyle = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--ink)",
};

export function RevenueChart({
  data,
  currency,
  locale,
}: {
  data: RevenuePoint[];
  currency: string;
  locale: Locale;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) =>
            new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
              style: "currency",
              currency,
            }).format(Number(value))
          }
        />
        <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data, locale }: { data: StatusSlice[]; locale: Locale }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const t = getDictionary(locale);

  if (total === 0) {
    return (
      <div className="flex h-65 items-center justify-center text-sm text-muted">
        {t.stats.noInvoicesYet}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-muted">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

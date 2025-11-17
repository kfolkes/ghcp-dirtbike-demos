/**
 * BarChart Component
 * Lightweight SVG-based bar chart for top products
 */

import React, { useMemo } from 'react';
import type { Product } from '../../types/admin';
import { formatCurrency } from '../../data/mockAdminData';

interface BarChartProps {
  data: Product[];
  title: string;
  ariaLabel?: string;
  height?: number;
}

/**
 * Simple bar chart visualization using SVG
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  ariaLabel,
  height = 300,
}) => {
  const { maxValue, barWidth, chartData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, barWidth: 0, chartData: [] };
    }

    const padding = 50;
    const width = 500;
    const chartHeight = height - 2 * padding;

    // Find max revenue for scaling
    const maxRevenue = Math.max(...data.map((d) => d.revenue));
    const maxValue = Math.ceil(maxRevenue / 50000) * 50000;

    // Calculate bar positions
    const barSpacing = (width - 2 * padding) / data.length;
    const barWidth = barSpacing * 0.6;

    const chartData = data.map((d, i) => {
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
      const barHeight = (d.revenue / maxValue) * chartHeight;
      const y = padding + chartHeight - barHeight;

      return {
        ...d,
        x,
        y,
        barHeight,
      };
    });

    return { maxValue, barWidth, chartData };
  }, [data, height]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const padding = 50;
  const width = 500;
  const chartHeight = height - 2 * padding;

  return (
    <article
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      aria-label={ariaLabel || title}
      role="region"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel || `${title} chart`}
        className="mx-auto"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + (1 - ratio) * chartHeight;
          return (
            <line
              key={`grid-${ratio}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = Math.round(ratio * maxValue);
          const y = padding + (1 - ratio) * chartHeight;
          return (
            <text
              key={`label-${ratio}`}
              x={padding - 10}
              y={y}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-600"
            >
              ${(value / 1000).toFixed(0)}k
            </text>
          );
        })}

        {/* X-axis */}
        <line
          x1={padding}
          y1={padding + chartHeight}
          x2={width - padding}
          y2={padding + chartHeight}
          stroke="#d1d5db"
          strokeWidth="2"
        />

        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="#d1d5db" strokeWidth="2" />

        {/* Bars */}
        {chartData.map((item, i) => (
          <g key={`bar-${i}`}>
            <rect
              x={item.x}
              y={item.y}
              width={barWidth}
              height={item.barHeight}
              fill="#10b981"
              rx="4"
              className="hover:opacity-80 transition-opacity"
            />
            {/* Value label on top of bar */}
            <text
              x={item.x + barWidth / 2}
              y={item.y - 5}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              ${(item.revenue / 1000).toFixed(0)}k
            </text>
          </g>
        ))}

        {/* X-axis labels (product names) */}
        {chartData.map((item, i) => {
          const truncatedName = item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name;
          return (
            <text
              key={`x-label-${i}`}
              x={item.x + barWidth / 2}
              y={padding + chartHeight + 25}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {truncatedName}
            </text>
          );
        })}
      </svg>

      {/* Data table for accessibility */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">View data as table</summary>
        <table className="mt-2 w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-1 text-left">Product</th>
              <th className="border border-gray-200 px-2 py-1 text-right">Units Sold</th>
              <th className="border border-gray-200 px-2 py-1 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-1">{d.name}</td>
                <td className="border border-gray-200 px-2 py-1 text-right">{d.unitsSold}</td>
                <td className="border border-gray-200 px-2 py-1 text-right">{formatCurrency(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </article>
  );
};

export default BarChart;

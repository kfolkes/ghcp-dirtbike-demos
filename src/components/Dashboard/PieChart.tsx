/**
 * PieChart Component
 * Lightweight SVG-based pie chart for category distribution
 */

import React, { useMemo } from 'react';
import type { CategoryMetrics } from '../../types/admin';

interface PieChartProps {
  data: CategoryMetrics[];
  title: string;
  ariaLabel?: string;
}

interface PieSlice extends CategoryMetrics {
  startAngle: number;
  endAngle: number;
  pathData: string;
}

/**
 * Simple pie chart visualization using SVG
 */
const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  ariaLabel,
}) => {
  const slices = useMemo((): PieSlice[] => {
    if (!data || data.length === 0) return [];

    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let startAngle = -Math.PI / 2; // Start from top

    return data.map((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Calculate SVG arc path
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const result: PieSlice = {
        ...item,
        startAngle,
        endAngle,
        pathData,
      };

      startAngle = endAngle;
      return result;
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <article
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      aria-label={ariaLabel || title}
      role="region"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* SVG Chart */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          role="img"
          aria-label={ariaLabel || `${title} chart`}
        >
          {slices.map((slice, index) => (
            <path
              key={`slice-${index}`}
              d={slice.pathData}
              fill={colors[index % colors.length]}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity"
              aria-label={`${slice.name}: ${slice.percentage}%`}
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="space-y-2">
          {slices.map((slice, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700">
                {slice.name}: {slice.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data table for accessibility */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900">View data as table</summary>
        <table className="mt-2 w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-1 text-left">Category</th>
              <th className="border border-gray-200 px-2 py-1 text-right">Units</th>
              <th className="border border-gray-200 px-2 py-1 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-1">{d.name}</td>
                <td className="border border-gray-200 px-2 py-1 text-right">{d.value}</td>
                <td className="border border-gray-200 px-2 py-1 text-right">{d.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </article>
  );
};

export default PieChart;

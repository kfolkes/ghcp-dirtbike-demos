/**
 * AreaChart Component
 * Lightweight SVG-based area chart for order frequency
 */

import React, { useMemo } from 'react';
import type { OrderMetrics } from '../../types/admin';

interface AreaChartProps {
  data: OrderMetrics[];
  title: string;
  ariaLabel?: string;
  height?: number;
}

/**
 * Simple area chart visualization using SVG
 */
const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  ariaLabel,
  height = 300,
}) => {
  const { maxValue, points, pathData, areaPath } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, points: [], pathData: '', areaPath: '' };
    }

    const padding = 40;
    const width = 500;
    const chartHeight = height - 2 * padding;

    // Find max value for scaling
    const maxCount = Math.max(...data.map((d) => d.count));
    const maxValue = Math.ceil(maxCount / 5) * 5;

    // Calculate points
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = padding + chartHeight - (d.count / maxValue) * chartHeight;
      return { x, y, value: d.count };
    });

    // Create SVG path for line
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Create SVG path for area (fill under curve)
    const areaPath = [
      pathData,
      `L ${points[points.length - 1].x} ${padding + chartHeight}`,
      `L ${points[0].x} ${padding + chartHeight}`,
      'Z',
    ].join(' ');

    return { maxValue, points, pathData, areaPath };
  }, [data, height]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const padding = 40;
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
              {value}
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

        {/* Area fill */}
        <path
          d={areaPath}
          fill="#a78bfa"
          opacity="0.3"
        />

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="#a78bfa" />
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
          return (
            <text
              key={`x-label-${i}`}
              x={x}
              y={padding + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {d.date}
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
              <th className="border border-gray-200 px-2 py-1 text-left">Day</th>
              <th className="border border-gray-200 px-2 py-1 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-1">{d.date}</td>
                <td className="border border-gray-200 px-2 py-1 text-right">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </article>
  );
};

export default AreaChart;

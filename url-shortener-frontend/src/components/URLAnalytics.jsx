
import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#10b981'];

const URLAnalytics = ({ analytics }) => {
  const deviceData = [
    { name: 'Desktop', value: analytics.deviceType?.desktop || 0 },
    { name: 'Mobile', value: analytics.deviceType?.mobile || 0 },
    { name: 'Tablet', value: analytics.deviceType?.tablet || 0 }
  ];

  const timeSeriesData = analytics.timeSeries || [];

  const topReferrers = Object.entries(analytics.referrers || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
    console.log('Analytics Data:', analytics);

  return (
    <div className="mt-4 space-y-6">
      {/* Pie Chart */}
      <div>
        <h3 className="text-sm font-semibold text-orange-300 mb-2">Device Type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="text-sm font-semibold text-orange-300 mb-2">Visits Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={timeSeriesData}>
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Referrers Table */}
      <div>
        <h3 className="text-sm font-semibold text-orange-300 mb-2">Top Referrers</h3>
        <table className="w-full text-sm text-gray-200 border-collapse">
          <thead>
            <tr>
              <th className="text-left border-b border-white/10 py-1">Referrer</th>
              <th className="text-left border-b border-white/10 py-1">Visits</th>
            </tr>
          </thead>
          <tbody>
            {topReferrers.map((ref, index) => (
              <tr key={index}>
                <td className="py-1">{ref.source || 'Direct/None'}</td>
                <td className="py-1">{ref.count}</td>
              </tr>
            ))}
            {topReferrers.length === 0 && (
              <tr>
                <td colSpan="2" className="py-1 text-gray-500">No referrer data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default URLAnalytics;

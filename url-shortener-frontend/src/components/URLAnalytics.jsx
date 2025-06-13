import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const URLAnalytics = ({ analytics }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeChart, setActiveChart] = useState("devices");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const deviceData = [
    { name: "Desktop", value: analytics.deviceType?.desktop || 0, icon: "💻" },
    { name: "Mobile", value: analytics.deviceType?.mobile || 0, icon: "📱" },
    { name: "Tablet", value: analytics.deviceType?.tablet || 0, icon: "📟" },
  ].filter((item) => item.value > 0);

  const timeSeriesData = analytics.timeSeries || [];
  const totalClicks = timeSeriesData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  const topReferrers = Object.entries(analytics.referrers || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({
      source,
      count,
      percentage:
        totalClicks > 0 ? ((count / totalClicks) * 100).toFixed(1) : 0,
    }));

  const StatCard = ({ title, value, icon, gradient, delay = 0 }) => (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-2xl font-bold tracking-tight">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
        {title}
      </h3>
      {children}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-medium">{`${label}`}</p>
          <p className="text-blue-400">{`Clicks: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`space-y-8 transform transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clicks"
          value={totalClicks}
          icon="📊"
          gradient="from-blue-600 to-blue-800"
          delay={0}
        />
        <StatCard
          title="Unique Visitors"
          value={deviceData.reduce((sum, device) => sum + device.value, 0)}
          icon="👥"
          gradient="from-purple-600 to-purple-800"
          delay={100}
        />
        <StatCard
          title="Top Device"
          value={deviceData[0]?.name || "N/A"}
          icon={deviceData[0]?.icon || "🔍"}
          gradient="from-emerald-600 to-emerald-800"
          delay={200}
        />
        <StatCard
          title="Referrer Sources"
          value={topReferrers.length}
          icon="🔗"
          gradient="from-orange-600 to-orange-800"
          delay={300}
        />
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-slate-900/30 rounded-2xl backdrop-blur-sm border border-white/10">
        {["devices", "timeline", "referrers"].map((chart) => (
          <button
            key={chart}
            onClick={() => setActiveChart(chart)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeChart === chart
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {chart.charAt(0).toUpperCase() + chart.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <ChartCard
          title="Device Distribution"
          className={`transition-all duration-500 ${
            activeChart === "devices" ? "xl:col-span-2 scale-105" : ""
          }`}
        >
          {deviceData.length > 0 ? (
            <div className="space-y-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {deviceData.map((device, index) => (
                  <div
                    key={device.name}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="text-white font-medium">{device.name}</p>
                      <p className="text-white/60 text-sm">
                        {device.value} clicks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p>No device data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Click Timeline"
          className={`transition-all duration-500 ${
            activeChart === "timeline" ? "xl:col-span-2 scale-105" : ""
          }`}
        >
          {timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#fff"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  className="hover:stroke-blue-400 transition-colors duration-300"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>No timeline data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Top Referrers"
          className={`transition-all duration-500 ${
            activeChart === "referrers" ? "xl:col-span-2 scale-105" : ""
          }`}
        >
          {topReferrers.length > 0 ? (
            <div className="space-y-4">
              {topReferrers.map((ref, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 border border-white/10 hover:border-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                        {ref.source || "Direct/None"}
                      </p>
                      <p className="text-white/60 text-sm">
                        {ref.percentage}% of total traffic
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{ref.count}</p>
                    <p className="text-white/60 text-sm">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <p>No referrer data available</p>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {!isVisible && (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin animate-reverse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLAnalytics;

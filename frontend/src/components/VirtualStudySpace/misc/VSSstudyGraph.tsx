import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VSSstudyGraph() {
  const weeklyStudyData = [
    { name: "1 day ago", study_hour: 100 },
    { name: "2 days ago", study_hour: 50 },
    { name: "3 days ago", study_hour: 70 },
    { name: "4 days ago", study_hour: 20 },
    { name: "5 days ago", study_hour: 40 },
    { name: "6 days ago", study_hour: 90 },
    { name: "7 days ago", study_hour: 140 },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart
          data={weeklyStudyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "Minutes",
              angle: 0,
              position: "top",
              offset: 10,
              style: { fontSize: 14 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#8884d8",
              borderColor: "#8884d8",
            }}
            cursor={{ stroke: "#0000FF", strokeWidth: 2 }}
            formatter={(value) => `Study time: ${value} minutes`}
            labelFormatter={() => null} // Prevents the label from being displayed
          />
          <Line
            type="monotone"
            dataKey="study_hour"
            stroke="#8884d8"
            dot={{ fill: "#ff7300", r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

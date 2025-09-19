import React, { useState } from "react";
import dayjs from "dayjs";
import RoundedReport from "./components/RoundedReport.jsx";
import ActivityLog from "./components/ActivityLog.jsx";
import Matters from "./components/Matters.jsx"; // 👈 new import

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [zoom, setZoom] = useState("6 min");

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Zoom:</label>
          <select
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option>1 min</option>
            <option>5 min</option>
            <option>6 min</option>
            <option>15 min</option>
            <option>30 min</option>
            <option>Hours</option>
          </select>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        {/* Left: Day in Review */}
        <div className="w-1/4 flex flex-col bg-white rounded-xl shadow-md">
          <h2 className="px-4 py-2 font-semibold text-gray-700 border-b bg-gray-50 rounded-t-xl">
            Day in Review
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            <RoundedReport date={selectedDate} zoom={zoom} />
          </div>
        </div>

        {/* Middle: Time Entries */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md">
          <h2 className="px-4 py-2 font-semibold text-gray-700 border-b bg-gray-50 rounded-t-xl">
            Time Entries
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            <ActivityLog date={selectedDate} zoom={zoom} />
          </div>
        </div>

        {/* Right: Matters */}
        <div className="w-1/4 flex flex-col bg-white rounded-xl shadow-md">
          <h2 className="px-4 py-2 font-semibold text-gray-700 border-b bg-gray-50 rounded-t-xl">
            Matters
          </h2>
          <div className="flex-1 overflow-y-auto p-4">
            <Matters />
          </div>
        </div>
      </div>
    </div>
  );
}

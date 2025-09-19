import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { normalizeAppName } from "../lib/appNames";
import { useSortableData } from "../lib/useSortableData";

function mmss(totalSeconds = 0) {
  const s = Math.max(0, totalSeconds | 0);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function to12Hour(ts) {
  return dayjs(ts).format("hh:mm:ss A");
}

export default function ActivityLog({ date }) {
  const [sessions, setSessions] = useState([]);
  const { items, requestSort, sortConfig } = useSortableData(sessions);

  useEffect(() => {
    (async () => {
      const start = dayjs(date).startOf("day").toISOString();
      const end = dayjs(date).endOf("day").toISOString();
      const data = await window.qadence.sessionsBetween(start, end);
      setSessions(Array.isArray(data) ? data : []);
    })();
  }, [date]);

  const getArrow = (name) =>
    sortConfig?.key === name ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white shadow-sm">
          <tr className="text-gray-700 border-b">
            <th className="py-2 px-2 text-left cursor-pointer" onClick={() => requestSort("app")}>
              App{getArrow("app")}
            </th>
            <th className="py-2 px-2 text-left cursor-pointer" onClick={() => requestSort("title")}>
              Title{getArrow("title")}
            </th>
            <th className="py-2 px-2 text-center cursor-pointer w-[110px]" onClick={() => requestSort("start")}>
              Start{getArrow("start")}
            </th>
            <th className="py-2 px-2 text-center cursor-pointer w-[110px]" onClick={() => requestSort("end")}>
              End{getArrow("end")}
            </th>
            <th className="py-2 px-2 text-center cursor-pointer w-[90px]" onClick={() => requestSort("duration")}>
              Duration{getArrow("duration")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((s, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="py-2 px-2 font-medium text-gray-900">{normalizeAppName(s.app)}</td>
              <td className="py-2 px-2 truncate max-w-[240px]" title={s.title}>
                {s.title}
              </td>
              <td className="py-2 px-2 text-center font-mono">{to12Hour(s.start)}</td>
              <td className="py-2 px-2 text-center font-mono">{to12Hour(s.end)}</td>
              <td className="py-2 px-2 text-center font-mono">{mmss(s.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

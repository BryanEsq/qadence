import React, { useEffect, useState } from "react";
import { normalizeAppName } from "../lib/appNames";
import { useSortableData } from "../lib/useSortableData";

function mmss(totalSeconds = 0) {
  const s = Math.max(0, totalSeconds | 0);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function RoundedReport({ date }) {
  const [entries, setEntries] = useState([]);
  const { items, requestSort, sortConfig } = useSortableData(entries);

  useEffect(() => {
    (async () => {
      const data = await window.qadence.round(date, "day");
      setEntries(Array.isArray(data?.entries) ? data.entries : []);
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
            <th className="py-2 px-2 text-center cursor-pointer w-[90px]" onClick={() => requestSort("seconds")}>
              Duration{getArrow("seconds")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((e, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="py-2 px-2 font-medium text-gray-900">{normalizeAppName(e.app)}</td>
              <td className="py-2 px-2 truncate max-w-[200px]" title={e.title}>
                {e.title}
              </td>
              <td className="py-2 px-2 text-center font-mono">{mmss(e.seconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

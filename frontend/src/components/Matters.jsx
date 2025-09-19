import React, { useEffect, useState } from "react";
import { useSortableData } from "../lib/useSortableData";

export default function Matters() {
  const [matters, setMatters] = useState([]);
  const { items, requestSort, sortConfig } = useSortableData(matters);

  useEffect(() => {
    setMatters([
      { client: "Client A", matter: "Contract Review", hours: 2.5 },
      { client: "Client B", matter: "Litigation", hours: 1.2 },
      { client: "Client C", matter: "Estate Planning", hours: 3.0 },
      { client: "Client D", matter: "Personal Injury", hours: 0.8 },
    ]);
  }, []);

  const getArrow = (name) =>
    sortConfig?.key === name ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white shadow-sm">
          <tr className="text-gray-700 border-b">
            <th className="py-2 px-2 text-left cursor-pointer" onClick={() => requestSort("client")}>
              Client{getArrow("client")}
            </th>
            <th className="py-2 px-2 text-left cursor-pointer" onClick={() => requestSort("matter")}>
              Matter{getArrow("matter")}
            </th>
            <th className="py-2 px-2 text-center cursor-pointer w-[80px]" onClick={() => requestSort("hours")}>
              Hours{getArrow("hours")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((m, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="py-2 px-2 font-medium text-gray-900">{m.client}</td>
              <td className="py-2 px-2 truncate max-w-[200px]" title={m.matter}>
                {m.matter}
              </td>
              <td className="py-2 px-2 text-center font-mono">{m.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

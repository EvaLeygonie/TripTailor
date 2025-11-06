// components/BudgetView.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { TripsContext } from "../context/TripsContext";

// Svensk kommentar: BudgetView med textinputs istället för number inputs
// så att användaren skriver belopp direkt utan upp-/nedpilar.

export default function BudgetView({ trip }) {
  const {
    trips,
    addBreakdownItem,
    setBreakdownValue,
    renameBreakdownCategory,
    removeBreakdownItem,
    getTripSpent,
    setPlannedTotal,
  } = useContext(TripsContext);

  // ✅ Hämta alltid aktuell version av resan
  const liveTrip = useMemo(
    () => trips.find((t) => t.id === trip?.id) || trip,
    [trips, trip?.id]
  );

  const plannedTotal = liveTrip?.budget?.total ?? 0;
  const breakdown = liveTrip?.budget?.breakdown || {};
  const spent = useMemo(() => getTripSpent(liveTrip), [liveTrip, getTripSpent]);
  const remaining = Math.max(plannedTotal - spent, 0);

  // --- Planned total (redigerbar) ---
  const [plannedTotalDraft, setPlannedTotalDraft] = useState(
    String(plannedTotal)
  );
  useEffect(() => {
    setPlannedTotalDraft(String(plannedTotal));
  }, [plannedTotal]);

  function savePlannedTotal() {
    const value = plannedTotalDraft.replace(",", ".");
    setPlannedTotal(liveTrip.id, value);
  }

  // --- State cho inline-edit breakdown ---
  const [edits, setEdits] = useState({});
  useEffect(() => {
    const next = Object.fromEntries(
      Object.entries(breakdown).map(([k, v]) => [
        k,
        { key: k, amount: String(v) },
      ])
    );
    setEdits(next);
  }, [liveTrip?.id, JSON.stringify(breakdown)]);

  function saveEdit(oldKey) {
    const row = edits[oldKey];
    if (!row) return;

    const newKey = (row.key || "").trim();
    const amountNum = Number((row.amount || "").replace(",", ".")) || 0;

    if (newKey && newKey !== oldKey) {
      renameBreakdownCategory(liveTrip.id, oldKey, newKey);
    }
    const targetKey = newKey || oldKey;
    setBreakdownValue(liveTrip.id, targetKey, amountNum);
  }

  // --- Thêm dòng mới ---
  const [newRow, setNewRow] = useState({ category: "", amount: "" });
  function addRow() {
    const cat = newRow.category.trim();
    const amt = Number((newRow.amount || "").replace(",", ".")) || 0;
    if (!cat) return;
    addBreakdownItem(liveTrip.id, cat, amt);
    setNewRow({ category: "", amount: "" });
  }

  return (
    <div className="budget-view p-4 space-y-6">
      <h3 className="text-xl font-semibold">Budget</h3>

      {/* Planned total + Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Planned total (redigerbar utan spinner) */}
        <div className="rounded-xl border p-4 space-y-2">
          <p className="text-sm text-gray-500">Planned total</p>
          <div className="flex items-center gap-2">
            <span>Kr</span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              className="border rounded p-2 w-full"
              placeholder="0"
              value={plannedTotalDraft}
              onChange={(e) =>
                setPlannedTotalDraft(e.target.value.replace(",", "."))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") savePlannedTotal();
              }}
            />
            <button
              type="button"
              className="px-2 py-1 border rounded"
              onClick={savePlannedTotal}
            >
              Save
            </button>
          </div>
        </div>

        <SummaryCard title="Spent" value={spent} />
        <SummaryCard title="Remaining" value={remaining} />
      </div>

      {/* Breakdown editable */}
      <div>
        <h4 className="font-medium mb-2">Costs</h4>

        <ul className="rounded-xl border divide-y">
          {Object.entries(breakdown).length === 0 && (
            <li className="px-3 py-3 text-gray-500">
              No items yet — add below.
            </li>
          )}

          {Object.entries(breakdown).map(([key, val]) => (
            <li
              key={key}
              className="px-3 py-2 grid grid-cols-12 gap-2 items-center"
            >
              {/* Category (editable) */}
              <input
                className="col-span-5 border rounded p-2"
                value={edits[key]?.key ?? key}
                onChange={(e) =>
                  setEdits((prev) => ({
                    ...prev,
                    [key]: { ...(prev[key] || {}), key: e.target.value },
                  }))
                }
              />

              {/* Amount (editable text, utan spinner) */}
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                className="col-span-3 border rounded p-2"
                value={edits[key]?.amount ?? String(val)}
                onChange={(e) =>
                  setEdits((prev) => ({
                    ...prev,
                    [key]: {
                      ...(prev[key] || {}),
                      amount: e.target.value.replace(",", "."),
                    },
                  }))
                }
              />
              <span className="col-span-1 text-sm">Kr</span>

              <div className="col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-2 py-1 border rounded"
                  onClick={() => saveEdit(key)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-2 py-1 border rounded text-red-600"
                  onClick={() => removeBreakdownItem(liveTrip.id, key)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}

          {/* Add new row */}
          <li className="px-3 py-2 grid grid-cols-12 gap-2 items-center bg-gray-50">
            <input
              className="col-span-5 border rounded p-2"
              placeholder="New category (e.g. souvenirs)"
              value={newRow.category}
              onChange={(e) =>
                setNewRow((r) => ({ ...r, category: e.target.value }))
              }
            />
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              className="col-span-3 border rounded p-2"
              placeholder="0"
              value={newRow.amount}
              onChange={(e) =>
                setNewRow((r) => ({
                  ...r,
                  amount: e.target.value.replace(",", "."),
                }))
              }
            />
            <span className="col-span-1 text-sm">Kr</span>
            <div className="col-span-3 flex justify-end">
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={addRow}
              >
                Add
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">Kr {Number(value || 0).toFixed(2)}</p>
    </div>
  );
}

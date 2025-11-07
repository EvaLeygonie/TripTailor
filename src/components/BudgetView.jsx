import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TripsContext } from "../context/TripsContext";

// Formatter för valuta
const money = (n) =>
  (n ?? 0).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/15 last:border-0">
      <div className="opacity-90">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-gray-100 border border-gray-200"
      style={{ lineHeight: 1.8 }}
    >
      {children}
    </span>
  );
}

export default function BudgetView() {
  const { id } = useParams();
  const {
    trips,
    addExpense,
    editExpense,
    removeExpense,
    setBudgetTotal,
    setExpensePaid,
  } = useContext(TripsContext);

  // Hämta resa (fallback: första om id saknas)
  const trip = trips.find((t) => t.id === id) || trips[0];
  const status = trip?.tripStatus || "planned";
  const total = trip?.budget?.total ?? 0;
  const expenses = trip?.budget?.expenses ?? [];

  // Spent: planned → 0, annars summera expense.isPaid
  const spent = useMemo(() => {
    if (status === "planned") return 0;
    return (expenses || [])
      .filter((e) => e.isPaid)
      .reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [expenses, status]);

  const remaining = Math.max(0, total - spent);

  // Total Budget input (draft + save)
  const [draftTotal, setDraftTotal] = useState(total);

  // Modal: Add Expense
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Transport");

  function saveExpense(e) {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    addExpense(trip.id, {
      title: title.trim(),
      amount: Number(amount),
      category,
      isPaid: false,
    });
    setTitle("");
    setAmount("");
    setCategory("Transport");
    setOpen(false);
  }

  // Modal: Edit Expense
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("Transport");

  function startEdit(expense) {
    setEditId(expense.id);
    setEditTitle(expense.title);
    setEditAmount(String(expense.amount ?? ""));
    setEditCategory(expense.category || "Transport");
    setEditOpen(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editId) return;
    editExpense(trip.id, editId, {
      title: editTitle.trim(),
      amount: Number(editAmount || 0),
      category: editCategory,
    });
    setEditOpen(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Budget Overview</h2>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg px-4 py-2 text-white font-medium"
          style={{ background: "#2563eb" }}
        >
          + Add Expense
        </button>
      </div>

      {/* Summary kort: redigerbart Total Budget */}
      <div
        className="rounded-xl p-6 text-white mb-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(59,130,246,1) 50%, rgba(14,165,233,1) 100%)",
        }}
      >
        {/* Total Budget */}
        <div className="flex items-center justify-between py-3 border-b border-white/15">
          <div className="opacity-90">Total Budget</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              className="w-36 rounded-lg px-2 py-1 text-right font-semibold text-blue-900"
              value={draftTotal}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d.,]/g, "");
                setDraftTotal(raw);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const normalized = String(draftTotal).replace(",", ".");
                  setBudgetTotal(trip.id, Number(normalized) || 0);
                }
              }}
              placeholder="0"
            />
            <button
              className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
              onClick={() => {
                const normalized = String(draftTotal).replace(",", ".");
                setBudgetTotal(trip.id, Number(normalized) || 0);
              }}
            >
              Save
            </button>
          </div>
        </div>

        <Row label="Spent" value={money(spent)} />
        <Row label="Remaining" value={money(remaining)} />
      </div>

      {/* Expenses */}
      <h3 className="text-lg font-semibold mb-3">Expenses</h3>
      <div className="space-y-4">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-between"
          >
            <div>
              <div className="text-base font-medium">{e.title}</div>
              <div className="mt-2">
                <Badge>{e.category || "Other"}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Checkbox Paid: disabled om planned */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!e.isPaid}
                  disabled={status === "planned"}
                  onChange={(ev) =>
                    setExpensePaid(trip.id, e.id, ev.target.checked)
                  }
                />
                <span className={e.isPaid ? "text-green-600" : "text-gray-500"}>
                  {e.isPaid ? "Paid" : "Pending"}
                </span>
              </label>

              <div className="text-base font-semibold">{money(e.amount)}</div>

              <button
                onClick={() => startEdit(e)}
                className="text-sm underline text-gray-500 hover:text-gray-800"
              >
                Edit
              </button>

              <button
                onClick={() => removeExpense(trip.id, e.id)}
                className="text-sm underline text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-gray-500 text-center">
            No expenses yet. Click <b>Add Expense</b> to get started.
          </div>
        )}
      </div>

      {/* Modal: Add Expense */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Add Expense</h4>
              <button onClick={() => setOpen(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <form onSubmit={saveExpense} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flight tickets"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount (SEK)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="800"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Transport</option>
                  <option>Accommodation</option>
                  <option>Food & Drinks</option>
                  <option>Activities</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ background: "#2563eb" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Expense */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Edit Expense</h4>
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Flight tickets"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="800"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option>Transport</option>
                  <option>Accommodation</option>
                  <option>Food & Drinks</option>
                  <option>Activities</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ background: "#2563eb" }}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

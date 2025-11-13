import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TripsContext } from "../context/TripsContext";
import { Trash2, Edit, Plus } from "lucide-react";

const money = (n) =>
  (n ?? 0).toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/15 last:border-0">
      <div className="opacity-90 text-sm sm:text-base">{label}</div>
      <div className="text-lg sm:text-xl font-semibold">{value}</div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-block rounded-full px-3 py-1 text-xs sm:text-sm font-medium bg-gray-100 border border-gray-200">
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

  const trip = trips.find((t) => t.id === id) || trips[0];
  const total = trip?.budget?.total ?? 0;
  const expenses = trip?.budget?.expenses ?? [];

  const spent = useMemo(() => {
    return (expenses || [])
      .filter((e) => e.isPaid)
      .reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [expenses]);

  const remaining = Math.max(0, total - spent);
  const [draftTotal, setDraftTotal] = useState(String(total));

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
    <div className="bg-gray-50 rounded-xl shadow-lg p-4 sm:p-6 mt-6 w-full">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl sm:text-2xl font-semibold">Budget Overview</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-50 text-violet-600 flex items-center justify-center p-2 rounded-md border hover:bg-violet-50 hover:text-violet-700 transition-all duration-200 ease-in-out"
        >
          <Plus size={30} strokeWidth={3} className="text-fuchsia-900 group-hover:text-white transition duration-200" />
        </button>
      </div>

      {/* Summary */}
      <div
        className="relative rounded-2xl p-5 sm:p-6 text-white mb-8 overflow-hidden shadow-[0_8px_30px_rgba(88,28,135,0.45)]"
        style={{
          background:
            "linear-gradient(135deg,rgba(110,30,90,1) 0%,rgba(100,25,160,1) 45%,rgba(40,60,170,1) 100%)",
        }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5 opacity-40 mix-blend-overlay pointer-events-none" />

        {/* Subtil highlight längst upp */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/10 blur-2xl opacity-40 pointer-events-none" />

        <div className="flex items-center justify-between py-3 border-b border-white/15">
          <div className="opacity-90 text-sm sm:text-base">Total Budget</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              className="w-28 sm:w-36 rounded-lg px-2 py-1 text-right font-semibold text-violet-700"
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
              className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition"
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
      <h3 className="text-lg sm:text-xl font-semibold mb-3">Expenses</h3>
      <div className="space-y-4">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="text-base font-medium">{e.title}</div>
              <div className="mt-2">
                <Badge>{e.category || "Other"}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!e.isPaid}
                  // disabled={status === "planned"}
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
                className="p-1 rounded-full border-transparent text-gray-800 hover:text-purple-600 transition duration-150"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-1 rounded-full border border-transparent text-red-400 hover:text-red-500 hover:border-red-500 transition duration-150"
                onClick={() => removeExpense(trip.id, e.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 sm:p-8 text-gray-500 text-center text-sm sm:text-base">
            No expenses yet. Click <b>Add Expense</b> to get started.
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {open && (
        <Modal
          title="Add Expense"
          onClose={() => setOpen(false)}
          onSubmit={saveExpense}
          titleValue={title}
          setTitle={setTitle}
          amountValue={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
        />
      )}

      {/* Edit Expense Modal */}
      {editOpen && (
        <Modal
          title="Edit Expense"
          onClose={() => setEditOpen(false)}
          onSubmit={saveEdit}
          titleValue={editTitle}
          setTitle={setEditTitle}
          amountValue={editAmount}
          setAmount={setEditAmount}
          category={editCategory}
          setCategory={setEditCategory}
          isEdit
        />
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  onSubmit,
  titleValue,
  setTitle,
  amountValue,
  setAmount,
  category,
  setCategory,
  isEdit = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={titleValue}
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
              value={amountValue}
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-medium bg-violet-600 hover:bg-violet-700 transition"
            >
              {isEdit ? "Save changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Plus, Edit, Trash2, X } from "lucide-react";
import { useParams } from "react-router-dom";
import tripsData from "../data/mockTrips.jsx";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PackingList() {
  const { id } = useParams();
  const trip = tripsData.find((t) => t.id === id);

  const LS_key = `packing_${trip?.id || "unknown"}`;

  // State
  const [packing, setPacking] = useState(() => {
    const saved = localStorage.getItem(LS_key);
    if (saved) return JSON.parse(saved);
    if (trip && Array.isArray(trip.packingList)) return trip.packingList;
    return [];
  });

  // Modal ADD
  const [showForm, setShowForm] = useState(false);
  const [categoryMode, setCategoryMode] = useState("existing");
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const firstFieldRef = useRef(null);

  // Modal EDIT
  const [showEdit, setShowEdit] = useState(false);
  const [editOriginalCategory, setEditOriginalCategory] = useState("");
  const [editOriginalLabel, setEditOriginalLabel] = useState("");
  const [editMode, setEditMode] = useState("existing"); // "existing" | "new"
  const [editCategory, setEditCategory] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const editFirstFieldRef = useRef(null);

  // ModalDELETE
  const [showDelete, setShowDelete] = useState(false);
  const [delCategory, setDelCategory] = useState("");
  const [delLabel, setDelLabel] = useState("");
  const [alsoRemoveEmptyCategory, setAlsoRemoveEmptyCategory] = useState(true);

  // Autofokus fill första fältet när modal öppnas
  useEffect(() => {
    if (showForm && firstFieldRef.current) firstFieldRef.current.focus();
  }, [showForm]);
  useEffect(() => {
    if (showEdit && editFirstFieldRef.current)
      editFirstFieldRef.current.focus();
  }, [showEdit]);

  // 🇸🇪 Ladda om packlista när resans id ändras (t.ex. byter route)
  useEffect(() => {
    if (!trip) return;
    const nextKey = `packing_${trip.id}`;
    const saved = localStorage.getItem(nextKey);
    if (saved) {
      setPacking(JSON.parse(saved));
    } else if (Array.isArray(trip.packingList)) {
      setPacking(trip.packingList);
    } else {
      setPacking([]);
    }
  }, [trip, trip.id]);

  // Spara packing till LS
  useEffect(() => {
    if (trip) localStorage.setItem(LS_key, JSON.stringify(packing));
  }, [packing, trip, LS_key]);

  // Progress
  const { totalItems, checkedItems, progressPercentage } = useMemo(() => {
    const allItems = packing.flatMap((c) => c.items || []);
    const total = allItems.length;
    const done = allItems.filter((i) => i.checked).length;
    return {
      totalItems: total,
      checkedItems: done,
      progressPercentage: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [packing]);

  // ADD handlers
  const openForm = () => {
    if (packing.length === 0) {
      setCategoryMode("new");
      setCategory("");
    } else {
      setCategoryMode("existing");
      setCategory(packing[0]?.category || "");
    }
    setLabel("");
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenCategory = category.trim();
    const labelClean = label.trim();
    if (!labelClean || !chosenCategory) return;

    setPacking((prev) => {
      const clone = structuredClone(prev);
      const idx = clone.findIndex(
        (c) => c.category.toLowerCase() === chosenCategory.toLowerCase()
      );
      if (idx === -1) {
        clone.push({
          category: chosenCategory,
          items: [{ label: labelClean, checked: false }],
        });
      } else {
        const exists = clone[idx].items.some(
          (it) => it.label.toLowerCase() === labelClean.toLowerCase()
        );
        if (!exists)
          clone[idx].items.push({
            label: labelClean,
            checked: false,
          });
      }
      return clone;
    });

    setShowForm(false);
    setLabel("");
  };

  // Edit handlers

  const openEditModal = (category, itemLabel) => {
    setEditOriginalCategory(category);
    setEditOriginalLabel(itemLabel);

    // Förifyll
    setEditLabel(itemLabel);
    if (packing.length === 0) {
      setEditMode("new");
      setEditCategory("");
    } else {
      setEditMode("existing");
      setEditCategory(category);
    }
    setShowEdit(true);
  };
  const closeEdit = () => setShowEdit(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const newCategory = editCategory.trim();
    const newLabel = editLabel.trim();
    if (!newLabel || !newCategory) return;

    setPacking((prev) => {
      const clone = structuredClone(prev);
      // 1) Ta bort från ursprunglig kategori
      const orig = clone.find((c) => c.category === editOriginalCategory);
      if (!orig) return prev;
      const itemIdx = orig.items.findIndex(
        (x) => x.label === editOriginalLabel
      );
      if (itemIdx === -1) return prev;
      // behåll checked-status
      const wasChecked = !!orig.items[itemIdx].checked;
      // ta bort från original
      orig.items.splice(itemIdx, 1);
      // rensa bort tom kategori
      let afterRemove = clone.filter(
        (c) => c.category !== editOriginalCategory || (c.items?.length ?? 0) > 0
      );

      // 2) Lägg in i ny kategori (kan vara samma som original)
      const targetIdx = afterRemove.findIndex(
        (c) => c.category.toLowerCase() === newCategory.toLowerCase()
      );
      if (targetIdx === -1) {
        afterRemove.push({
          category: newCategory,
          items: [{ label: newLabel, checked: wasChecked }],
        });
      } else {
        // undvik dublett
        const exists = afterRemove[targetIdx].items.some(
          (it) => it.label.toLowerCase() === newLabel.toLowerCase()
        );
        if (!exists) {
          afterRemove[targetIdx].items.push({
            label: newLabel,
            checked: wasChecked,
          });
        }
      }

      return afterRemove;
    });

    setShowEdit(false);
  };

  // Toggle handler
  const handleToggleCheck = (category, itemLabel) => {
    setPacking((prev) => {
      const clone = structuredClone(prev);
      const c = clone.find((x) => x.category === category);
      if (!c) return prev;
      const it = c.items.find((x) => x.label === itemLabel);
      if (!it) return prev;
      it.checked = !it.checked;
      return clone;
    });
  };

  //  DELETE handlers
  const openDeleteModal = (category, itemLabel) => {
    setDelCategory(category);
    setDelLabel(itemLabel);
    setAlsoRemoveEmptyCategory(true); // default true
    setShowDelete(true);
  };
  const closeDelete = () => setShowDelete(false);

  const handleDeleteConfirm = (e) => {
    e?.preventDefault?.();
    setPacking((prev) => {
      const clone = structuredClone(prev);
      const c = clone.find((x) => x.category === delCategory);
      if (!c) return prev;

      c.items = c.items.filter((x) => x.label !== delLabel);

      if (alsoRemoveEmptyCategory) {
        return clone.filter(
          (cat) => cat.category !== delCategory || (cat.items?.length ?? 0) > 0
        );
      }
      return clone;
    });
    setShowDelete(false);
  };

  if (!trip) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading trip data or trip ID not found in URL.
      </div>
    );
  }

  // Render
  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Packing List
        </h2>
        <button
          onClick={openForm}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-900 to-blue-800 transition-all duration-500 text-white font-medium text-sm sm:text-base px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 active:scale-[0.97]"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>
            {checkedItems} / {totalItems} packed
          </span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-900 to-blue-800 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-6">
        {packing.map((categoryGroup) => (
          <article
            key={categoryGroup.category}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <header className="border-b px-4 py-3 bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {categoryGroup.category}
              </h3>
            </header>

            <ul className="divide-y">
              {categoryGroup.items?.map((item) => {
                const inputId = `item-${categoryGroup.category}-${item.label}`
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]/g, "-");
                return (
                  <li
                    key={`${categoryGroup.category}-${item.label}`}
                    className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!item.checked}
                        onChange={() =>
                          handleToggleCheck(categoryGroup.category, item.label)
                        }
                        id={inputId}
                        className="w-5 h-5 text-purple-700 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={inputId}
                        className={`text-sm sm:text-base cursor-pointer ${
                          item.checked
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {item.label}
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openEditModal(categoryGroup.category, item.label)
                        }
                        className="p-1.5 text-purple-700 hover:bg-purple-100 rounded-full transition"
                        title="Edit Item"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={
                          () =>
                            openDeleteModal(categoryGroup.category, item.label) // NEW
                        }
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {/* Empty */}
      {totalItems === 0 && (
        <div className="text-center py-10 text-gray-500 italic text-sm">
          Your packing list is empty. Start adding items!
        </div>
      )}

      {/* --- Modal: Add Item --- */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="text-lg font-semibold">Add Packing Item</h4>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="px-5 py-4 space-y-4"
              onSubmit={handleSubmit}
              onKeyDown={(e) => e.key === "Escape" && closeForm()}
            >
              <div className="flex gap-3 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    ref={firstFieldRef}
                    type="radio"
                    name="catmode"
                    value="existing"
                    checked={categoryMode === "existing"}
                    onChange={() => setCategoryMode("existing")}
                  />
                  <span>Use existing category</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="catmode"
                    value="new"
                    checked={categoryMode === "new"}
                    onChange={() => setCategoryMode("new")}
                  />
                  <span>Create new category</span>
                </label>
              </div>

              {categoryMode === "existing" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Category</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {packing.length === 0 && (
                      <option value="">No categories yet</option>
                    )}
                    {packing.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {categoryMode === "new" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">New category</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Essentials"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm text-gray-700">Item label</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Toothbrush"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !label.trim() ||
                    (categoryMode === "existing" &&
                      !category.trim() &&
                      packing.length > 0) ||
                    (categoryMode === "new" && !category.trim())
                  }
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal: Edit Item --- */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="text-lg font-semibold">Edit Packing Item</h4>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="px-5 py-4 space-y-4"
              onSubmit={handleEditSubmit}
              onKeyDown={(e) => e.key === "Escape" && closeEdit()}
            >
              <div className="space-y-1">
                <label className="text-sm text-gray-700">Item label</label>
                <input
                  ref={editFirstFieldRef}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="editmode"
                    value="existing"
                    checked={editMode === "existing"}
                    onChange={() => setEditMode("existing")}
                  />
                  <span>Move to existing category</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="editmode"
                    value="new"
                    checked={editMode === "new"}
                    onChange={() => setEditMode("new")}
                  />
                  <span>Move to new category</span>
                </label>
              </div>

              {editMode === "existing" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Category</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                  >
                    {packing.map((c) => (
                      <option key={c.category} value={c.category}>
                        {c.category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editMode === "new" && (
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">New category</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Essentials"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editLabel.trim() || !editCategory.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- Modal: Delete Item (NEW) --- */}
      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowDelete(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h4 className="text-lg font-semibold text-red-600">
                Delete Item
              </h4>
              <button
                onClick={closeDelete}
                className="p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="px-5 py-4 space-y-4"
              onSubmit={handleDeleteConfirm}
            >
              <p className="text-sm">
                Are you sure you want to delete this item?
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

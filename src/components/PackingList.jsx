export default function PackingList({ trip }) {
  console.log(trip)

  return (
    <div className="packing-list p-4 text-gray-500">
      <h3 className="text-xl font-semibold mb-4">Packing List</h3>
      <p>Packing list content will be displayed here.</p>
    </div>
  );
}

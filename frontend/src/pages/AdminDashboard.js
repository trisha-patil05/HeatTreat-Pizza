import { useEffect, useState } from "react";
import { getInventory, updateInventory } from "../api/inventoryAPI";

function AdminDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getInventory();
      setItems(data);
    }
    fetchData();
  }, []);

  const handleUpdate = async (id, newStock) => {
    await updateInventory(id, { stock: newStock });
    const updatedList = await getInventory();
    setItems(updatedList); // Refresh inventory
  };

  return (
    <div>
      <h2>Inventory</h2>
      {items.map((item) => (
        <div key={item._id}>
          <span>{item.name}</span>
          <input
            type="number"
            defaultValue={item.stock}
            onBlur={(e) => handleUpdate(item._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;

export const getInventory = async () => {
  const res = await fetch("/api/inventory");
  const data = await res.json();
  return data;
};
export const updateInventory = async (itemId, newStock) => {
  const res = await fetch(`/api/inventory/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock: newStock }),
  });

  if (!res.ok) {
    throw new Error("Failed to update inventory");
  }

  return await res.json();
};

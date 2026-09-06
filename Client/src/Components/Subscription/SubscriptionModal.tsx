import { useEffect, useState } from "react";
import { subscriptionService } from "../../Services/subscriptionService";

interface Props {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const SubscriptionModal = ({ onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const loadCategories = async () => {
    try {
      const data = await subscriptionService.getSubscriptionCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    await onSave({
      name,
      amount,
      category: category === "Other" ? newCategory : category,
      billingCycle,
      nextBillingDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-125">
        <h2 className="text-xl font-bold mb-4">Add Subscription</h2>

        <div className="space-y-3">
          <input
            placeholder="Name"
            className="border p-2 rounded w-full cursor-pointer"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded w-full cursor-pointer"
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <select
            value={category}
            className="border p-2 rounded w-full"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}

            <option value="Other">Other</option>
          </select>

          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded w-full"
            />
          )}

          <select
            className="border p-2 rounded w-full cursor-pointer"
            onChange={(e) => setBillingCycle(e.target.value)}
          >
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded w-full cursor-pointer"
            onChange={(e) => setNextBillingDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;

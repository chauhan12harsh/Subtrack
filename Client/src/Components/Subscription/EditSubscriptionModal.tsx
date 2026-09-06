import { useEffect, useState } from "react";
import { subscriptionService } from "../../Services/subscriptionService";

interface Props {
  subscription: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const EditSubscriptionModal = ({
  subscription,
  onClose,
  onSave,
}: Props) => {
  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(subscription.amount);
  const [category, setCategory] = useState(subscription?.category ?? "");
  const [categories, setCategories] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
  const [nextBillingDate, setNextBillingDate] = useState(subscription.nextBillingDate?.split("T")[0]);
  const [newCategory, setNewCategory] = useState("");


   const loadCategories = async () => {
      try {
        const data =  await subscriptionService.getSubscriptionCategories();
        setCategories(data);
  
      } catch (error) {
      console.error(error);
      }
    }
  
    useEffect(()=>{
      loadCategories();
    },[]);
    
  const handleSubmit = async () => {
    await onSave({
      id: subscription.id,
      name,
      amount,     
      billingCycle,
      nextBillingDate,
      category: category === "Other" ? newCategory: category,
    });

    onClose();
  };

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-125">
      <h2 className="text-xl font-bold mb-4">
        Edit Subscription
      </h2>

      <div className="space-y-3">

        <input
          value={name}
          placeholder="Name"
          className="border p-2 rounded w-full"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          value={amount}
          placeholder="Amount"
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setAmount(Number(e.target.value))
          }
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
          value={billingCycle}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setBillingCycle(e.target.value)
          }
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <input
          type="date"
          value={nextBillingDate}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setNextBillingDate(e.target.value)
          }
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  </div>
);
  
};

export default EditSubscriptionModal;
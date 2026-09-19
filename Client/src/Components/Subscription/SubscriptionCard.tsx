import type { SubscriptionDto } from "../../Types/subscription";

interface SubscriptionCardProps {
  subscription: SubscriptionDto;
  onPause: (id: string) => void;
  onActivate: (id: string) => void;
  onEdit: (subscription: SubscriptionDto) => void;
  onCancel: (id: string) => void;
  onPayment: (id: string, amount: number) => void;
  processingId: string | null;
}

const SubscriptionCard = ({
  subscription,
  onPause,
  onActivate,
  onEdit,
  onCancel,
  onPayment,
  processingId,
}: SubscriptionCardProps) => {
  const isProcessing = processingId === subscription.id;

  const getStatusStyle = () => {
    switch (subscription.status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Paused":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start gap-3">
        <h2 className="text-xl font-semibold">
          {subscription.name}
        </h2>

        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle()}`}
        >
          {subscription.status}
        </span>
      </div>

      <p className="mt-4 text-lg font-medium">
        ₹ {subscription.amount}
      </p>

      <p className="text-gray-600">
        {subscription.billingCycle}
      </p>

      <p className="text-gray-600">
        {subscription.category}
      </p>

      <p className="mt-2">
        Next Billing:{" "}
        {new Date(
          subscription.nextBillingDate
        ).toLocaleDateString()}
      </p>

      <div className="flex gap-2 mt-5 flex-wrap">
        {subscription.status === "Active" && (
          <button
            disabled={isProcessing}
            onClick={() => onPause(subscription.id)}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-3 py-1 rounded cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? "Pausing..." : "Pause"}
          </button>
        )}

        {subscription.status === "Paused" && (
          <button
            disabled={isProcessing}
            onClick={() => onActivate(subscription.id)}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? "Resuming..." : "Resume"}
          </button>
        )}

        <button
          disabled={isProcessing}
          onClick={() => onEdit(subscription)}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded cursor-pointer"
        >
          Edit
        </button>

        <button
          disabled={isProcessing}
          onClick={() => onCancel(subscription.id)}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded cursor-pointer"
        >
          Cancel
        </button>

        <button
          disabled={isProcessing}
          onClick={() =>
            onPayment(subscription.id, subscription.amount)
          }
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1 rounded cursor-pointer"
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
import { useEffect, useState } from "react";
import { subscriptionService } from "../Services/subscriptionService";

import SubscriptionModal from "./Subscription/SubscriptionModal";
import EditSubscriptionModal from "./Subscription/EditSubscriptionModal";
import { paymentService } from "../Services/paymentService";
import type { CreatePayment } from "../Types/payment";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  const loadSubscriptions = async () => {
    try {

      setLoading(true);
      const data = await subscriptionService.userSubscriptions();
      setSubscriptions(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handlePause = async (id: string) => {
    try {
      await subscriptionService.pauseSubscription(id);

      await loadSubscriptions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await subscriptionService.activateSubscription(id);

      await loadSubscriptions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );

    if (!confirmed) return;

    try {
      await subscriptionService.cancelSubscription(id);

      setSubscriptions((prev) =>
        prev.filter((subscription) => subscription.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async (payment: CreatePayment) => {
    try {
      await paymentService.createPayment(payment);
      alert("Payment processed.");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <h2 className="text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          + Add Subscription
        </button>
      </div>

      {/* Create Modal */}

      {showCreateModal && (
        <SubscriptionModal
          onClose={() => setShowCreateModal(false)}
          onSave={async (data) => {
            await subscriptionService.create(data);
            await loadSubscriptions();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Edit Modal */}

      {showEditModal && selectedSubscription && (
        <EditSubscriptionModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSubscription(null);
          }}
          onSave={async (data) => {
            await subscriptionService.updateSubscription(
              data,
              selectedSubscription.id
            );

            await loadSubscriptions();

            setShowEditModal(false);
            setSelectedSubscription(null);
          }}
        />
      )}

      {/* Subscription Cards */}

      <div className="pr-2">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold">{subscription.name}</h2>

              <p className="mt-2 text-lg font-medium">₹ {subscription.amount}</p>

              <p className="text-gray-600">{subscription.billingCycle}</p>

              <p className="text-gray-600">{subscription.category}</p>

              <p className="mt-2"> 
                Next Billing:{" "}{new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium
                    ${
                      subscription.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : subscription.status === "Paused"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {subscription.status}
                </span>
              </div>

              {/* Actions */}

              <div className="flex gap-2 mt-5 flex-wrap">
                {subscription.status === "Active" && (
                  <button
                    onClick={() => handlePause(subscription.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Pause
                  </button>
                )}

                {subscription.status === "Paused" && (
                  <button
                    onClick={() => handleActivate(subscription.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Resume
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setShowEditModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleCancel(subscription.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handlePayment({subscriptionId: subscription.id, Amount: subscription.amount })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;

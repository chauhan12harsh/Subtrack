import { useEffect, useState } from "react";

import { subscriptionService } from "../Services/subscriptionService";
import { paymentService } from "../Services/paymentService";

import SubscriptionModal from "./Subscription/SubscriptionModal";
import EditSubscriptionModal from "./Subscription/EditSubscriptionModal";
import SubscriptionCard from "./Subscription/SubscriptionCard";
import Alert from "./Alert";

import type { CreatePayment } from "../Types/payment";
import type { SubscriptionDto } from "../Types/subscription";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  type: AlertType;
  title: string;
  message: string;
}

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionDto | null>(null);

  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (
    type: AlertType,
    title: string,
    message: string
  ) => {
    setAlert({
      type,
      title,
      message,
    });
  };

  const loadSubscriptions = async () => {
    try {
      setLoading(true);

      const data = await subscriptionService.userSubscriptions();

      setSubscriptions(data);
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Unable to Load",
        "Something went wrong while loading your subscriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handlePause = async (id: string) => {
    try {
      setProcessingId(id);

      await subscriptionService.pauseSubscription(id);

      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === id
            ? {
                ...subscription,
                status: "Paused",
              }
            : subscription
        )
      );

      showAlert(
        "success",
        "Subscription Paused",
        "Your subscription has been paused successfully."
      );
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Pause Failed",
        "Unable to pause the subscription. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      setProcessingId(id);

      await subscriptionService.activateSubscription(id);

      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === id
            ? {
                ...subscription,
                status: "Active",
              }
            : subscription
        )
      );

      showAlert(
        "success",
        "Subscription Resumed",
        "Your subscription has been activated successfully."
      );
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Resume Failed",
        "Unable to resume the subscription. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(id);

      await subscriptionService.cancelSubscription(id);

      setSubscriptions((prev) =>
        prev.filter((subscription) => subscription.id !== id)
      );

      showAlert(
        "success",
        "Subscription Cancelled",
        "The subscription has been cancelled successfully."
      );
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Cancellation Failed",
        "Unable to cancel the subscription. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayment = async (
    subscriptionId: string,
    amount: number
  ) => {
    try {
      setProcessingId(subscriptionId);

      const payment: CreatePayment = {
        subscriptionId,
        Amount: amount,
      };

      await paymentService.createPayment(payment);

      showAlert(
        "success",
        "Payment Successful",
        "Your payment has been processed successfully."
      );
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Payment Failed",
        "Unable to process the payment. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (subscription: SubscriptionDto) => {
    setSelectedSubscription(subscription);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedSubscription(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <h2 className="text-lg font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Subscriptions
        </h1>

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
            try {
              await subscriptionService.create(data);

              await loadSubscriptions();

              setShowCreateModal(false);

              showAlert(
                "success",
                "Subscription Created",
                "Your subscription has been created successfully."
              );
            } catch (error) {
              console.error(error);

              showAlert(
                "error",
                "Creation Failed",
                "Unable to create the subscription."
              );
            }
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSubscription && (
        <EditSubscriptionModal
          subscription={selectedSubscription}
          onClose={handleCloseEdit}
          onSave={async (data) => {
            try {
              await subscriptionService.updateSubscription(
                data,
                selectedSubscription.id
              );

              await loadSubscriptions();

              handleCloseEdit();

              showAlert(
                "success",
                "Subscription Updated",
                "Your subscription has been updated successfully."
              );
            } catch (error) {
              console.error(error);

              showAlert(
                "error",
                "Update Failed",
                "Unable to update the subscription."
              );
            }
          }}
        />
      )}

      {/* Subscriptions */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">
            No subscriptions found
          </h2>

          <p className="mt-2 text-gray-500">
            Add your first subscription to get started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPause={handlePause}
              onActivate={handleActivate}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onPayment={handlePayment}
              processingId={processingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;

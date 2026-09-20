import { useCallback, useEffect, useRef, useState } from "react";
import { paymentService } from "../Services/paymentService";
import type { PaymentType } from "../Types/payment";
import type { AlertState, AlertType } from "../Types/Alert"
import Alert from "./Alert";

const Payment = () => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Prevent multiple API requests from running at the same time.
  const isFetching = useRef(false);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlert({ type,  title,  message });
  };

  /**
   * Safely formats the payment date.
   *
   * Handles:
   * - null
   * - undefined
   * - invalid date strings
   * - valid ISO date strings
   */
  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * Formats payment amount as Indian currency.
   */
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Returns appropriate styling for payment status.
   */
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /**
   * Loads payments.
   *
   * isPolling tells us whether this is a background refresh.
   * Background refresh should not replace the entire page with Loading...
   */
  const loadPayments = useCallback( async (isPolling = false) => {
      if (isFetching.current) {
        return;
      }

      try {
        isFetching.current = true;

        if (isPolling) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await paymentService.getAllUserPaymentTransactions();      
        setPayments(data);
        
      } catch (error) {
        console.error("Failed to load payments:", error);

        if (!isPolling) {
          showAlert(
            "error",
            "Unable to Load Payments",
            "Something went wrong while loading your payment transactions."
          );
        }
      } finally {
        isFetching.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },[]);

  useEffect(() => {
    // Initial load
    loadPayments();

    /**
     * Refresh payments every 5 seconds.
     *
     * Because loadPayments prevents overlapping requests,
     * a slow request won't cause multiple requests to pile up.
     */
    const intervalId = setInterval(() => {
      loadPayments(true);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadPayments]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Payments
        </h1>

        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex justify-center items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

            <p className="text-gray-600">
              Loading payments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Alert */}
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
        <div>
          <h1 className="text-3xl font-bold">
            Payments
          </h1>

          <p className="text-gray-500 mt-1">
            View your payment transaction history
          </p>
        </div>

        {/* Background refresh indicator */}
        {refreshing && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

            Updating...
          </div>
        )}
      </div>

      {/* Empty State */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="text-4xl mb-4">
            💳
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No payments found
          </h2>

          <p className="text-gray-500 mt-2">
            Your payment transactions will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Reference
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Amount
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Date
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Reference */}
                    <td className="p-4">
                      <span className="font-medium text-gray-800">
                        {payment.transactionReference || "N/A"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-medium">
                      {formatAmount(payment.amount)}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-gray-600">
                      {formatDate(payment.paymentDate)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          ${getStatusStyle(payment.status)}
                        `}
                      >
                        {payment.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;

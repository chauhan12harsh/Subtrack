import { useEffect, useState } from "react";
import { paymentService } from "../Services/paymentService";
import { subscriptionService } from "../Services/subscriptionService";

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const subscriptionsData =
        await subscriptionService.userSubscriptions();

      const paymentsData =
        await paymentService.getAllUserPaymentTransactions();

      setSubscriptions(subscriptionsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "Active"
  ).length;

  const pausedSubscriptions = subscriptions.filter(
    (s) => s.status === "Paused"
  ).length;

  const cancelledSubscriptions = subscriptions.filter(
    (s) => s.status === "Cancelled"
  ).length;

  const monthlyCommitment = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((sum, s) => sum + s.amount, 0);

  const totalPayments = payments.length;

  const totalSpent = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const highestSubscription =
    subscriptions.length > 0
      ? subscriptions.reduce((prev, current) =>
          prev.amount > current.amount
            ? prev
            : current
        )
      : null;

  const upcomingRenewals = [...subscriptions]
    .filter((s) => s.status === "Active")
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() -
        new Date(a.paymentDate).getTime()
    )
    .slice(0, 5);

  const categoryBreakdown = subscriptions.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.category] =
        (acc[item.category] || 0) + 1;

      return acc;
    },
    {}
  );

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
    <div className="p-6 h-screen overflow-y-auto scrollbar-hide">

      {/* Header */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Track subscriptions, monitor spending and manage renewals.
        </p>
      </div>

      {/* Main Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Monthly Commitment
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹ {monthlyCommitment}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Total Spent
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹ {totalSpent}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Total Payments
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalPayments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Highest Subscription
          </h3>

          <p className="text-xl font-bold mt-2">
            {highestSubscription?.name ?? "N/A"}
          </p>

          <p className="text-gray-500">
            ₹ {highestSubscription?.amount ?? 0}
          </p>
        </div>

      </div>

      {/* Status Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-green-100 rounded-xl p-6">
          <h3 className="text-green-700 font-semibold">
            Active
          </h3>

          <p className="text-3xl font-bold mt-2">
            {activeSubscriptions}
          </p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-6">
          <h3 className="text-yellow-700 font-semibold">
            Paused
          </h3>

          <p className="text-3xl font-bold mt-2">
            {pausedSubscriptions}
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-6">
          <h3 className="text-red-700 font-semibold">
            Cancelled
          </h3>

          <p className="text-3xl font-bold mt-2">
            {cancelledSubscriptions}
          </p>
        </div>

      </div>

      {/* Bottom Widgets */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Upcoming Renewals */}

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            Upcoming Renewals
          </h3>

          {upcomingRenewals.length > 0 ? (
            upcomingRenewals.map((subscription) => (
              <div
                key={subscription.id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <span>{subscription.name}</span>

                <span>
                  {new Date(
                    subscription.nextBillingDate
                  ).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No upcoming renewals
            </p>
          )}
        </div>

        {/* Recent Payments */}

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            Recent Payments
          </h3>

          {recentPayments.length > 0 ? (
            recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    {payment.subscriptionName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {payment.transactionReference}
                  </p>
                </div>

                <span className="font-semibold">
                  ₹ {payment.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No payments found
            </p>
          )}
        </div>

        {/* Category Breakdown */}

        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            Category Breakdown
          </h3>

          {Object.keys(categoryBreakdown).length > 0 ? (
            Object.entries(categoryBreakdown).map(
              ([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{category}</span>

                  <span>{count}</span>
                </div>
              )
            )
          ) : (
            <p className="text-gray-500">
              No categories found
            </p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
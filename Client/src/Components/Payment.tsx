import { useEffect, useState } from "react";
import { paymentService } from "../Services/paymentService";

const Payment = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPayments = async () => {
    try {
      
      setLoading(true);      
      const data = await paymentService.getAllUserPaymentTransactions();      
      setPayments(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();

    const intervalId = setInterval(() => {
                              loadPayments();
                            }, 5000);
                          
    return () => clearInterval(intervalId);

  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Payments
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">
                Reference
              </th>

              <th className="text-left p-4">
                Amount
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t"
              >
                <td className="p-4">
                  {payment.transactionReference}
                </td>

                <td className="p-4">
                  ₹ {payment.amount}
                </td>

                <td className="p-4">
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      payment.status ===
                      "Completed"
                        ? "bg-green-100 text-green-700"
                        : payment.status ===
                          "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
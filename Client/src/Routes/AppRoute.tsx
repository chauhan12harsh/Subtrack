import { Route } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Components/Dashboard";
import Subscription from "../Components/Subscription";
import Payment from "../Components/Payment";
import Budget from "../Components/Budget";

const AppRoute = () => {
  return (
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/subscriptions" element={<Subscription />} />
      <Route path="/payments" element={<Payment />} />
      <Route path="/budget" element={<Budget/>} />
    </Route>
  );
};

export default AppRoute;

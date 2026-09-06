import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import DashboardLayout from "./Layouts/DashboardLayout"
import Dashboard from "./Components/Dashboard"
import Subscription from "./Components/Subscription"
import Payment from "./Components/Payment"
import Budget from "./Components/Budget"
import Notifications from "./Components/Notification"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/budget" element={<Budget/>} />
          <Route path="/notifications" element={<Notifications/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}  

export default App
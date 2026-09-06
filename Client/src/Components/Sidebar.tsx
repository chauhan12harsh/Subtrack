import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notificationService } from "../Services/notificationService";

const Sidebar = () => {
    
  const navigator = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
    },
    {
      name: "Payments",
      path: "/payments",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Notifications",
      path: "/notifications",
    },
  ];

  const [unreadCount, setUnreadCount] = useState(0);
  
  const logout = () => {
    localStorage.removeItem("accessToken");
    navigator("/");
  }

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.GetUnreadNotificationCount();
      setUnreadCount(count);
      console.log(count);
      
      
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    const intervalId = setInterval(() => {
                          loadUnreadCount();
                        }, 5000); // 30 seconds

    return () => clearInterval(intervalId);

  }, []);

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        SubTrack
      </h1>

      <nav>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block p-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`}
              >
                {/* {item.name} */}
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>                  
                  {
                    item.name === "Notifications" && unreadCount > 0 && 
                    ( 
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[24px] text-center">
                        {unreadCount}
                      </span>
                    )
                  }
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-5 left-5">
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

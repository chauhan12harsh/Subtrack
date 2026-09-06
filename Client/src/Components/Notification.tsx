import { useEffect, useState } from "react";

import { notificationService } from "../Services/notificationService";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const data =
                await notificationService.GetNotifications();

            setNotifications(data);
        }
        catch (error) {
            console.error(
                "Failed to load notifications",
                error
            );
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        const intervalId = setInterval(() => {
                              loadNotifications();
                            }, 5000);
                          
        return () => clearInterval(intervalId);

    }, []);

    const markRead = async (notificationId: string) => {
        await notificationService.ReadNotification(
            notificationId
        );

        await loadNotifications();
    };

    const markAllRead = async () => {
        await notificationService.ReadAllNotifications();

        await loadNotifications();
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-slate-500">
                    Loading notifications...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Notifications
                    </h1>

                    <p className="text-sm text-slate-500">
                        {notifications.length} notification(s)
                    </p>
                </div>

                <button
                    onClick={markAllRead}
                    className="
                        px-4
                        py-2
                        bg-blue-600
                        text-white
                        rounded-lg
                        hover:bg-blue-700
                        transition
                    "
                >
                    Mark All Read
                </button>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {
                    notifications.length === 0 ? (
                        <div className="p-8 text-center">

                            <div className="text-4xl mb-3">
                                🔔
                            </div>

                            <p className="text-slate-500">
                                No notifications available
                            </p>

                        </div>
                    ) : (
                        notifications.map((notification: any) => (

                            <div
                                key={notification.id}
                                className={`
                                    p-4
                                    border-b
                                    last:border-b-0
                                    hover:bg-slate-50
                                    transition
                                    ${
                                        !notification.isRead
                                            ? "bg-blue-50"
                                            : ""
                                    }
                                `}
                            >

                                <div className="flex justify-between items-start gap-4">

                                    <div className="flex gap-3 flex-1">

                                        {
                                            !notification.isRead && (
                                                <div
                                                    className="
                                                        w-2.5
                                                        h-2.5
                                                        bg-blue-600
                                                        rounded-full
                                                        mt-2
                                                        flex-shrink-0
                                                    "
                                                />
                                            )
                                        }

                                        {
                                            notification.isRead && (
                                                <div
                                                    className="
                                                        w-2.5
                                                        h-2.5
                                                        rounded-full
                                                        mt-2
                                                        flex-shrink-0
                                                    "
                                                />
                                            )
                                        }

                                        <div className="flex-1">

                                            <h3 className="font-semibold text-slate-800">
                                                {notification.title}
                                            </h3>

                                            <p className="text-sm text-slate-600 mt-1">
                                                {notification.message}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right flex flex-col items-end">

                                        <span className="text-xs text-slate-400 mb-2">
                                            {
                                                new Date(
                                                    notification.createdAt
                                                ).toLocaleString()
                                            }
                                        </span>

                                        {
                                            !notification.isRead && (
                                                <button
                                                    onClick={() =>
                                                        markRead(
                                                            notification.id
                                                        )
                                                    }
                                                    className="
                                                        text-xs
                                                        px-3
                                                        py-1
                                                        bg-green-600
                                                        text-white
                                                        rounded
                                                        hover:bg-green-700
                                                    "
                                                >
                                                    Read
                                                </button>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        ))
                    )
                }

            </div>

        </div>
    );
};

export default Notifications;
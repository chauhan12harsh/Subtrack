import { useEffect, useState } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
}

const Alert = ({
  type,
  title,
  message,
  onClose,
}: AlertProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.7 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);

    // Remove alert after exit animation
    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  const styles = {
    success: {
      border: "border-green-500",
      icon: "✓",
      iconStyle: "bg-green-100 text-green-600",
    },
    error: {
      border: "border-red-500",
      icon: "!",
      iconStyle: "bg-red-100 text-red-600",
    },
    warning: {
      border: "border-yellow-500",
      icon: "!",
      iconStyle: "bg-yellow-100 text-yellow-600",
    },
    info: {
      border: "border-blue-500",
      icon: "i",
      iconStyle: "bg-blue-100 text-blue-600",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        fixed
        top-5
        right-5
        z-50
        w-[350px]
        max-w-[calc(100vw-2rem)]
        ${isExiting ? "animate-toast-out" : "animate-toast-in"}
      `}
    >
      <div
        className={`
          bg-white
          border-l-4
          ${style.border}
          rounded-lg
          shadow-lg
          p-4
          flex
          items-start
          gap-3
        `}
      >
        {/* Icon */}
        <div
          className={`
            ${style.iconStyle}
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            font-bold
            shrink-0
          `}
        >
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">
            {title}
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="
            text-gray-400
            hover:text-gray-700
            text-lg
            leading-none
            cursor-pointer
          "
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;


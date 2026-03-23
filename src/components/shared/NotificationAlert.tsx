"use client";

import { type FC, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationAlertProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // Duration in seconds
  onClose?: () => void;
}

const NotificationAlert: FC<NotificationAlertProps> = ({
  type,
  title,
  message,
  duration = 5, // Default duration of 5 seconds
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 0.1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      if (onClose) onClose();
    }
  }, [timeLeft, onClose]);

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-stone-950 border-2 border-yellow-400 text-white";
      case "error":
        return "bg-stone-950 border-2 border-red-500 text-white";
      case "warning":
        return "bg-stone-950 border-2 border-yellow-400 text-white";
      case "info":
        return "bg-stone-950 border-2 border-yellow-400 text-white";
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-yellow-400" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-400" />;
      case "info":
        return <Info className="h-6 w-6 text-yellow-400" />;
    }
  };

  const getProgressColor = () => {
    return "bg-white";
  };

  if (!isVisible) return null;

  return (
    <Card className={`${getTypeStyles(type)} relative overflow-hidden mt-4`}>
      <CardContent className="flex items-center p-3">
        <div className="shrink-0">{getIcon(type)}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
        </div>
      </CardContent>
      <div
        className={`absolute bottom-0 left-0 h-1 ${getProgressColor()}`}
        style={{
          width: `${(timeLeft / duration) * 100}%`,
          transition: "width 0.1s linear",
        }}
      />
    </Card>
  );
};

export default NotificationAlert;

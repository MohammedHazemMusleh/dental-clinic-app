import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 2500);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
          style={{ background: "#DC2626", color: "#fff" }}
        >
          <WifiOff size={16} />
          لا يوجد اتصال بالإنترنت
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
          style={{ background: "#1F6F6B", color: "#fff" }}
        >
          <Wifi size={16} />
          تم استعادة الاتصال
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineBanner;

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BookingApp from "./components/BookingApp";
import OfflineBanner from "./components/OfflineBanner";
import AdminPanel from "./components/AdminPanel";
import AdminGate from "./components/AdminGate";

const BookingPage = () => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div
      dir="rtl"
      style={{ background: "#F7F5F1", fontFamily: "'Inter', sans-serif" }}
      className="min-h-screen w-full flex items-center justify-center p-4"
    >
      <div
        className={`w-full overflow-hidden rounded-3xl shadow-xl items-stretch ${
          confirmed ? "max-w-lg" : "max-w-5xl grid md:grid-cols-[320px_1fr]"
        }`}
        style={{ background: "#FFFFFF" }}
      >
        {!confirmed && <Sidebar />}
        <BookingApp confirmed={confirmed} setConfirmed={setConfirmed} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <AdminPanel />
            </AdminGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

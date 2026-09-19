import { useState, useEffect } from "react";
import { Coffee, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

const MORNING_SLOTS = [
  "٩:٠٠ ص",
  "٩:٣٠ ص",
  "١٠:٠٠ ص",
  "١٠:٣٠ ص",
  "١١:٠٠ ص",
  "١١:٣٠ ص",
];

const EVENING_SLOTS = [
  "٢:٠٠ م",
  "٢:٣٠ م",
  "٣:٠٠ م",
  "٣:٣٠ م",
  "٤:٠٠ م",
  "٤:٣٠ م",
  "٥:٠٠ م",
  "٥:٣٠ م",
  "٦:٠٠ م",
  "٦:٣٠ م",
  "٧:٠٠ م",
  "٧:٣٠ م",
  "٨:٠٠ م",
  "٨:٣٠ م",
];

const BREAK_TIMES = ["١٢:٠٠ م", "١٢:٣٠ م", "١:٠٠ م", "١:٣٠ م"];

const TimeStep = ({ selectedTime, setSelectedTime, selectedDay }) => {
  const [warning, setWarning] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    if (!selectedDay) return;

    const isoDate = `${selectedDay.year}-${String(selectedDay.month + 1).padStart(2, "0")}-${String(selectedDay.day).padStart(2, "0")}`;

    setLoadingTimes(true);
    supabase
      .from("bookings")
      .select("booking_time")
      .eq("booking_date", isoDate)
      .then(({ data, error }) => {
        setLoadingTimes(false);
        if (!error && data) {
          setBookedTimes(data.map((row) => row.booking_time));
        }
      });
  }, [selectedDay]);

  const handleClick = (time) => {
    if (BREAK_TIMES.includes(time) || bookedTimes.includes(time)) {
      setWarning(true);
      return;
    }
    setWarning(false);
    setSelectedTime(time);
  };

  const renderSlot = (time) => {
    const active = selectedTime === time;
    const isBooked = bookedTimes.includes(time);
    return (
      <button
        key={time}
        onClick={() => handleClick(time)}
        disabled={isBooked}
        className="py-3 rounded-xl text-sm font-medium border transition relative"
        style={{
          borderColor: active ? "#1F6F6B" : "#EEEBE4",
          background: isBooked ? "#F1F5F9" : active ? "#1F6F6B" : "#F7F5F1",
          color: isBooked ? "#94A3B8" : active ? "#fff" : "#1E2B2A",
          textDecoration: isBooked ? "line-through" : "none",
          opacity: isBooked ? 0.6 : 1,
          cursor: isBooked ? "not-allowed" : "pointer",
        }}
      >
        {time}
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">أي وقت يناسبك؟</h2>
      <p className="text-sm mb-6" style={{ color: "#475569" }}>
        اختر الوقت المناسب لموعدك
      </p>

      {loadingTimes && (
        <div
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#475569" }}
        >
          <Loader2 size={14} className="animate-spin" />
          جاري التحقق من الأوقات المتاحة...
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {MORNING_SLOTS.map(renderSlot)}
      </div>

      <div
        className="flex items-center gap-2 my-4 py-2.5 px-3 rounded-xl text-xs"
        style={{ background: "#FEF3C7", color: "#92400E" }}
      >
        <Coffee size={14} />
        <span>استراحة الطبيب (١٢:٠٠ م - ٢:٠٠ م)</span>
      </div>

      {warning && (
        <div
          className="mb-4 py-2.5 px-3 rounded-xl text-xs"
          style={{ background: "#FEE2E2", color: "#DC2626" }}
        >
          هذا الوقت غير متاح، برجاء اختيار وقت آخر
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {EVENING_SLOTS.map(renderSlot)}
      </div>
    </div>
  );
};

export default TimeStep;

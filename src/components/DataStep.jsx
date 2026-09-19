import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

const DataStep = ({ selectedDay, setSelectedDay }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = buildMonthGrid(year, month);

  const changeMonth = (delta) => {
    const nd = new Date(year, month + delta, 1);
    setViewDate(nd);
    setSelectedDay(null);
  };

  const isPast = (d) => {
    if (!d) return true;
    const dt = new Date(year, month, d);
    return dt < today;
  };

  const isFriday = (d) => {
    if (!d) return false;
    return new Date(year, month, d).getDay() === 5;
  };

  const handleSelect = (d) => {
    setSelectedDay({ day: d, month, year });
  };

  const isActive = (d) => {
    return (
      selectedDay &&
      selectedDay.day === d &&
      selectedDay.month === month &&
      selectedDay.year === year
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">متى يناسبك الحضور؟</h2>
      <p className="text-sm mb-6" style={{ color: "#475569" }}>
        اختر اليوم المناسب لك
      </p>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-black/5"
        >
          <ChevronRight size={18} />
        </button>
        <span className="font-semibold text-sm">
          {MONTHS_AR[month]} {year}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-black/5"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <div
        className="grid grid-cols-7 gap-1 text-center text-xs mb-2"
        style={{ color: "#475569" }}
      >
        {WEEKDAYS_AR.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, i) => {
            if (d === null) return <div key={i} />;
            const disabled = isPast(d) || isFriday(d);
            const active = isActive(d);
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => handleSelect(d)}
                className="aspect-square rounded-xl text-sm font-medium transition"
                style={{
                  background: active
                    ? "#1F6F6B"
                    : disabled
                      ? "transparent"
                      : "#F7F5F1",
                  color: active ? "#fff" : disabled ? "#C9C4B8" : "#1E2B2A",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs mt-3" style={{ color: "#475569" }}>
        العيادة مغلقة أيام الجمعة
      </p>
    </div>
  );
};

export default DataStep;

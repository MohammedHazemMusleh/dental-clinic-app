import ToothIcon from "./ToothIcon";
import { Clock, Phone } from "lucide-react";

const Sidebar = () => {
  return (
    <div
      className="p-8 flex flex-col justify-start gap-6"
      style={{
        background: "#14504D",
        color: "#F7F5F1",
        fontFamily: "'Tajawal', sans-serif",
      }}
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <ToothIcon size={34} />
          <span className="font-bold text-2xl">عيادة الابتسامة</span>
        </div>
        {(() => {
          const isFriday = new Date().getDay() === 5;
          return (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-7 mx-auto flex w-fit"
              style={{ background: "rgba(0,0,0,0.25)" }}
            >
              <span className="relative flex h-2 w-2">
                {!isFriday && (
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: isFriday ? "#F87171" : "#4ADE80" }}
                  ></span>
                )}
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: isFriday ? "#F87171" : "#4ADE80" }}
                ></span>
              </span>
              {isFriday ? "العيادة مغلقة اليوم" : "متاح مواعيد لليوم"}
            </div>
          );
        })()}

        <h1
          className="text-4xl font-extrabold mb-3"
          style={{ lineHeight: "1.25" }}
        >
          احجز موعدك
          <br />
          في دقيقتين فقط
        </h1>

        <p
          className="text-xs leading-relaxed mb-6"
          style={{ color: "#E2E8F0" }}
        >
          اجعل زيارتك للعيادة أسهل ما يمكن — اختر الخدمة، الوقت المناسب، وأكّد
          حجزك.
        </p>

        <button
          className="w-full py-3 rounded-xl font-bold text-sm transition hover:scale-[1.02]"
          style={{ background: "#F5B84E", color: "#14504D" }}
        >
          ابدأ الحجز الآن 👈
        </button>
      </div>

      <div
        className="mt-10 pt-6 space-y-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(4px)",
            color: "#FFFFFF",
          }}
        >
          <Clock size={16} />
          <span>السبت - الخميس: 9 ص - 9 م</span>
        </div>
        <a
          href="tel:0594739629"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(4px)",
            color: "#FFFFFF",
          }}
        >
          <Phone size={16} />
          <span dir="ltr" className="text-right w-full">
            0594739629
          </span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

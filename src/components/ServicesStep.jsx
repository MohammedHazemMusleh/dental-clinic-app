import {
  Sparkles,
  Stethoscope,
  Wrench,
  AlertCircle,
  Check,
} from "lucide-react";

const SERVICES = [
  {
    id: "cleaning",
    name: "تنظيف الأسنان",
    tag: "تجميل",
    desc: "إزالة الجير والتلميع",
    duration: "٣٠ دقيقة",
    price: "150 شيكل",
    icon: Sparkles,
    popular: true,
  },
  {
    id: "checkup",
    name: "فحص دوري",
    tag: "تشخيص",
    desc: "كشف عام وأشعة إذا لزم",
    duration: "٢٠ دقيقة",
    price: "100 شيكل",
    icon: Stethoscope,
  },
  {
    id: "filling",
    name: "حشوة",
    tag: "علاج",
    desc: "علاج تسوس بسيط",
    duration: "٤٥ دقيقة",
    price: "250 شيكل",
    icon: Wrench,
  },
  {
    id: "emergency",
    name: "حالة طارئة",
    tag: "طارئ",
    desc: "ألم أو إصابة مفاجئة",
    duration: "حسب الحالة",
    price: "يُحدد بالكشف",
    icon: AlertCircle,
    urgent: true,
  },
];

const ServicesStep = ({ service, setService }) => {
  const selected = service;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">ما هي الخدمة؟</h2>
      <p className="text-sm mb-6" style={{ color: "#475569" }}>
        اختر الخدمة التي تحتاجها اليوم
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const active = selected === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setService(s.id)}
              className="relative text-right p-4 rounded-2xl border transition flex items-start gap-3"
              style={{
                borderColor: active
                  ? "#1F6F6B"
                  : s.urgent && !selected
                    ? "#FCA5A5"
                    : "#EEEBE4",
                background: active
                  ? "#E7F5F1"
                  : s.urgent && !selected
                    ? "#FEF2F2"
                    : "#FFFFFF",
                borderWidth: active ? "2px" : "1px",
              }}
            >
              {active && (
                <div
                  className="absolute top-2 left-2 rounded-full flex items-center justify-center"
                  style={{
                    width: 20,
                    height: 20,
                    background: "#1F6F6B",
                    color: "#fff",
                  }}
                >
                  <Check size={12} />
                </div>
              )}

              {s.popular && !active && (
                <div
                  className="absolute -top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "#F5B84E", color: "#14504D" }}
                >
                  الأكثر طلباً
                </div>
              )}

              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: active
                    ? "#1F6F6B"
                    : s.urgent && !selected
                      ? "#FEE2E2"
                      : "#F7F5F1",
                  color: active
                    ? "#fff"
                    : s.urgent && !selected
                      ? "#DC2626"
                      : "#1F6F6B",
                }}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{s.name}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "#F1F5F9", color: "#475569" }}
                  >
                    {s.tag}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#334155" }}>
                  {s.desc}
                </div>
                <div
                  className="text-xs mt-2 flex gap-3"
                  style={{ color: "#1F6F6B" }}
                >
                  <span>{s.duration}</span>
                  <span>{s.price}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesStep;

import { useState } from "react";
import {
  Sparkles,
  Stethoscope,
  Wrench,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Check,
  Loader2,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const SERVICE_INFO = {
  cleaning: { name: "تنظيف الأسنان", icon: Sparkles },
  checkup: { name: "فحص دوري", icon: Stethoscope },
  filling: { name: "حشوة", icon: Wrench },
  emergency: { name: "حالة طارئة", icon: AlertCircle },
};

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

const WEEKDAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

const SummaryRow = ({ icon: Icon, label, value }) => (
  <div
    className="flex items-center gap-3 py-3 border-b"
    style={{ borderColor: "#EEEBE4" }}
  >
    <div
      className="flex items-center justify-center rounded-lg shrink-0"
      style={{ width: 34, height: 34, background: "#E7F5F1", color: "#1F6F6B" }}
    >
      <Icon size={16} />
    </div>
    <div>
      <div className="text-xs" style={{ color: "#475569" }}>
        {label}
      </div>
      <div className="text-sm font-semibold" style={{ color: "#1E2B2A" }}>
        {value || "—"}
      </div>
    </div>
  </div>
);

const ConfirmationStep = ({
  service,
  selectedDay,
  selectedTime,
  name,
  phone,
  notes,
  confirmed,
  setConfirmed,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const serviceData = service ? SERVICE_INFO[service] : null;

  const dateLabel = selectedDay
    ? `${WEEKDAYS_AR[new Date(selectedDay.year, selectedDay.month, selectedDay.day).getDay()]}، ${selectedDay.day} ${MONTHS_AR[selectedDay.month]} ${selectedDay.year}`
    : "—";

  const isoDate = selectedDay
    ? `${selectedDay.year}-${String(selectedDay.month + 1).padStart(2, "0")}-${String(selectedDay.day).padStart(2, "0")}`
    : null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    // الخطوة ١: نتحقق هل فيه حجز موجود بنفس التاريخ والوقت
    const { data: existing, error: checkError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", isoDate)
      .eq("booking_time", selectedTime);

    if (checkError) {
      setLoading(false);
      setError("حصل خطأ أثناء التحقق، حاول مرة أخرى");
      console.error(checkError);
      return;
    }

    if (existing && existing.length > 0) {
      setLoading(false);
      setError(
        "عذرًا، هذا الموعد تم حجزه للتو من شخص آخر، برجاء اختيار وقت مختلف",
      );
      return;
    }

    // الخطوة ٢: الوقت متاح، نسجل الحجز
    const { error: insertError } = await supabase.from("bookings").insert({
      service: serviceData?.name || service,
      booking_date: isoDate,
      booking_time: selectedTime,
      customer_name: name,
      customer_phone: phone,
      notes: notes || null,
    });

    setLoading(false);

    if (insertError) {
      setError("حصل خطأ أثناء حفظ الحجز، حاول مرة أخرى");
      console.error(insertError);
      return;
    }

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center text-center py-6 animate-slide-up">
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{
            width: 72,
            height: 72,
            background: "#E7F5F1",
            color: "#1F6F6B",
          }}
        >
          <Check size={34} />
        </div>
        <h2 className="text-3xl font-bold mb-2">
          تم تأكيد حجزك{name ? `، ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-sm mb-8" style={{ color: "#475569" }}>
          راح نتواصل معك على {phone || "رقمك"} لتأكيد الموعد قبل يوم
        </p>

        <div
          className="w-full max-w-sm text-right rounded-2xl p-5"
          style={{ background: "#F7F5F1" }}
        >
          {serviceData && (
            <SummaryRow
              icon={serviceData.icon}
              label="الخدمة"
              value={serviceData.name}
            />
          )}
          <SummaryRow icon={Calendar} label="التاريخ" value={dateLabel} />
          <SummaryRow icon={Clock} label="الوقت" value={selectedTime} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">راجع وأكّد حجزك</h2>
      <p className="text-sm mb-6" style={{ color: "#475569" }}>
        تأكد من صحة البيانات قبل الإرسال
      </p>

      <div>
        {serviceData && (
          <SummaryRow
            icon={serviceData.icon}
            label="الخدمة"
            value={serviceData.name}
          />
        )}
        <SummaryRow icon={Calendar} label="التاريخ" value={dateLabel} />
        <SummaryRow icon={Clock} label="الوقت" value={selectedTime} />
        <SummaryRow icon={User} label="الاسم" value={name} />
        <SummaryRow icon={Phone} label="الجوال" value={phone} />
        {notes && (
          <SummaryRow icon={MessageSquare} label="ملاحظات" value={notes} />
        )}
      </div>

      {error && (
        <div
          className="flex items-center gap-2 mt-4 py-2.5 px-3 rounded-xl text-xs"
          style={{ background: "#FEE2E2", color: "#DC2626" }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "#1F6F6B", color: "#fff" }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          "تأكيد الحجز نهائيًا"
        )}
      </button>
    </div>
  );
};

export default ConfirmationStep;

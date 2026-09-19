import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Loader2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Search,
  Bell,
  X,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const SERVICE_COLORS = {
  "تنظيف الأسنان": { bg: "#E7F5F1", text: "#1F6F6B" },
  "فحص دوري": { bg: "#EFF6FF", text: "#2563EB" },
  حشوة: { bg: "#FEF3C7", text: "#92400E" },
  "حالة طارئة": { bg: "#FEE2E2", text: "#DC2626" },
};

const playNotificationSound = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.4);

  setTimeout(() => {
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1100, audioCtx.currentTime);
    gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc2.start(audioCtx.currentTime);
    osc2.stop(audioCtx.currentTime + 0.4);
  }, 150);
};

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const originalTitle = useRef(document.title);

  useEffect(() => {
    fetchBookings();

    if (Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const newBooking = payload.new;
          setBookings((prev) => [...prev, newBooking]);
          setNewBookingAlert(newBooking);
          setUnreadCount((c) => c + 1);
          playNotificationSound();

          if (Notification && Notification.permission === "granted") {
            new Notification("حجز جديد! 🦷", {
              body: `${newBooking.customer_name} — ${newBooking.service}`,
            });
          }

          setTimeout(() => setNewBookingAlert(null), 6000);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    document.title =
      unreadCount > 0 ? `(${unreadCount}) حجز جديد!` : originalTitle.current;
  }, [unreadCount]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا الحجز؟");
    if (!confirmDelete) return;

    setDeletingId(id);
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    setDeletingId(null);

    if (!error) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleToggleDone = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from("bookings")
      .update({ is_done: newStatus })
      .eq("id", id);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_done: newStatus } : b)),
      );
    }
  };

  const clearUnread = () => setUnreadCount(0);

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayCount = bookings.filter((b) => b.booking_date === todayISO).length;

  const badgeStyle = (service) =>
    SERVICE_COLORS[service] || { bg: "#F1F5F9", text: "#475569" };

  const filtered = bookings.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.customer_name?.toLowerCase().includes(q) ||
      b.customer_phone?.toLowerCase().includes(q)
    );
  });

  const todayForSort = new Date().toISOString().slice(0, 10);

  const upcoming = filtered.filter((b) => b.booking_date >= todayForSort);
  const past = filtered.filter((b) => b.booking_date < todayForSort);

  const groupByDate = (list) =>
    list.reduce((acc, b) => {
      const key = b.booking_date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(b);
      return acc;
    }, {});

  const groupedUpcoming = groupByDate(upcoming);
  const groupedPast = groupByDate(past);

  const formatDateLabel = (isoDate) => {
    const d = new Date(isoDate);
    const weekdays = [
      "أحد",
      "اثنين",
      "ثلاثاء",
      "أربعاء",
      "خميس",
      "جمعة",
      "سبت",
    ];
    const months = [
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
    return `${weekdays[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const BookingRow = ({ b }) => {
    const colors = badgeStyle(b.service);
    return (
      <div
        className="bg-white rounded-2xl p-4 shadow-sm border-2 transition"
        style={{ borderColor: b.is_done ? "#86E5BC" : "#EEEBE4" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-bold text-sm"
            style={{
              color: "#1E2B2A",
              textDecoration: b.is_done ? "line-through" : "none",
            }}
          >
            {b.customer_name}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: colors.bg, color: colors.text }}
          >
            {b.service}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center gap-2" style={{ color: "#475569" }}>
            <Clock size={13} />
            {b.booking_time}
          </div>
          <div className="flex items-center gap-2" style={{ color: "#475569" }}>
            <Phone size={13} />
            <a href={`tel:${b.customer_phone}`} className="underline">
              {b.customer_phone}
            </a>
          </div>
        </div>
        {b.notes && (
          <div
            className="flex items-start gap-2 mb-3 pt-2 border-t text-xs"
            style={{ borderColor: "#EEEBE4", color: "#475569" }}
          >
            <MessageSquare size={13} className="mt-0.5" />
            {b.notes}
          </div>
        )}
        <div
          className="flex items-center gap-2 pt-2 border-t"
          style={{ borderColor: "#EEEBE4" }}
        >
          <button
            onClick={() => handleToggleDone(b.id, b.is_done)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition"
            style={{
              background: b.is_done ? "#DCFCE7" : "#F1F5F9",
              color: b.is_done ? "#16A34A" : "#475569",
            }}
          >
            <CheckCircle2 size={14} />
            {b.is_done ? "مكتمل" : "تعليم كمكتمل"}
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            disabled={deletingId === b.id}
            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs font-medium transition"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
          >
            {deletingId === b.id ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen p-4 sm:p-6"
      style={{ background: "#F7F5F1", fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* نافذة إشعار الحجز الجديد */}
      {newBookingAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up w-[92%] max-w-sm">
          <div
            className="flex items-start gap-3 p-4 rounded-2xl shadow-xl"
            style={{ background: "#14504D", color: "#fff" }}
          >
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 36,
                height: 36,
                background: "#F5B84E",
                color: "#14504D",
              }}
            >
              <Bell size={17} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm mb-0.5">حجز جديد! 🎉</div>
              <div className="text-xs" style={{ color: "#A9DDD0" }}>
                {newBookingAlert.customer_name} — {newBookingAlert.service}
              </div>
            </div>
            <button
              onClick={() => setNewBookingAlert(null)}
              style={{ color: "#A9DDD0" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div
          className="md:flex md:justify-between md:items-center pb-5 mb-4 border-b gap-4"
          style={{ borderColor: "#EEEBE4" }}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold" style={{ color: "#1E2B2A" }}>
              لوحة تحكم العيادة
            </h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>
              متابعة وإدارة الحجوزات المسجلة
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#E7F5F1", color: "#1F6F6B" }}
            >
              إجمالي: {bookings.length}
            </div>
            <div
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#FEF3C7", color: "#92400E" }}
            >
              اليوم: {todayCount}
            </div>
            <button
              onClick={() => {
                fetchBookings();
                clearUnread();
              }}
              className="relative p-2.5 rounded-xl transition hover:scale-105 shrink-0"
              style={{ background: "#1F6F6B", color: "#fff" }}
              title="تحديث"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1.5 -left-1.5 flex items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    width: 18,
                    height: 18,
                    background: "#DC2626",
                    color: "#fff",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative mb-6 sm:max-w-xs">
          <Search
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الجوال..."
            className="w-full pr-11 pl-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:scale-[1.01]"
            style={{ borderColor: "#D6D3CC", background: "#FFFFFF" }}
            onFocus={(e) => (e.target.style.borderColor = "#1F6F6B")}
            onBlur={(e) => (e.target.style.borderColor = "#D6D3CC")}
          />
        </div>

        {loading && bookings.length === 0 && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#475569" }}
          >
            <Loader2 size={16} className="animate-spin" />
            جاري تحميل الحجوزات...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            className="text-center py-12 rounded-2xl border-2 border-dashed text-sm"
            style={{ borderColor: "#EEEBE4", color: "#94A3B8" }}
          >
            {search ? "لا توجد نتائج مطابقة" : "لا توجد حجوزات مسجلة حالياً"}
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(groupedUpcoming).map((dateKey) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} style={{ color: "#1F6F6B" }} />
                <h2 className="text-sm font-bold" style={{ color: "#1F6F6B" }}>
                  {dateKey === todayForSort
                    ? "اليوم"
                    : formatDateLabel(dateKey)}
                </h2>
                <span className="text-xs" style={{ color: "#94A3B8" }}>
                  ({groupedUpcoming[dateKey].length} حجز)
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {groupedUpcoming[dateKey].map((b) => (
                  <BookingRow key={b.id} b={b} />
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedPast).length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: "#EEEBE4" }}>
              <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>
                مواعيد سابقة
              </p>
              {Object.keys(groupedPast)
                .reverse()
                .map((dateKey) => (
                  <div key={dateKey} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={15} style={{ color: "#94A3B8" }} />
                      <h2
                        className="text-sm font-bold"
                        style={{ color: "#94A3B8" }}
                      >
                        {formatDateLabel(dateKey)}
                      </h2>
                      <span className="text-xs" style={{ color: "#94A3B8" }}>
                        ({groupedPast[dateKey].length} حجز)
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {groupedPast[dateKey].map((b) => (
                        <BookingRow key={b.id} b={b} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

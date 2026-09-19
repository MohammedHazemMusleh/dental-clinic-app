import { User, Phone, MessageSquare, AlertCircle } from "lucide-react";

const DetailsStep = ({ name, setName, phone, setPhone, notes, setNotes }) => {
  const nameError = name.trim().length > 0 && name.trim().length < 3;
  const phoneError = phone.trim().length > 0 && !/^05\d{8}$/.test(phone.trim());

  const inputStyle = (hasError) => ({
    borderColor: hasError ? "#DC2626" : "#D6D3CC",
    background: "#FFFFFF",
  });

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm text-right transition-all duration-200 outline-none focus:scale-[1.01]";

  return (
    <div dir="rtl">
      <h2 className="text-3xl font-bold mb-2">بيانات التواصل</h2>
      <p className="text-sm mb-6" style={{ color: "#475569" }}>
        لنتمكن من التواصل معك وتأكيد الموعد
      </p>

      <div className="space-y-4">
        <div>
          <label
            className="text-xs font-medium mb-1.5 flex items-center gap-1.5"
            style={{ color: "#475569" }}
          >
            <User size={14} />
            الاسم الكامل
          </label>
          <input
            type="text"
            dir="rtl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك"
            className={inputClass}
            style={inputStyle(nameError)}
            onFocus={(e) =>
              (e.target.style.borderColor = nameError ? "#DC2626" : "#1F6F6B")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = nameError ? "#DC2626" : "#D6D3CC")
            }
          />
          {nameError && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-xs"
              style={{ color: "#DC2626" }}
            >
              <AlertCircle size={12} />
              الاسم قصير جدًا، اكتب اسمك كاملاً
            </div>
          )}
        </div>

        <div>
          <label
            className="text-xs font-medium mb-1.5 flex items-center gap-1.5"
            style={{ color: "#475569" }}
          >
            <Phone size={14} />
            رقم الجوال
          </label>
          <input
            type="tel"
            dir="rtl"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="059XXXXXXX"
            className={inputClass}
            style={inputStyle(phoneError)}
            onFocus={(e) =>
              (e.target.style.borderColor = phoneError ? "#DC2626" : "#1F6F6B")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = phoneError ? "#DC2626" : "#D6D3CC")
            }
          />
          {phoneError && (
            <div
              className="flex items-center gap-1.5 mt-1.5 text-xs"
              style={{ color: "#DC2626" }}
            >
              <AlertCircle size={12} />
              رقم الجوال غير صحيح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام
            </div>
          )}
        </div>

        <div>
          <label
            className="text-xs font-medium mb-1.5 flex items-center gap-1.5"
            style={{ color: "#475569" }}
          >
            <MessageSquare size={14} />
            ملاحظات إضافية (اختياري)
          </label>
          <textarea
            dir="rtl"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي ملاحظات أو طلبات خاصة..."
            rows={3}
            className={`${inputClass} resize-none`}
            style={inputStyle(false)}
            onFocus={(e) => (e.target.style.borderColor = "#1F6F6B")}
            onBlur={(e) => (e.target.style.borderColor = "#D6D3CC")}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;

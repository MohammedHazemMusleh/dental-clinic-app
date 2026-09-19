import { useState } from "react";
import { Sparkles, Calendar, Clock, User, Check } from "lucide-react";
import ServicesStep from "./ServicesStep";
import DataStep from "./DataStep";
import TimeStep from "./TimeStep";
import DetailsStep from "./DetailsStep";
import ConfirmationStep from "./ConfirmationStep";

const STEPS = ["الخدمة", "التاريخ", "الوقت", "بياناتك", "التأكيد"];
const STEP_ICONS = [Sparkles, Calendar, Clock, User, Check];

const BookingApp = ({ confirmed, setConfirmed }) => {
  const [step, setStep] = useState(0);

  // الذاكرة المشتركة لكل خطوات الحجز
  const [service, setService] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const canGoNext = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!selectedDay;
    if (step === 2) return !!selectedTime;
    if (step === 3) {
      const validName = name.trim().length >= 3;
      const validPhone = /^05\d{8}$/.test(phone.trim());
      return validName && validPhone;
    }
    return true;
  };

  return (
    <div className="p-8 pt-9">
      {!confirmed && (
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => {
            const Icon = STEP_ICONS[i];
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 32,
                      height: 32,
                      background: isDone || isCurrent ? "#1F6F6B" : "#EEEBE4",
                      color: isDone || isCurrent ? "#fff" : "#94A3B8",
                    }}
                  >
                    {isDone ? <Check size={16} /> : <Icon size={15} />}
                  </div>
                  <span
                    className="text-[10px] font-medium whitespace-nowrap"
                    style={{
                      color: isDone || isCurrent ? "#1F6F6B" : "#94A3B8",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-1 flex-1 mx-1 rounded-full transition-all duration-300"
                    style={{
                      background: i < step ? "#1F6F6B" : "#EEEBE4",
                      marginBottom: 18,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {step === 0 && <ServicesStep service={service} setService={setService} />}
      {step === 1 && (
        <DataStep selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      )}
      {step === 2 && (
        <TimeStep
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDay={selectedDay}
        />
      )}
      {step === 3 && (
        <DetailsStep
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          notes={notes}
          setNotes={setNotes}
        />
      )}
      {step === 4 && (
        <ConfirmationStep
          service={service}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          name={name}
          phone={phone}
          notes={notes}
          confirmed={confirmed}
          setConfirmed={setConfirmed}
        />
      )}

      {!confirmed && (
        <div key={step} className="flex gap-3 mt-4 animate-slide-up">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-5 py-2.5 rounded-lg bg-gray-200 transition-all duration-200 hover:bg-gray-300 hover:scale-105 active:scale-95"
          >
            رجوع
          </button>
          {step < 4 && (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canGoNext()}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 hover:shadow-lg disabled:opacity-40 disabled:hover:scale-100"
            >
              التالي
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingApp;

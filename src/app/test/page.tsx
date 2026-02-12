"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CircleHelp, Lock, Settings } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

type Question =
  | {
      id: number;
      type: "binary";
      text: string;
      hint: string;
      options: [
        { title: string; subtitle: string },
        { title: string; subtitle: string }
      ];
    }
  | {
      id: number;
      type: "slider";
      text: string;
      hint: string;
      labels: { top: string; bottom: string };
    };

const questions: Question[] = [
  {
    id: 1,
    type: "binary",
    text: "در محیط‌های اجتماعی، شما بیشتر کدام سبک صحبت کردن را ترجیح می‌دهید؟",
    hint: "صادقانه پاسخ دهید؛ هیچ پاسخ غلطی وجود ندارد.",
    options: [
      {
        title: "اغلب فعالانه صحبت می‌کنم و نظراتم را به اشتراک می‌گذارم",
        subtitle: "من معمولا در گفتگوها پیشقدم می‌شوم و انرژی می‌گیرم.",
      },
      {
        title: "از صحبت کردن اجتناب می‌کنم و بیشتر به دیگران گوش می‌دهم",
        subtitle: "ترجیح می‌دهم ابتدا تحلیل کنم و سپس اگر لازم بود صحبت کنم.",
      },
    ],
  },
  {
    id: 2,
    type: "binary",
    text: "در تصمیم‌گیری‌های مهم، بیشتر به چه چیزی تکیه می‌کنید؟",
    hint: "این سوال برای تحلیل سبک فکری شماست.",
    options: [
      {
        title: "به داده‌ها، منطق و شواهد قابل‌ اندازه‌گیری تکیه می‌کنم",
        subtitle: "از چارچوب مشخص و تحلیل مرحله‌به‌مرحله حس امنیت می‌گیرم.",
      },
      {
        title: "به ارزش‌ها، احساسات و تاثیر تصمیم بر افراد تکیه می‌کنم",
        subtitle: "برای من کیفیت انسانی تصمیم از هر چیز مهم‌تر است.",
      },
    ],
  },
  {
    id: 3,
    type: "slider",
    text: "من استرسی هستم",
    hint: "جایگاه خود را روی طیف مشخص کنید.",
    labels: {
      top: "کاملاً موافق",
      bottom: "کاملاً مخالف",
    },
  },
  {
    id: 4,
    type: "binary",
    text: "برنامه‌ریزی روزانه شما بیشتر چگونه است؟",
    hint: "سبک مدیریت زمان‌تان به پیدا کردن همنشین کمک می‌کند.",
    options: [
      {
        title: "برنامه دقیق می‌چینم و ترجیح می‌دهم طبق آن پیش بروم",
        subtitle: "قابل‌پیش‌بینی بودن روز برایم آرامش‌بخش است.",
      },
      {
        title: "انعطاف را دوست دارم و در لحظه تصمیم می‌گیرم",
        subtitle: "وقتی گزینه‌ها باز هستند بهتر عمل می‌کنم.",
      },
    ],
  },
];

const toPersianNumber = (value: number) =>
  value.toLocaleString("fa-IR", { useGrouping: false });

export default function TestPage() {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [binaryAnswers, setBinaryAnswers] = useState<Record<number, number>>({});
  const [sliderAnswers, setSliderAnswers] = useState<Record<number, number>>({ 3: 2 });

  const question = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const canGoNext = useMemo(() => {
    if (question.type === "binary") {
      return binaryAnswers[question.id] !== undefined;
    }
    return sliderAnswers[question.id] !== undefined;
  }, [binaryAnswers, question, sliderAnswers]);

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    dispatch({ type: "TAKE_TEST" });
    dispatch({ type: "COMPLETE_PROFILE" });
    router.push("/dashboard");
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white px-4 md:px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="rounded-full border border-white/20 px-6 py-2 font-semibold hover:bg-white/10 transition">
            خروج از تست
          </Link>
          <div className="text-center">
            <p className="text-lg font-bold">آزمون تحلیل شخصیت MBTI</p>
            <p className="text-slate-300 text-sm">راهنما</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">راوی</span>
            <Settings size={18} className="text-orange-400" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-400">پیشرفت شما</p>
              <p className="text-4xl font-black text-orange-500">{toPersianNumber(progress)}٪</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-full px-6 py-2 font-bold text-slate-700">
              سوال {toPersianNumber(currentIndex + 1)} از {toPersianNumber(questions.length)}
            </div>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="bg-white rounded-[30px] shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <CircleHelp />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-[42px] leading-tight font-black text-slate-800">
                {question.text}
              </h1>
              <p className="text-slate-400 mt-2 text-lg">{question.hint}</p>
            </div>
          </div>

          {question.type === "binary" && (
            <div className="mt-10 space-y-5">
              {question.options.map((option, optionIndex) => {
                const selected = binaryAnswers[question.id] === optionIndex;
                return (
                  <button
                    key={option.title}
                    onClick={() =>
                      setBinaryAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                    }
                    className={`w-full text-right rounded-[28px] border p-5 md:p-7 transition ${
                      selected
                        ? "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-black ${
                          selected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-xl text-slate-800">{option.title}</p>
                        <p className="text-slate-400 mt-1">{option.subtitle}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "slider" && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-start gap-10">
                <p className="text-xl text-slate-800 mt-1">{question.labels.top}</p>
                <div className="h-[440px] flex items-center justify-center">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={sliderAnswers[question.id] ?? 3}
                    onChange={(event) =>
                      setSliderAnswers((prev) => ({
                        ...prev,
                        [question.id]: Number(event.target.value),
                      }))
                    }
                    className="w-[420px] rotate-[-90deg] accent-orange-500"
                  />
                </div>
                <p className="text-xl text-slate-800 self-end">{question.labels.bottom}</p>
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              onClick={next}
              disabled={!canGoNext}
              className="bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-10 py-4 font-bold text-2xl inline-flex items-center gap-2"
            >
              سوال بعدی
              <ArrowRight />
            </button>

            <button
              onClick={previous}
              disabled={currentIndex === 0}
              className="text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-2xl inline-flex items-center gap-2"
            >
              <ArrowLeft />
              سوال قبلی
            </button>
          </div>
        </section>

        <p className="text-center text-slate-400 mt-8 inline-flex items-center justify-center gap-2 w-full">
          <Lock size={16} /> پاسخ‌های شما کاملا محرمانه باقی می‌ماند و فقط برای تحلیل استفاده می‌شود.
        </p>
      </main>
    </div>
  );
}

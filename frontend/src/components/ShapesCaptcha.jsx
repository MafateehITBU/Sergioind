import React, { useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";

/** ===== Public API =====
 * <ShapesCaptcha
 *   open={boolean}
 *   language={"en"|"ar"|string}
 *   onPass={() => void}
 *   onClose={() => void}
 *   anchorRef={refToButton}
 *   className=""
 * />
 * =======================
 */

const SHAPES = [
  { key: "circle", label: { en: "Circle", ar: "دائرة" }, Svg: Circle },
  { key: "square", label: { en: "Square", ar: "مربع" }, Svg: Square },
  { key: "triangle", label: { en: "Triangle", ar: "مثلث" }, Svg: Triangle },
  { key: "star", label: { en: "Star", ar: "نجمة" }, Svg: Star },
  { key: "hexagon", label: { en: "Hexagon", ar: "سداسي" }, Svg: Hexagon },
];

function Circle(props) {
  return (
    <svg viewBox="0 0 48 48" {...props} aria-hidden="true">
      <circle cx="24" cy="24" r="16" />
    </svg>
  );
}
function Square(props) {
  return (
    <svg viewBox="0 0 48 48" {...props} aria-hidden="true">
      <rect x="12" y="12" width="24" height="24" rx="3" ry="3" />
    </svg>
  );
}
function Triangle(props) {
  return (
    <svg viewBox="0 0 48 48" {...props} aria-hidden="true">
      <polygon points="24,10 38,36 10,36" />
    </svg>
  );
}
function Star(props) {
  return (
    <svg viewBox="0 0 48 48" {...props} aria-hidden="true">
      <path d="M24 6l5.88 11.9 13.12 1.9-9.5 9.26 2.24 13.04L24 35.94 12.26 42.1l2.24-13.04-9.5-9.26 13.12-1.9L24 6z" />
    </svg>
  );
}
function Hexagon(props) {
  return (
    <svg viewBox="0 0 48 48" {...props} aria-hidden="true">
      <polygon points="16,10 32,10 40,24 32,38 16,38 8,24" />
    </svg>
  );
}

function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function ShapesCaptcha({
  open,
  language = "en",
  onPass,
  onClose,
  anchorRef,
  className = "",
}) {
  const isArabic = language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";

  // Build a new challenge whenever the box opens
  const { correct, options } = useMemo(() => {
    const correctShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const distractors = pickRandom(
      SHAPES.filter((s) => s.key !== correctShape.key),
      3
    );
    const all = pickRandom([correctShape, ...distractors], 4);
    return { correct: correctShape, options: all };
  }, [open]);

  // Position above the button
  const [pos, setPos] = useState({ right: 0, bottom: 60 });
  useEffect(() => {
    if (!anchorRef?.current) return;
    const recompute = () => {
      const btn = anchorRef.current;
      setPos({ right: 0, bottom: btn.offsetHeight + 12 });
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [anchorRef]);

  if (!open) return null;

  return (
    <div
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-label={isArabic ? "اختبار التحقق" : "Verification challenge"}
      className={`absolute z-30 rounded-xl shadow-2xl bg-white border border-gray-200 p-4 w-[min(22rem,90%)] ${className}`}
      style={{ right: pos.right, bottom: pos.bottom }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          {isArabic ? "اختيار الشكل الصحيح" : "Select the requested shape"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
          aria-label={isArabic ? "إغلاق" : "Close"}
        >
          ×
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-3">
        {isArabic ? "Please click the" : "Please click the"}{" "}
        <span className="font-semibold">
          {correct.label[isArabic ? "ar" : "en"]}
        </span>
        .
      </p>

      <div className="grid grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              // Success: no success toast, just pass control up
              if (opt.key === correct.key) {
                onPass?.();
              } else {
                // Only show an error toast on wrong choice
                toast.error(isArabic ? "اختيار غير صحيح" : "Wrong choice", {
                  position: "top-right",
                });
              }
            }}
            className="group aspect-square rounded-lg border border-gray-200 hover:border-primary transition flex items-center justify-center cursor-pointer"
            aria-label={opt.label[isArabic ? "ar" : "en"]}
          >
            <opt.Svg className="w-9 h-9 group-hover:scale-110 transition" />
          </button>
        ))}
      </div>

      <div className="mt-3 text-[12px] text-gray-500">
        {isArabic
          ? "Note: this won’t stop advanced bots."
          : "Note: this won’t stop advanced bots."}
      </div>
    </div>
  );
}

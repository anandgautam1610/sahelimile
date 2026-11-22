"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  KeyRound,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  Check,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { setStoredUser, DEMO_VERIFIED_USER, UserProfile } from "@/lib/auth";

type Step = "credentials" | "camera";
type FaceStatus =
  | "loading_model"
  | "align"
  | "detecting"
  | "verified"
  | "rejected_male"
  | "camera_error";

interface LandmarkPoint {
  x: number;
  y: number;
}

function euclideanDistance(p1: LandmarkPoint, p2: LandmarkPoint): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Compute Eye Aspect Ratio (EAR) for a 6-point eye landmark set
function calculateEyeAspectRatio(eyePoints: LandmarkPoint[]): number {
  if (!eyePoints || eyePoints.length < 6) return 0.3;
  // p0 is outer corner, p3 is inner corner
  // p1-p5 vertical line, p2-p4 vertical line
  const vertical1 = euclideanDistance(eyePoints[1], eyePoints[5]);
  const vertical2 = euclideanDistance(eyePoints[2], eyePoints[4]);
  const horizontal = euclideanDistance(eyePoints[0], eyePoints[3]);
  if (horizontal === 0) return 0.3;
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [step, setStep] = useState<Step>("credentials");

  // Form Inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Camera & Face-AI states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [faceStatus, setFaceStatus] = useState<FaceStatus>("loading_model");
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [blinkCount, setBlinkCount] = useState<number>(0);
  const [currentEar, setCurrentEar] = useState<number>(0.3);

  // Refs for tracking EAR transitions across ticks
  const blinkCountRef = useRef<number>(0);
  const eyesClosedRef = useRef<boolean>(false);

  // Stop camera stream cleanly
  const stopCameraStream = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Step 1: Handle Credentials Submission
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (authMode === "signup" && trimmedName.length < 2) {
      setFormError(
        language === "hi"
          ? "कृपया अपना पूरा नाम दर्ज करें।"
          : "Please enter your full name."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError(
        language === "hi"
          ? "कृपया एक मान्य कॉलेज या कॉर्पोरेट ईमेल दर्ज करें।"
          : "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      setFormError(
        language === "hi"
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters."
      );
      return;
    }

    // Advance to Step 2: Live Face Verification
    setStep("camera");
  };

  // Step 2: Initialize Face-API Models and Camera
  useEffect(() => {
    if (step !== "camera") return;

    let isMounted = true;

    async function initFaceAIAndCamera() {
      try {
        setFaceStatus("loading_model");
        blinkCountRef.current = 0;
        eyesClosedRef.current = false;
        setBlinkCount(0);

        const faceapi = await import("@vladmandic/face-api");

        // Load TinyFaceDetector, FaceLandmark68TinyNet, and AgeGenderNet models
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
            faceapi.nets.ageGenderNet.loadFromUri("/models"),
          ]);
        } catch {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(
              "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
            ),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri(
              "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
            ),
            faceapi.nets.ageGenderNet.loadFromUri(
              "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"
            ),
          ]);
        }

        if (!isMounted) return;

        // Start Front Camera
        await startCamera(faceapi);
      } catch (err) {
        console.error("Error loading face-api models or camera:", err);
        if (isMounted) setFaceStatus("camera_error");
      }
    }

    initFaceAIAndCamera();

    return () => {
      isMounted = false;
      stopCameraStream();
    };
  }, [step]);

  // Start front camera and detection loop
  const startCamera = async (faceapi: typeof import("@vladmandic/face-api")) => {
    try {
      setFaceStatus("align");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startDetectionLoop(faceapi);
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setFaceStatus("camera_error");
    }
  };

  // Real-time Detection Loop with 3-Blink Anti-Spoofing
  const startDetectionLoop = (faceapi: typeof import("@vladmandic/face-api")) => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    // 150ms interval ensures responsive EAR blink capture without missing rapid natural blinks
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      try {
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
          )
          .withFaceLandmarks(true)
          .withAgeAndGender();

        if (!detection) {
          // Face left frame or not detected: reset blink count to prevent spoofing
          setFaceStatus("align");
          setConfidenceScore(0);
          blinkCountRef.current = 0;
          eyesClosedRef.current = false;
          setBlinkCount(0);
          return;
        }

        // Face detected: analyze gender
        const gender = detection.gender;
        const probability = detection.genderProbability;
        const confidencePct = Math.round(probability * 100);
        setConfidenceScore(confidencePct);

        // Male detected: reject immediately and reset
        if (gender === "male" && probability >= 0.7) {
          setFaceStatus("rejected_male");
          blinkCountRef.current = 0;
          eyesClosedRef.current = false;
          setBlinkCount(0);
          stopCameraStream();
          return;
        }

        // Female detected: compute EAR for blink state transitions
        if (detection.landmarks) {
          const leftEye = detection.landmarks.getLeftEye();
          const rightEye = detection.landmarks.getRightEye();

          const leftEar = calculateEyeAspectRatio(leftEye);
          const rightEar = calculateEyeAspectRatio(rightEye);
          const avgEar = (leftEar + rightEar) / 2;
          setCurrentEar(Number(avgEar.toFixed(2)));

          // EAR state transition logic:
          // eyesOpen -> eyesClosed when avgEar < 0.22
          // eyesClosed -> eyesOpen when avgEar > 0.25 -> increments blinkCount
          if (!eyesClosedRef.current && avgEar < 0.22) {
            eyesClosedRef.current = true;
          } else if (eyesClosedRef.current && avgEar > 0.25) {
            eyesClosedRef.current = false;
            if (gender === "female" && probability >= 0.7) {
              blinkCountRef.current = Math.min(3, blinkCountRef.current + 1);
              const newCount = blinkCountRef.current;
              setBlinkCount(newCount);
            }
          }

          setFaceStatus("detecting");

          // SUCCESS CONDITION:
          // Both female gender (confidence > 0.70) AND 3 confirmed blinks!
          if (
            gender === "female" &&
            probability >= 0.7 &&
            blinkCountRef.current >= 3
          ) {
            setFaceStatus("verified");
            stopCameraStream();

            const user: UserProfile = {
              name: fullName.trim() || "Aditi Rao",
              email: email.trim() || "aditi.rao@manit.ac.in",
              gender: "female",
              verified: true,
              verifiedAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              verificationMethod: "face-ai",
              confidence: Number(probability.toFixed(2)),
              avatarUrl:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            };
            setStoredUser(user);

            // Redirect to /app after celebration
            setTimeout(() => {
              router.push("/app");
            }, 1600);
          }
        }
      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 150);
  };

  // Fallback: Judge Demo Access (Bypasses camera for evaluators without webcam)
  const handleJudgeDemoBypass = () => {
    stopCameraStream();
    const demoUser: UserProfile = {
      ...DEMO_VERIFIED_USER,
      name: fullName.trim() || DEMO_VERIFIED_USER.name,
      email: email.trim() || DEMO_VERIFIED_USER.email,
    };
    setStoredUser(demoUser);
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#0F172A] flex flex-col justify-between selection:bg-[#0D9488]/20 selection:text-[#0D9488]">
      {/* Top Bar with Language Switcher & Home Link */}
      <div className="max-w-md w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "hi" ? "वापस मुख्य पृष्ठ" : "Back to Home"}</span>
        </Link>

        {/* Bilingual EN | हिंदी Switcher */}
        <div className="flex items-center bg-white/80 rounded-full p-0.5 border border-amber-200 shadow-xs">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              language === "en"
                ? "bg-[#0D9488] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              language === "hi"
                ? "bg-[#0D9488] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Authentication Container */}
      <main className="max-w-md w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-amber-200/80 space-y-4">
          {/* Brand Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#0D9488] text-white mx-auto flex items-center justify-center font-extrabold text-2xl shadow-md shadow-teal-900/15">
              🛺
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Saheli<span className="text-[#0D9488]">Mile</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-1">
            <div
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                step === "credentials"
                  ? "bg-teal-50 text-teal-800 border border-teal-300"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#0D9488] text-white text-[10px] flex items-center justify-center font-black">
                1
              </span>
              <span>{language === "hi" ? "खाता विवरण" : "Credentials"}</span>
            </div>

            <div className="w-6 h-0.5 bg-slate-200" />

            <div
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                step === "camera"
                  ? "bg-teal-50 text-teal-800 border border-teal-300"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#0D9488] text-white text-[10px] flex items-center justify-center font-black">
                2
              </span>
              <span>{language === "hi" ? "लाइवनेस व फेस AI" : "3-Blink Face AI"}</span>
            </div>
          </div>

          {/* ================= STEP 1: CREDENTIALS FORM ================= */}
          {step === "credentials" && (
            <div className="space-y-4">
              {/* Tab Selector: Create Account vs Sign In */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === "signup"
                      ? "bg-white text-slate-900 shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t("createAccountTab")}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    authMode === "signin"
                      ? "bg-white text-slate-900 shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t("signInTab")}
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                {/* Full Name (for signup) */}
                {authMode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {t("fullNameLabel")} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t("fullNamePlaceholder")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    {t("emailLabel")} *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    {t("passwordLabel")} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("passwordPlaceholder")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Anti-Spoofing & Women Safety Notice */}
                <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-start gap-2 text-[10px] text-teal-900 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Spoofing 3-Blink Liveness:</strong> Step 2 tests real human presence via eye-blink detection alongside gender classification to prevent photo spoofing.
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#0D9488] hover:bg-[#0f766e] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-teal-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{t("continueToVerifyBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 2: LIVE CAMERA 3-BLINK FACE-AI ================= */}
          {step === "camera" && (
            <div className="space-y-3.5">
              <div className="text-center space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-orange-800 bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-200">
                  <ShieldCheck className="w-3 h-3 text-orange-600" />
                  <span>{t("blinkAntiSpoof")}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 pt-0.5">
                  {t("faceVerifyStepTitle")}
                </h3>
              </div>

              {/* Viewfinder Circle Container with Glowing Ring */}
              <div className="relative mx-auto my-1 w-60 h-60 flex items-center justify-center">
                {/* Visual Status Ring */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    faceStatus === "verified"
                      ? "ring-8 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                      : faceStatus === "rejected_male"
                      ? "ring-8 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                      : faceStatus === "detecting"
                      ? blinkCount > 0
                        ? "ring-8 ring-emerald-400 animate-pulse"
                        : "ring-8 ring-orange-400 animate-pulse"
                      : "ring-4 ring-teal-500/60"
                  }`}
                />

                {/* Circular Video Feed */}
                <div className="w-52 h-52 rounded-full overflow-hidden bg-slate-900 relative shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover -scale-x-100"
                  />

                  {/* Liveness Scanning Line Effect */}
                  {faceStatus === "detecting" && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_#2dd4bf] animate-bounce" />
                  )}

                  {/* Success Overlay on Verification */}
                  {faceStatus === "verified" && (
                    <div className="absolute inset-0 bg-emerald-600/85 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1 animate-in zoom-in-75 duration-200">
                      <CheckCircle2 className="w-14 h-14 text-white animate-bounce" />
                      <span className="text-xs font-black uppercase tracking-wider text-center px-2">
                        {t("verifiedFemaleCommuter")}
                      </span>
                      <span className="text-[10px] text-emerald-100 font-bold">
                        3/3 Blinks Confirmed ✓
                      </span>
                    </div>
                  )}

                  {/* Rejected Overlay */}
                  {faceStatus === "rejected_male" && (
                    <div className="absolute inset-0 bg-rose-900/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center space-y-2 animate-in zoom-in-75">
                      <AlertTriangle className="w-12 h-12 text-rose-300" />
                      <span className="text-xs font-black uppercase">
                        Verification Denied
                      </span>
                    </div>
                  )}

                  {/* Camera Error / Loading state */}
                  {faceStatus === "loading_model" && (
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-300 p-4 text-center space-y-2">
                      <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                      <span className="text-[11px] font-bold">
                        Loading Landmarks & Face AI...
                      </span>
                    </div>
                  )}

                  {faceStatus === "camera_error" && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4 text-center space-y-2">
                      <Camera className="w-8 h-8 text-rose-400" />
                      <span className="text-[10px] text-slate-300 font-bold leading-tight">
                        {t("cameraPermissionError")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3-Blink Liveness Visual Indicators */}
              <div className="space-y-2 pt-1 text-center">
                {/* 3 Blink Dots */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map((num) => {
                    const isBlinked = blinkCount >= num;
                    return (
                      <div
                        key={num}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all ${
                          isBlinked
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20 scale-105"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isBlinked ? "bg-white" : "bg-slate-300"
                          }`}
                        />
                        <span>
                          {t("blinkDot")} {num}
                        </span>
                        {isBlinked && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Instructions & Prompts */}
                {faceStatus === "align" && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t("alignFace")}</span>
                  </div>
                )}

                {faceStatus === "detecting" && (
                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-800">
                      {language === "hi"
                        ? `लाइव पुष्टि के लिए अपनी आँखें 3 बार झपकाएं (${blinkCount}/3)`
                        : `Blink your eyes 3 times to verify live presence (${blinkCount}/3)`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-2">
                      <span className="text-emerald-700 font-bold">
                        Female Match: {confidenceScore}%
                      </span>
                      <span>•</span>
                      <span>Eye EAR: {currentEar}</span>
                    </div>
                  </div>
                )}

                {faceStatus === "verified" && (
                  <div className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-300 inline-block shadow-sm">
                    🎉 {t("verifiedFemaleCommuter")}! Unlocking SaheliMile...
                  </div>
                )}

                {faceStatus === "rejected_male" && (
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-300 text-left space-y-2 text-rose-950">
                    <p className="text-xs font-bold leading-relaxed">
                      {t("exclusiveWomenNotice")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("credentials")}
                      className="text-xs font-black text-rose-700 underline cursor-pointer"
                    >
                      ← Return to Login Form
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Back button */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setStep("credentials");
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? "वापस बदलें" : "Edit Details"}</span>
                </button>

                {faceStatus === "camera_error" && (
                  <button
                    type="button"
                    onClick={() => {
                      import("@vladmandic/face-api").then(startCamera);
                    }}
                    className="text-xs font-black text-teal-700 underline cursor-pointer"
                  >
                    {t("startCameraBtn")}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fallback Link: Judge Demo Access (Bypass without camera) */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleJudgeDemoBypass}
              className="text-[11px] font-extrabold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-xl border border-teal-200 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{t("judgeDemoBypass")} (1-Tap Bypass)</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-1">
              For evaluators & testing without a webcam. Activates verified commuter profile.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Honest Data Disclosure */}
      <footer className="max-w-md w-full mx-auto px-4 py-4 text-center">
        <div className="p-2.5 rounded-2xl bg-amber-100/60 border border-amber-200 text-amber-900 text-[10px] leading-tight flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Anti-Spoofing Facial AI:</strong> Eye aspect ratio (EAR) analysis ensures live human presence. Video frames are never recorded or transmitted.
          </span>
        </div>
      </footer>
    </div>
  );
}

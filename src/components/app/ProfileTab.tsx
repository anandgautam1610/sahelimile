"use client";

import React from "react";
import {
  ShieldCheck,
  User,
  Phone,
  Building,
  Award,
  Lock,
  RefreshCw,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface ProfileTabProps {
  onResetDemo: () => void;
}

export default function ProfileTab({ onResetDemo }: ProfileTabProps) {
  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-orange-400 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-2xl bg-teal-50 flex items-center justify-center text-teal-800 text-xl font-black">
              AR
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Aditi Rao
              </h3>
              <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Student & Tech Fellow • MANIT Bhopal
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
              <span>Member since Aug 2025</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">100% Trust Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Badges */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
          Verified Credentials
        </span>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-teal-700" />
              <div>
                <span className="font-bold text-slate-800 block">
                  MANIT Bhopal (Computer Science)
                </span>
                <span className="text-[10px] text-slate-500">
                  Student ID Card verified via Institutional Portal
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-600" />
              <div>
                <span className="font-bold text-slate-800 block">
                  DigiLocker / Aadhaar Virtual ID
                </span>
                <span className="text-[10px] text-slate-500">
                  Encrypted zero-knowledge hash match
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
              Linked
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Guardian Contacts */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Comfort Guardians (Auto-Notify)
          </span>
          <span className="text-[10px] font-bold text-orange-600">3 Active</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-bold text-slate-800 block">Mom (Sunita Rao)</span>
              <span className="text-[10px] text-slate-500">+91 9826 ••••••</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Primary SMS
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="font-bold text-slate-800 block">Sister (Neha Rao)</span>
              <span className="text-[10px] text-slate-500">+91 9425 ••••••</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              WhatsApp Alert
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
            <div>
              <span className="font-bold block">MP Police Women Helpline</span>
              <span className="text-[10px] text-rose-600">Toll-Free 1090</span>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              SOS Hotline
            </span>
          </div>
        </div>
      </div>

      {/* Pilot Controls */}
      <div className="pt-2">
        <button
          onClick={onResetDemo}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Pilot Evaluation Cache</span>
        </button>
      </div>
    </div>
  );
}

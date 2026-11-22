"use client";

import dynamic from "next/dynamic";
import { LeafletMapProps } from "./LeafletInnerMap";
import { Loader2 } from "lucide-react";

const DynamicMap = dynamic(() => import("./LeafletInnerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full rounded-2xl bg-amber-50/60 border border-amber-200/60 flex flex-col items-center justify-center text-slate-500 gap-2">
      <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
      <span className="text-xs font-semibold tracking-wide text-slate-600">
        Loading OpenStreetMap & OSRM Routes...
      </span>
    </div>
  ),
});

export default function LeafletMap(props: LeafletMapProps) {
  return <DynamicMap {...props} />;
}

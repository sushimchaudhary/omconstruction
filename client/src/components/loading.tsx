import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 shadow-sm relative z-10 p-2">
          <Image
            src="/loading.png"
            alt="Loading..."
            width={80}
            height={80}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div className="absolute w-24 h-24 border-4 border-transparent border-t-[#06b6d4] rounded-full animate-spin" />
      </div>
    </div>
  );
}
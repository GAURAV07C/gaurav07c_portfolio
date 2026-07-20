export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-300/20 border-t-emerald-300 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-emerald-300/20 rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-white/60 mt-6 text-sm">Loading...</p>
    </div>
  );
}

export default function ClayBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
      <div className="absolute h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/10 blur-3xl -top-[10%] -left-[10%] animate-clay-float" />
      <div className="absolute h-[50vh] w-[50vh] rounded-full bg-[#EC4899]/10 blur-3xl -right-[5%] top-[15%] animate-clay-float-delayed animation-delay-2000" />
      <div className="absolute h-[45vh] w-[45vh] rounded-full bg-[#0EA5E9]/10 blur-3xl bottom-[5%] left-[20%] animate-clay-float-slow animation-delay-4000" />
      <div className="absolute h-[35vh] w-[35vh] rounded-full bg-[#10B981]/8 blur-3xl bottom-[20%] -right-[5%] animate-clay-float animation-delay-6000" />
    </div>
  );
}

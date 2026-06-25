export default function Header() {
  return (
    <header className="bg-[#003366] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#003366] font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Styresaker Helse</h1>
            <p className="text-blue-200 text-xs mt-0.5">
              Nasjonal oversikt: HOD · RHF · HF · IKT-selskaper
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

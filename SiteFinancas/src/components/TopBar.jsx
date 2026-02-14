function TopBar({ onReset }) {
  return (
    <div className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200 px-5 py-4 flex justify-between items-center z-50">
      
      <h1 className="text-lg font-semibold text-[#1c1c1e]">
        Finanças
      </h1>

      <button
        onClick={onReset}
        className="text-sm text-blue-500 active:opacity-70 transition"
      >
        Reset
      </button>

    </div>
  )
}

export default TopBar

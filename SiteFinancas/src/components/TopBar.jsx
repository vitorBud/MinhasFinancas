function TopBar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-950 border-b border-gray-800 px-4 py-3 flex justify-between items-center z-50">
      
      <h1 className="text-lg font-bold">
        💸 Finanças
      </h1>

      <button className="text-sm text-gray-400 hover:text-white">
        Reset
      </button>

    </div>
  )
}

export default TopBar

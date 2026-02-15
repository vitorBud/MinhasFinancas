function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black transition-colors duration-300">

      <div className="text-center space-y-6">

        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm tracking-wide">
          Carregando suas finanças...
        </p>

      </div>

    </div>
  )
}

export default LoadingScreen

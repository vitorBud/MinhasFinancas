function BillingDayCard({ billingDay, setBillingDay }) {
  return (
    <div className="
      bg-white 
      dark:bg-slate-900
      border border-slate-200 
      dark:border-slate-700
      shadow-sm 
      dark:shadow-black/40
      rounded-2xl 
      p-6 
      space-y-4
      transition-colors duration-300
    ">

      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        📅 Dia da Virada do Cartão
      </h2>

      <input
        type="number"
        min="1"
        max="31"
        value={billingDay}
        onChange={(e) => setBillingDay(Number(e.target.value))}
        className="
          w-full
          px-4 py-3
          rounded-xl
          bg-white/60
          dark:bg-white/10
          border border-white/30
          dark:border-white/10
          text-slate-900
          dark:text-white
          placeholder:text-slate-400
          dark:placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          backdrop-blur
        "
      />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Defina o dia em que sua fatura fecha.
      </p>

    </div>
  )
}

export default BillingDayCard

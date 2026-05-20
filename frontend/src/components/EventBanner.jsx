const EventBanner = ({ title, status, description }) => {
  return (
    <div className="min-w-[260px] bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-lime-400 transition-all duration-300">
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="text-xs bg-lime-400 text-black px-2 py-1 rounded-full">
          {status}
        </span>
      </div>

      <p className="text-sm text-zinc-400">
        {description}
      </p>

    </div>
  );
};

export default EventBanner;
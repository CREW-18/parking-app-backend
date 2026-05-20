import { useNavigate } from "react-router-dom";

const LocationCard = ({ name, distance, slots }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/booking", {
      state: { name, distance, slots },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 cursor-pointer hover:border-lime-400 transition"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-semibold">{name}</h3>
          <p className="text-zinc-400 text-sm">{distance} away</p>
        </div>

        <div className="text-right">
          <p className="text-lime-400 font-semibold">{slots}</p>
          <p className="text-zinc-400 text-xs">slots left</p>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
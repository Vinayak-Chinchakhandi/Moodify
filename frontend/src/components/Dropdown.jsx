const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  gradient = "from-cyan-500 via-pink-500 to-orange-400",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-300 mb-2 text-lg">{label}</label>
      )}
      <div className={`rounded-lg p-[2px] bg-gradient-to-r ${gradient}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white 
            appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400 
            cursor-pointer transition"
        >
          {options.map((option, i) => (
            <option key={i} value={option} className="bg-[#111] text-white">
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;

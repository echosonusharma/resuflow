interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export default function SelectInput<T extends string>({ label, value, options, onChange }: SelectInputProps<T>) {
  return (
    <div className="cz-form-group">
      <label className="cz-form-label">{label}</label>
      <div className="cz-select-wrap">
        {/* cast: the select only ever emits values taken from `options`, which are all T */}
        <select className="cz-select" value={value} onChange={e => onChange(e.target.value as T)}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="cz-select-arrow">▾</span>
      </div>
    </div>
  );
}

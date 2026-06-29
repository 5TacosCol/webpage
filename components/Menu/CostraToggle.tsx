'use client'

interface Props {
  value: boolean
  onChange: (v: boolean) => void
}

export default function CostraToggle({ value, onChange }: Props) {
  return (
    <label className="flex items-center justify-between cursor-pointer my-2">
      <span className="text-white/80 text-sm font-body">
        Costra de queso <span className="text-dorado">+$1.600</span>
      </span>
      <div
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-dorado' : 'bg-white/20'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
    </label>
  )
}

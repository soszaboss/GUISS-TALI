// components/ChoiceSelect.tsx
import { type FC } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type ChoiceOption = {
  label: string
  value: string | number
}

type ChoiceSelectProps = {
  name: string
  options: ChoiceOption[]
  value: string | number | (string | number)[]
  onChange: (value: string | number | (string | number)[]) => void
  multiple?: boolean
  label?: string
  disabled?: boolean
}

export const ChoiceSelect: FC<ChoiceSelectProps> = ({
  name,
  options,
  value,
  onChange,
  multiple = false,
  label,
  disabled = false,
}) => {
  if (multiple) {
    const selected = Array.isArray(value) ? value : []

    const handleToggle = (val: string | number) => {
      if (selected.includes(val)) {
        onChange(selected.filter((v) => v !== val))
      } else {
        onChange([...selected, val])
      }
    }

    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <div className="space-y-1 rounded-md border p-2">
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${name}-${opt.value}`}
                checked={selected.includes(opt.value)}
                onCheckedChange={() => handleToggle(opt.value)}
                disabled={disabled}
              />
              <label
                htmlFor={`${name}-${opt.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select
        value={value as string}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionnez une option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
}

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: FormFieldWrapperProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <Label htmlFor={name}>{label}</Label>
          <Input id={name} placeholder={placeholder} {...field} />
          {fieldState.error && (
            <span className="text-xs text-red-500">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}

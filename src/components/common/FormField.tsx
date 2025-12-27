import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface TextareaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  description,
  disabled,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  error,
  description,
  disabled,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  description,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

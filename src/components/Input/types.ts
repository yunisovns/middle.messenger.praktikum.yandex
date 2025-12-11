export interface InputProps {
  id?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onBlur?: (e: FocusEvent) => void;
  onInput?: (e: Event) => void;
}

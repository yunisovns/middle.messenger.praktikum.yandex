export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

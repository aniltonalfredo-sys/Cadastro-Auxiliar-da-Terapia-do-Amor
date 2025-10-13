import { Input } from "./ui/input";
import * as React from "react";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatPhoneNumber = (input: string) => {
      // Remove tudo exceto números
      const numbers = input.replace(/\D/g, "");
      
      // Limita a 12 dígitos (244 + 9 dígitos)
      const limited = numbers.substring(0, 12);
      
      // Aplica a máscara +244 9xx xxx xxx
      let formatted = "+244 ";
      
      if (limited.length > 3) {
        formatted += limited.substring(3, 6);
      }
      
      if (limited.length > 6) {
        formatted += " " + limited.substring(6, 9);
      }
      
      if (limited.length > 9) {
        formatted += " " + limited.substring(9, 12);
      }
      
      return formatted.trim();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Se o usuário apagar tudo, limpa o campo
      if (inputValue === "" || inputValue === "+") {
        e.target.value = "";
        onChange(e);
        return;
      }
      
      // Se não começar com +244, adiciona automaticamente
      let processedValue = inputValue;
      if (!inputValue.startsWith("+244")) {
        const numbers = inputValue.replace(/\D/g, "");
        processedValue = "+244" + numbers;
      }
      
      const formatted = formatPhoneNumber(processedValue);
      e.target.value = formatted;
      onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPosition = input.selectionStart || 0;
      
      // Não permite apagar o +244
      if (e.key === "Backspace" && cursorPosition <= 5) {
        e.preventDefault();
      }
    };

    return (
      <Input
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+244 9XX XXX XXX"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

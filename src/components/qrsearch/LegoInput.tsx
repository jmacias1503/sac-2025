"use client";

import { useRef, useState, useEffect } from "react";
import Lottie from "lottie-react";
import animations from "../animations";
import cursorAnimation from "../../assets/lottie/cursor.json";
import { Howl } from "howler";

interface LegoInputProps {
  value?: string;
  onChange?: (newValue: string) => void;
  maxLength?: number;
  className?: string;
}

const LegoInput: React.FC<LegoInputProps> = ({
  value = "",
  onChange,
  maxLength = 6,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState<string[]>(value.split(""));
  const [isFocused, setIsFocused] = useState(false);
  const soundRefs = useRef<Howl[]>([]);
  const blockSound = "/media/lego-building-classic-208359.mp3";

  useEffect(() => {
    soundRefs.current = Array.from(
      { length: 10 },
      () =>
        new Howl({
          src: [blockSound],
          html5: true,
        })
    );

    return () => {
      soundRefs.current.forEach((sound) => sound.unload());
    };
  }, []);

  useEffect(() => {
    setInputValue(value.split(""));
  }, [value]);

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Permitir solo números
    const digits = newValue.split("").slice(0, maxLength); // Limitar longitud
  
    // Detectar si se eliminó un número
    if (digits.length < inputValue.length) {
      const lastDigit = Number(inputValue[inputValue.length - 1]); // Último número antes de borrar
      soundRefs.current[lastDigit]?.stop(); // Detener sonido del número eliminado
    }
  
    setInputValue(digits);
    onChange?.(digits.join(""));
  
    // Reproducir sonido del nuevo número ingresado
    if (digits.length > inputValue.length) {
      const lastDigit = Number(digits[digits.length - 1]);
      soundRefs.current[lastDigit]?.play();
    }
  };  

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-auto ${className}`}
    >
      {/* Contenedor de números */}
      <div
        className={`flex gap-1 md:gap-2.5 border-2 border-blacksac rounded-md transition-all ${
          isFocused ? "border-blue-400" : ""
        }`}
        onClick={() => setIsFocused(true)}
      >
        {[...Array(maxLength)].map((_, index) => {
          const digit = inputValue[index];
          return (
            <div
              key={index}
              className="w-[12vw] max-w-24 h-[16vw] max-h-32 flex items-center justify-center"
            >
              {digit ? (
                <Lottie
                  animationData={animations[Number(digit)]}
                  loop={false}
                  autoplay
                />
              ) : index === inputValue.length ? (
                <Lottie animationData={cursorAnimation} loop autoplay />
              ) : (
                <div />
              )}
            </div>
          );
        })}
      </div>

      {/* Input oculto */}
      <input
        autoFocus
        type="text"
        maxLength={maxLength}
        onChange={(e) => handleTextInput(e)}
        value={inputValue.join("")}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute w-[78vw] max-w-157 h-[16vw] max-h-32 opacity-0"
      />
    </div>
  );
};

export default LegoInput;

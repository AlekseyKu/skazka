import type { ButtonHTMLAttributes, ReactNode } from "react";

import "../../styles/variables.css";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  loading,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const classes = [
    "btn",
    `btn--${variant}`,
    isDisabled ? "btn--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={isDisabled} {...rest}>
      {loading && <span className="btn__spinner" aria-hidden />}
      <span className="btn__label">{children}</span>
    </button>
  );
}


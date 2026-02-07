import type React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  const classes = ["input", className].filter(Boolean).join(" ");
  return <input className={classes} {...props} />;
}

import type React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
}

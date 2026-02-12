import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...rest }: CardProps) {
  const classes = ["card", "anim-fade-in", className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}


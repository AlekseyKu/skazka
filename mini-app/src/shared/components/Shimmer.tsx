import type { HTMLAttributes } from "react";

type ShimmerProps = HTMLAttributes<HTMLDivElement>;

export default function Shimmer({ className, ...rest }: ShimmerProps) {
  const classes = ["shimmer", className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}


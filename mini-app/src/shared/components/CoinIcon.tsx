interface CoinIconProps {
  size?: number;
  className?: string;
}

export default function CoinIcon({ size = 18, className }: CoinIconProps) {
  return (
    <img
      src="/assets/icons/coin.webp"
      alt="монета"
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
}


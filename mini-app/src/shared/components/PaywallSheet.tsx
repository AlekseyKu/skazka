import BottomSheet from "./BottomSheet";
import Button from "./Button";

import { useUIStore } from "../stores/uiStore";

export default function PaywallSheet() {
  const paywallOpen = useUIStore((s) => s.paywallOpen);
  const closePaywall = useUIStore((s) => s.closePaywall);
  const paywallContext = useUIStore((s) => s.paywallContext);

  return (
    <BottomSheet
      open={paywallOpen}
      onClose={closePaywall}
      title="Магия временно иссякла"
      footer={
        <Button style={{ width: "100%" }} onClick={closePaywall}>
          Понятно
        </Button>
      }
    >
      <p className="text-muted" style={{ marginBottom: 12 }}>
        {paywallContext ?? "Лимит на сегодня достигнут. Можно оформить подписку или купить монеты."}
      </p>
      {/* Реальные кнопки покупки/подписки будут добавлены позже */}
    </BottomSheet>
  );
}


import type { PropsWithChildren, ReactNode } from "react";

interface BottomSheetProps extends PropsWithChildren {
  title?: string;
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
}

export default function BottomSheet({
  title,
  open,
  onClose,
  children,
  footer,
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="bottom-sheet">
      <div className="bottom-sheet__backdrop" onClick={onClose} />
      <div className="bottom-sheet__content anim-slide-up" role="dialog">
        <div className="bottom-sheet__handle" />
        {title && <h2 className="bottom-sheet__title">{title}</h2>}
        <div className="bottom-sheet__body">{children}</div>
        {footer && <div className="bottom-sheet__footer">{footer}</div>}
      </div>
    </div>
  );
}


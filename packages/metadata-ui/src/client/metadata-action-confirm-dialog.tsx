"use client";

import { useEffect, useRef } from "react";

import type { MetadataAction } from "../contracts/action.contract.js";

export interface MetadataActionConfirmDialogProps {
  readonly action: MetadataAction;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly open: boolean;
}

export function MetadataActionConfirmDialog({
  action,
  open,
  onCancel,
  onConfirm,
}: MetadataActionConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirm = action.confirm;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!(dialog && confirm)) {
      return;
    }

    if (open) {
      if (typeof dialog.showModal === "function") {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        dialog.setAttribute("open", "");
      }
      return;
    }

    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
      return;
    }

    dialog.removeAttribute("open");
  }, [confirm, open]);

  if (!confirm) {
    return null;
  }

  const titleId = `${action.key}-confirm-title`;
  const descriptionId = `${action.key}-confirm-description`;

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="metadata-action-confirm-dialog"
      data-action-key={action.key}
      data-slot="metadata-action-confirm-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      ref={dialogRef}
    >
      <h2 className="metadata-action-confirm-dialog-title" id={titleId}>
        {confirm.title}
      </h2>
      <p
        className="metadata-action-confirm-dialog-description"
        id={descriptionId}
      >
        {confirm.description}
      </p>
      <div
        className="metadata-action-confirm-dialog-actions"
        data-slot="metadata-action-confirm-dialog-actions"
      >
        <button
          className="metadata-action-button"
          data-action-group="secondary"
          onClick={onCancel}
          type="button"
        >
          {confirm.cancelLabel ?? "Cancel"}
        </button>
        <button
          className="metadata-action-button"
          data-action-group="primary"
          onClick={onConfirm}
          type="button"
        >
          {confirm.confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

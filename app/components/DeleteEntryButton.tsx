"use client";

import { useTransition } from "react";
import { deleteEntry } from "@/app/admin/actions";

type Props = {
  entity: "career" | "education";
  id: string;
  label: string;
};

export default function DeleteEntryButton({ entity, id, label }: Props) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirm(`정말 삭제할까요?\n\n${label}`)) return;
    startTransition(async () => {
      await deleteEntry(entity, id);
    });
  };

  return (
    <button
      type="button"
      className="entry-controls__btn entry-controls__btn--danger"
      onClick={onClick}
      disabled={pending}
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}

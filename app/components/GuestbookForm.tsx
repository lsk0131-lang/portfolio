"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function GuestbookForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "error" | ""; text: string }>({
    tone: "",
    text: "",
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      setStatus({ tone: "error", text: "이름과 메시지를 모두 입력해 주세요." });
      return;
    }
    if (trimmedMessage.length > 1000) {
      setStatus({ tone: "error", text: "메시지는 1000자 이내로 입력해 주세요." });
      return;
    }

    setStatus({ tone: "", text: "전송 중…" });
    const supabase = createClient();
    const { error } = await supabase
      .from("guestbook")
      .insert({ name: trimmedName, message: trimmedMessage });

    if (error) {
      setStatus({ tone: "error", text: `등록 실패: ${error.message}` });
      return;
    }

    setName("");
    setMessage("");
    setStatus({ tone: "ok", text: "방명록이 등록되었습니다. 감사합니다!" });
    startTransition(() => router.refresh());
  };

  return (
    <form className="guestbook__form" onSubmit={onSubmit}>
      <div className="guestbook__row">
        <input
          className="guestbook__input"
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          required
        />
        <textarea
          className="guestbook__textarea"
          name="message"
          placeholder="메시지를 남겨 주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
        />
      </div>
      <div className="guestbook__actions">
        <span
          className="guestbook__status"
          data-tone={status.tone || undefined}
          aria-live="polite"
        >
          {status.text}
        </span>
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "등록 중…" : "방명록 남기기"}
        </button>
      </div>
    </form>
  );
}

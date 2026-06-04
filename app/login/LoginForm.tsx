"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "error" | ""; text: string }>({
    tone: "",
    text: "",
  });
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ tone: "error", text: "이메일을 입력해 주세요." });
      return;
    }

    setPending(true);
    setStatus({ tone: "", text: "매직 링크를 보내는 중…" });

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    setPending(false);

    if (error) {
      setStatus({ tone: "error", text: `로그인 실패: ${error.message}` });
      return;
    }
    setStatus({
      tone: "ok",
      text: "메일함을 확인해 주세요. 매직 링크를 보냈습니다.",
    });
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label className="auth-form__label">
        이메일
        <input
          className="guestbook__input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <div className="auth-form__actions">
        <span
          className="guestbook__status"
          data-tone={status.tone || undefined}
          aria-live="polite"
        >
          {status.text}
        </span>
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "전송 중…" : "매직 링크 받기"}
        </button>
      </div>
    </form>
  );
}

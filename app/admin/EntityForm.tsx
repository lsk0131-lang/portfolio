"use client";

import { useState } from "react";
import Link from "next/link";
import { createEntry, updateEntry } from "./actions";

type Mode = "new" | "edit";
type Entity = "career" | "education";

type Defaults = {
  id?: string;
  field1?: string;
  field2?: string;
  started_on?: string;
  ended_on?: string | null;
};

type Props = {
  entity: Entity;
  mode: Mode;
  defaults?: Defaults;
};

const LABELS: Record<Entity, { field1: string; field2: string; titleNew: string; titleEdit: string }> = {
  career: {
    field1: "회사 / 기관",
    field2: "직책",
    titleNew: "경력 추가",
    titleEdit: "경력 수정",
  },
  education: {
    field1: "학교",
    field2: "전공 · 학위",
    titleNew: "학력 추가",
    titleEdit: "학력 수정",
  },
};

const NAMES: Record<Entity, { field1: string; field2: string }> = {
  career: { field1: "company", field2: "role" },
  education: { field1: "school", field2: "degree" },
};

export default function EntityForm({ entity, mode, defaults = {} }: Props) {
  const labels = LABELS[entity];
  const names = NAMES[entity];
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    setError(null);
    try {
      if (mode === "new") {
        await createEntry(entity, formData);
      } else if (defaults.id) {
        await updateEntry(entity, defaults.id, formData);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "저장 실패";
      // Next.js redirect throws a NEXT_REDIRECT signal — silently surface only real errors
      if (/NEXT_REDIRECT/i.test(msg)) throw e;
      setError(msg);
    }
  };

  return (
    <div className="entity-form-wrap">
      <h1 className="section__title">{mode === "new" ? labels.titleNew : labels.titleEdit}</h1>

      <form className="entity-form" action={onSubmit}>
        <label className="entity-form__row">
          <span className="entity-form__label">{labels.field1}</span>
          <input
            className="guestbook__input"
            type="text"
            name={names.field1}
            defaultValue={defaults.field1 ?? ""}
            required
            maxLength={100}
          />
        </label>
        <label className="entity-form__row">
          <span className="entity-form__label">{labels.field2}</span>
          <input
            className="guestbook__input"
            type="text"
            name={names.field2}
            defaultValue={defaults.field2 ?? ""}
            required
            maxLength={100}
          />
        </label>
        <label className="entity-form__row">
          <span className="entity-form__label">시작일</span>
          <input
            className="guestbook__input"
            type="date"
            name="started_on"
            defaultValue={defaults.started_on ?? ""}
            required
          />
        </label>
        <label className="entity-form__row">
          <span className="entity-form__label">
            종료일 <span className="entity-form__hint">(현재/재학중이면 비워두세요)</span>
          </span>
          <input
            className="guestbook__input"
            type="date"
            name="ended_on"
            defaultValue={defaults.ended_on ?? ""}
          />
        </label>

        {error && (
          <p className="guestbook__status" data-tone="error">
            {error}
          </p>
        )}

        <div className="entity-form__actions">
          <Link href="/admin" className="btn btn--ghost">
            취소
          </Link>
          <button className="btn btn--primary" type="submit">
            {mode === "new" ? "추가" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

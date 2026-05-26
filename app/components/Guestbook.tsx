import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import GuestbookForm from "./GuestbookForm";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

export default async function Guestbook() {
  let entries: Entry[] = [];
  let error: unknown = null;
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const result = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    entries = (result.data ?? []) as Entry[];
    error = result.error;
  } catch (e) {
    // .env.local 미설정 등으로 createClient 가 throw 하는 경우 graceful 처리
    error = e;
  }

  return (
    <div className="guestbook">
      <p className="guestbook__lead">
        다녀가신 흔적을 남겨 주세요. 짧은 인사도 환영합니다.
      </p>

      <GuestbookForm />

      {error ? (
        <p className="guestbook__empty">
          방명록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : entries.length === 0 ? (
        <p className="guestbook__empty">아직 등록된 글이 없습니다. 첫 글을 남겨 보세요.</p>
      ) : (
        <ul className="guestbook__list">
          {entries.map((entry) => (
            <li key={entry.id} className="guestbook__item">
              <div className="guestbook__head">
                <span className="guestbook__name">{entry.name}</span>
                <span className="guestbook__date">{formatDate(entry.created_at)}</span>
              </div>
              <p className="guestbook__message">{entry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

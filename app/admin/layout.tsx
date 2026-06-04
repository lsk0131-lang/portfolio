import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminStatus } from "@/utils/admin";

export const metadata = { title: "관리자 · 이슬기" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, email } = await getAdminStatus();
  if (!isAdmin) {
    redirect(email ? "/login?error=not-admin" : "/login");
  }

  return (
    <section className="section container admin-shell">
      <header className="admin-shell__bar">
        <Link href="/admin" className="admin-shell__home">
          관리자
        </Link>
        <div className="admin-shell__meta">
          <span className="admin-shell__email">{email}</span>
          <form action="/auth/signout" method="post" className="admin-shell__signout">
            <button type="submit" className="btn btn--ghost btn--sm">
              로그아웃
            </button>
          </form>
        </div>
      </header>
      {children}
    </section>
  );
}

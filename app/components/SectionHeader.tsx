import Link from "next/link";
import { getAdminStatus } from "@/utils/admin";

type Props = {
  title: string;
  addHref?: string;
  addLabel?: string;
};

export default async function SectionHeader({ title, addHref, addLabel }: Props) {
  const { isAdmin } = addHref ? await getAdminStatus() : { isAdmin: false };

  return (
    <div className="section__title-row">
      <h2 className="section__title">{title}</h2>
      {isAdmin && addHref && (
        <Link href={addHref} className="btn btn--ghost btn--sm">
          + {addLabel ?? "추가"}
        </Link>
      )}
    </div>
  );
}

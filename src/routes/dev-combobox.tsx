import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RepoCombobox } from "@/components/RepoCombobox";
import type { RepoInfo } from "@/lib/github.functions";

export const Route = createFileRoute("/dev-combobox")({ component: DevPage });

const repos: RepoInfo[] = [
  { fullName: "tamoelmashroat-oss/friendly-connections-app", description: "تطبيق تواصل", createdAt: "2026-01-10T00:00:00Z", isPrivate: true },
  { fullName: "tamoelmashroat-oss/bine-hesab", description: null, createdAt: "2026-02-01T00:00:00Z", isPrivate: true },
  { fullName: "tamoelmashroat-oss/heartfelt-helper-c492-long-name-example", description: "مساعد", createdAt: "2026-03-15T00:00:00Z", isPrivate: true },
  { fullName: "tamoelmashroat-oss/heartfelt-connect", description: null, createdAt: "2026-04-01T00:00:00Z", isPrivate: true },
  { fullName: "tamoelmashroat-oss/nakle-mashrooa", description: "نقل مشاريع", createdAt: "2026-05-01T00:00:00Z", isPrivate: false },
  { fullName: "tamoelmashroat-oss/your-creative-hub", description: null, createdAt: "2026-06-01T00:00:00Z", isPrivate: true },
];

function DevPage() {
  const [value, setValue] = useState("");
  return (
    <div dir="rtl" className="mx-auto max-w-md p-4">
      <RepoCombobox repos={repos} value={value} onChange={setValue} />
    </div>
  );
}

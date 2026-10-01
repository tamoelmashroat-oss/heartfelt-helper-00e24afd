import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RepoCombobox } from "@/components/RepoCombobox";
import type { RepoInfo } from "@/lib/github.functions";

export const Route = createFileRoute("/dev-combobox")({ component: DevPage });

const mk = (fullName: string, isPrivate = true): RepoInfo => ({
  name: fullName.split("/")[1],
  fullName,
  description: null,
  createdAt: "2026-01-10T00:00:00Z",
  isPrivate,
  defaultBranch: "main",
  canPush: true,
});

const repos: RepoInfo[] = [
  mk("tamoelmashroat-oss/heartfelt-helper-00e24afd"),
  mk("tamoelmashroat-oss/friendly-connections-hub"),
  mk("tamoelmashroat-oss/bine-hesab"),
  mk("tamoelmashroat-oss/heartfelt-helper-c4926138"),
  mk("tamoelmashroat-oss/heartfelt-connect"),
  mk("tamoelmashroat-oss/nakle-mashrooa", false),
  mk("tamoelmashroat-oss/your-creative-hub"),
];

function DevPage() {
  const [value, setValue] = useState("");
  return (
    <div dir="rtl" className="mx-auto max-w-md p-4">
      <RepoCombobox repos={repos} value={value} onChange={setValue} />
    </div>
  );
}

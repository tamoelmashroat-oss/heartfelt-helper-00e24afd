import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RepoCombobox } from "@/components/RepoCombobox";

const repos = Array.from({ length: 14 }, (_, i) => ({
  fullName: `tamoelmashroat-oss/lovable-project-transfer-tool-${i % 2 ? "backup" : "main"}-${i}`,
  name: "x",
  isPrivate: i % 3 === 0,
  defaultBranch: "main",
  canPush: true,
  createdAt: new Date(2026, i % 12, 3 + i).toISOString(),
  description: i % 2 ? "نسخة احتياطية من المشروع" : null,
}));

export const Route = createFileRoute("/dev-combobox")({
  component: () => {
    const [v, setV] = useState("");
    return (
      <div className="p-4">
        <RepoCombobox repos={repos} value={v} onChange={setV} />
      </div>
    );
  },
});

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RepoCombobox } from "@/components/RepoCombobox";
import type { RepoInfo } from "@/lib/github.functions";

export const Route = createFileRoute("/dev-combobox")({
  component: DevCombobox,
});

const repos: RepoInfo[] = [
  "tamoelmashroat/lovable-cloud-frontend",
  "tamoelmashroat/lovable-cloud-frontend-v2",
  "tamoelmashroat/lovable-cloud-frontend-admin-panel-mobile-app",
  "tamoelmashroat/lovable-cloud-frontend-admin-panel-mobile-app-copy",
  "tamoelmashroat/e-commerce-dashboard",
  "org-demo/internal-tools-sso-gateway",
].map((fullName) => ({
  fullName,
  name: fullName.slice(fullName.lastIndexOf("/") + 1),
  isPrivate: fullName.includes("v2"),
  defaultBranch: "main",
  canPush: true,
  createdAt: "2026-01-01T00:00:00Z",
  description: null,
}));

function DevCombobox() {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen bg-background p-4" dir="rtl">
      <div className="mx-auto max-w-sm pt-8">
        <RepoCombobox repos={repos} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-muted-foreground">value: {value || "—"}</p>
      </div>
    </div>
  );
}

import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/patients")({
  component: () => <Outlet />,
});

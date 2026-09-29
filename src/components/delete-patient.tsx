import { Trash2, LoaderCircle } from "lucide-react";
import { useConfirmPopup } from "./use-confirm-popup";
import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/app-data";
export function DeletePatient({
  id,
  name,
  stayOnList = false,
}: {
  id: string;
  name: string;
  stayOnList?: boolean;
}) {
  const { confirm, popup } = useConfirmPopup();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const navigate = useNavigate();
  const client = useQueryClient();
  return (
    <div>
      {popup}
      <button
        className="patient-action patient-action-danger"
        aria-label={`Delete ${name}`}
        title="Delete patient"
        disabled={busy}
        onClick={async () => {
          if (
            lock.current ||
            !(await confirm({
              title: `Delete ${name}?`,
              message:
                "The patient will be removed from the active list. All patient details, bills and payment history will be preserved for future recovery.",
              confirmText: "Delete patient",
              danger: true,
            }))
          )
            return;
          lock.current = true;
          setBusy(true);
          setError("");
          try {
            await apiRequest(`/patients/${id}`, { method: "DELETE" });
            if (!stayOnList) await navigate({ to: "/patients" });
            await client.invalidateQueries();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not delete patient");
          } finally {
            lock.current = false;
            setBusy(false);
          }
        }}
      >
        {busy ? (
          <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 size={17} aria-hidden="true" />
        )}
      </button>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

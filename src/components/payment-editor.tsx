import { useConfirmPopup } from "./use-confirm-popup";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/app-data";
import type { ClinicPayment } from "@/lib/clinic";
import { paymentTime } from "@/lib/payment-time";
export function PaymentEditor({ payment }: { payment: ClinicPayment }) {
  const { confirm, popup } = useConfirmPopup();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const client = useQueryClient();
  return (
    <div className="w-full space-y-3">
      {popup}
      {payment.editedAt && (
        <p className="text-sm font-semibold text-info">
          Edited · {paymentTime(payment.editedAt)} IST
        </p>
      )}
      {payment.editHistory?.map((edit, i) => (
        <p className="text-sm whitespace-pre-wrap" key={i}>
          {paymentTime(edit.editedAt)} IST — {edit.note}
        </p>
      ))}
      <button className="btn-secondary" onClick={() => setOpen(!open)} disabled={busy}>
        {open ? "Cancel edit" : "Edit payment"}
      </button>
      {open && (
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (lock.current) return;
            const data = new FormData(event.currentTarget);
            const editNote = String(data.get("editNote") || "").trim();
            if (!editNote) {
              setError("Please enter a reason for editing.");
              return;
            }
            if (
              !(await confirm({
                title: "Save payment changes?",
                message: `${payment.paymentId}\nReason: ${editNote}`,
                confirmText: "Save changes",
              }))
            )
              return;
            lock.current = true;
            setBusy(true);
            setError("");
            try {
              await apiRequest(`/payments/${payment._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  amount: Number(data.get("amount")),
                  paymentMethod: data.get("method"),
                  referenceNumber: data.get("reference"),
                  notes: data.get("notes"),
                  editNote,
                  ...(String(data.get("paymentDate")) !== payment.paymentDate.slice(0, 10)
                    ? { paymentDate: data.get("paymentDate") }
                    : {}),
                }),
              });
              await client.invalidateQueries();
              setOpen(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not update payment");
            } finally {
              lock.current = false;
              setBusy(false);
            }
          }}
        >
          <label>
            Amount (₹)
            <input
              className="field-control"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={payment.amount}
              disabled={busy}
            />
          </label>
          <label>
            Payment method
            <select
              className="field-control"
              name="method"
              defaultValue={payment.paymentMethod}
              disabled={busy}
            >
              {["CASH", "UPI", "CARD", "OTHER"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Payment date
            <input
              className="field-control"
              name="paymentDate"
              type="date"
              required
              defaultValue={payment.paymentDate.slice(0, 10)}
              disabled={busy}
            />
          </label>
          <label>
            Reference number
            <input
              className="field-control"
              name="reference"
              maxLength={200}
              defaultValue={payment.referenceNumber}
              disabled={busy}
            />
          </label>
          <label>
            Payment notes
            <textarea
              className="field-control"
              name="notes"
              maxLength={1000}
              defaultValue={payment.notes}
              disabled={busy}
            />
          </label>
          <label className="sm:col-span-2">
            Reason for editing *
            <textarea
              className="field-control"
              name="editNote"
              required
              maxLength={2000}
              disabled={busy}
            />
          </label>
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
          <button className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save payment changes"}
          </button>
        </form>
      )}
    </div>
  );
}

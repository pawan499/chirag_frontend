import { PaymentEditor } from "@/components/payment-editor";
import { paymentTime } from "@/lib/payment-time";
import { ClinicalAssessment } from "./clinical-assessment";
import { InvestigationDetails } from "./investigation-details";
import { eyeLabels } from "@/lib/clinical-options";
import { ReceiptLink } from "./receipt-link";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EyeFields } from "./eye-fields";
import { ErrorState, LoadingState } from "./ui";
import { formatCurrency } from "@/lib/app-data";
import {
  listAll,
  saveRecord,
  eyePayload,
  type ClinicVisit,
  type ClinicOrder,
  type ClinicPayment,
} from "@/lib/clinic";
export function PatientClinic({ id }: { id: string }) {
  const cache = useQueryClient();
  const navigate = useNavigate();
  const [showOrder, setShowOrder] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const query = useQuery({
    queryKey: ["clinic", id],
    queryFn: async () => {
      const [visits, orders, payments] = await Promise.all([
        listAll<ClinicVisit>(`/visits?patient=${id}`),
        listAll<ClinicOrder>(`/spectacle-orders?patient=${id}`),
        listAll<ClinicPayment>(`/payments?patient=${id}`),
      ]);
      return { visits, orders, payments };
    },
  });
  if (query.isPending) return <LoadingState />;
  if (query.isError || !query.data) return <ErrorState onRetry={() => void query.refetch()} />;
  const { visits, orders, payments } = query.data;
  const latest = visits[0];
  const bills = [
    ...visits.map((v) => ({
      id: v._id,
      label: v.visitId,
      kind: "visit",
      due: Math.max(
        0,
        v.charges.total -
          payments.filter((p) => p.visit === v._id).reduce((s, p) => s + p.amount, 0),
      ),
    })),
    ...orders
      .filter((o) => o.status !== "CANCELLED")
      .map((o) => ({
        id: o._id,
        label: o.orderId,
        kind: "spectacleOrder",
        due: o.remainingAmount,
      })),
  ].filter((b) => b.due > 0);
  async function run(action: () => Promise<unknown>, message: string, onSuccess?: () => void) {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await action();
      await cache.invalidateQueries();
      toast.success(message);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="space-y-5 mb-6">
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <section className="panel p-5 space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 className="font-bold">Spectacle orders</h2>
          <button
            className="btn-primary"
            disabled={saving}
            onClick={() => {
              setOrderTotal(0);
              setShowOrder(!showOrder);
            }}
          >
            {showOrder ? "Close form" : "Create spectacle order"}
          </button>
        </div>
        {showOrder && (
          <form
            className="space-y-4 border-t pt-4"
            onChange={(e) => {
              const f = new FormData(e.currentTarget);
              setOrderTotal(
                Number(f.get("framePrice")) +
                  Number(f.get("lensPrice")) +
                  Number(f.get("otherCharges")) -
                  Number(f.get("discount")),
              );
            }}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              if (orderTotal < 0) {
                setError("Discount cannot exceed the order charges.");
                return;
              }
              void run(
                async () => {
                  await saveRecord("/spectacle-orders", {
                    patient: id,
                    ...(latest ? { visit: latest._id } : {}),
                    rightEye: eyePayload(f, "right"),
                    leftEye: eyePayload(f, "left"),
                    ...(f.get("pd") ? { pd: Number(f.get("pd")) } : {}),
                    frameName: f.get("frameName"),
                    lensType: f.get("lensType"),
                    framePrice: Number(f.get("framePrice")),
                    lensPrice: Number(f.get("lensPrice")),
                    otherCharges: Number(f.get("otherCharges")),
                    discount: Number(f.get("discount")),
                    ...(f.get("deliveryDate") ? { deliveryDate: f.get("deliveryDate") } : {}),
                    notes: f.get("notes"),
                  });
                  setShowOrder(false);
                },
                "Spectacle order created successfully.",
                () => {
                  void navigate({ to: "/spectacles", search: { status: "All" } });
                },
              );
            }}
          >
            <fieldset disabled={saving} className="space-y-4">
              <p className="text-sm">
                Latest examination values are prefilled. Check the final prescription before saving.
              </p>
              <EyeFields
                prefix="right"
                label="Right eye (OD)"
                eye={latest?.eyeExamination?.rightEye}
              />
              <EyeFields
                prefix="left"
                label="Left eye (OS)"
                eye={latest?.eyeExamination?.leftEye}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {["frameName", "lensType"].map((name) => (
                  <label key={name}>
                    <span className="field-label">
                      {name === "frameName" ? "Frame name / model" : "Lens type"}
                    </span>
                    <input name={name} className="field-control" maxLength={200} required />
                  </label>
                ))}
                <label>
                  <span className="field-label">PD (mm)</span>
                  <input
                    name="pd"
                    className="field-control"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={latest?.eyeExamination?.pd}
                  />
                </label>
                {["framePrice", "lensPrice", "otherCharges", "discount"].map((name) => (
                  <label key={name}>
                    <span className="field-label">
                      {
                        {
                          framePrice: "Frame price",
                          lensPrice: "Lens price",
                          otherCharges: "Other charges",
                          discount: "Discount",
                        }[name]
                      }{" "}
                      (₹)
                    </span>
                    <input
                      name={name}
                      className="field-control"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue="0"
                    />
                  </label>
                ))}
                <label>
                  <span className="field-label">Expected delivery</span>
                  <input name="deliveryDate" type="date" className="field-control" />
                </label>
              </div>
              <label className="block">
                <span className="field-label">Order notes</span>
                <textarea name="notes" className="field-control" maxLength={2000} />
              </label>
              <p className="font-bold" aria-live="polite">
                Order total: {formatCurrency(orderTotal)}
              </p>
              <button className="btn-primary" disabled={saving || orderTotal < 0}>
                {saving ? "Saving…" : "Save spectacle order"}
              </button>
            </fieldset>
          </form>
        )}
        {orders.length === 0 && <p>No orders recorded.</p>}
        {orders.map((o) => (
          <div key={o._id} className="border-t pt-3 space-y-2">
            <p className="font-bold">
              {o.orderId} · {o.frameName} · {o.lensType}
            </p>
            <p>
              {o.status.replaceAll("_", " ")} · Total {formatCurrency(o.totalAmount)} · Paid{" "}
              {formatCurrency(o.advanceAmount)} · Due{" "}
              {formatCurrency(o.status === "CANCELLED" ? 0 : o.remainingAmount)}
            </p>
            <p className="text-sm">
              OD: {power(o.rightEye)} · OS: {power(o.leftEye)} · PD: {o.pd ?? "—"}
              {o.deliveryDate && ` · Delivery: ${new Date(o.deliveryDate).toLocaleDateString()}`}
            </p>
            <ReceiptLink kind="order" id={o._id} />
            {o.status !== "CANCELLED" && o.status !== "DELIVERED" && (
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  className="btn-secondary"
                  onClick={() =>
                    void run(
                      () =>
                        saveRecord(
                          `/spectacle-orders/${o._id}`,
                          {
                            status: {
                              ORDERED: "IN_PROCESS",
                              IN_PROCESS: "READY",
                              READY: "DELIVERED",
                            }[o.status],
                          },
                          "PATCH",
                        ),
                      "Order updated",
                    )
                  }
                >
                  Mark{" "}
                  {{ ORDERED: "In process", IN_PROCESS: "Ready", READY: "Delivered" }[o.status]}
                </button>
                {o.advanceAmount === 0 && (
                  <button
                    disabled={saving}
                    className="btn-ghost"
                    onClick={() =>
                      void run(
                        () =>
                          saveRecord(
                            `/spectacle-orders/${o._id}`,
                            { status: "CANCELLED" },
                            "PATCH",
                          ),
                        "Order cancelled",
                      )
                    }
                  >
                    Cancel unpaid order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
      <section className="panel p-5 space-y-4">
        <h2 className="font-bold">Record received payment</h2>
        <p className="text-sm">
          Cash or payment received on your existing QR. Verify receipt yourself before recording.
        </p>
        {bills.length === 0 ? (
          <p>No outstanding bills.</p>
        ) : (
          <form
            key={payments.length}
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const bill = bills.find((b) => b.id === f.get("bill"));
              if (!bill) return;
              const amount = Number(f.get("amount"));
              if (amount > bill.due) {
                setError("Amount exceeds this bill’s outstanding due.");
                return;
              }
              void run(
                () =>
                  saveRecord("/payments", {
                    patient: id,
                    [bill.kind]: bill.id,
                    amount,
                    paymentMethod: f.get("method"),
                    referenceNumber: f.get("reference"),
                    notes: f.get("notes"),
                  }),
                "Payment recorded",
              );
            }}
          >
            <label>
              <span className="field-label">Bill</span>
              <select name="bill" required className="field-control">
                {bills.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label} · Due {formatCurrency(b.due)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Amount received (₹)</span>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                className="field-control"
              />
            </label>
            <label>
              <span className="field-label">Method</span>
              <select name="method" className="field-control">
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / QR (manually verified)</option>
              </select>
            </label>
            <label>
              <span className="field-label">Reference (optional)</span>
              <input name="reference" className="field-control" maxLength={200} />
            </label>
            <label>
              <span className="field-label">Notes</span>
              <input name="notes" className="field-control" maxLength={1000} />
            </label>
            <button disabled={saving} className="btn-primary self-end">
              {saving ? "Saving…" : "Record payment"}
            </button>
          </form>
        )}
        {payments.map((p) => (
          <div
            key={p._id}
            className="border-t pt-3 text-sm flex flex-wrap items-center justify-between gap-3"
          >
            <p>
              {p.paymentId} · {paymentTime(p.paymentDate)} · {p.paymentMethod} ·{" "}
              {formatCurrency(p.amount)} {p.referenceNumber && `· ${p.referenceNumber}`}
            </p>
            <ReceiptLink kind="payment" id={p._id} />
            <PaymentEditor payment={p} />
          </div>
        ))}
      </section>
      <section className="panel p-5 space-y-4">
        <h2 className="font-bold">Examination & prescription history</h2>
        {visits.length === 0 ? (
          <p>No examinations recorded.</p>
        ) : (
          visits.map((v) => (
            <details key={v._id} className="border-t pt-3">
              <summary className="cursor-pointer font-bold">
                {v.visitId} · {new Date(v.visitDate).toLocaleDateString()} ·{" "}
                {formatCurrency(v.charges.total)}
              </summary>
              <div className="space-y-2 mt-3 text-sm">
                <ReceiptLink kind="visit" id={v._id} label="Bill / prescription" />
                <p>{v.complaint}</p>
                <ClinicalAssessment symptoms={v.symptoms} diagnoses={v.diagnoses} />
                <InvestigationDetails value={v.eyeExamination} title="Visit investigation" />
                <p>{v.doctorNotes}</p>
                {v.medicines.map((m, i) => (
                  <p key={i}>
                    {m.medicineName} × {m.quantity} ·{" "}
                    {[
                      m.strength,
                      m.eye ? eyeLabels[m.eye] : "",
                      m.dosage,
                      m.frequency,
                      m.duration,
                      m.instructions,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ))}
              </div>
            </details>
          ))
        )}
      </section>
    </div>
  );
}
function power(eye?: import("@/lib/clinic").Eye) {
  return eye
    ? `SPH ${eye.sph ?? "—"} / CYL ${eye.cyl ?? "—"} × ${eye.axis ?? "—"} / ADD ${eye.add ?? "—"} / VA ${eye.va ?? "—"}`
    : "—";
}

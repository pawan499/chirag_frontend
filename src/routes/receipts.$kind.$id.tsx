import { ClinicalAssessment } from "@/components/clinical-assessment";
import { eyeLabels } from "@/lib/clinical-options";
import { InvestigationDetails } from "@/components/investigation-details";
import type { PatientRecord } from "@/lib/patient-data";
import { ReceiptHeader, type ReceiptShopDetails } from "@/components/receipt-header";
import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer, ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ErrorState, LoadingState } from "@/components/ui";
import { apiRequest, formatCurrency } from "@/lib/app-data";
import type { ClinicVisit, ClinicOrder, ClinicPayment, Eye } from "@/lib/clinic";
import "@/receipt.css";
type Receipt = {
  kind: "visit" | "order" | "payment" | "patient";
  number: string;
  date: string;
  generatedAt: string;
  billNumber: string;
  total: number;
  paid: number;
  due: number;
  cancelled: boolean;
  patient: PatientRecord;
  settings: ReceiptShopDetails;
  visit:
    | (Omit<ClinicVisit, "medicines"> & {
        followUpDate?: string;
        charges: {
          consultation?: number;
          other?: number;
          discount?: number;
          medicineTotal?: number;
          total: number;
        };
        medicines: Array<
          ClinicVisit["medicines"][number] & {
            unitPrice?: number;
            totalPrice?: number;
            instructions?: string;
          }
        >;
      })
    | null;
  order:
    | (ClinicOrder & {
        framePrice?: number;
        lensPrice?: number;
        otherCharges?: number;
        discount?: number;
        notes?: string;
      })
    | null;
  payment: ClinicPayment | null;
  payments: ClinicPayment[];
};
export const Route = createFileRoute("/receipts/$kind/$id")({ component: ReceiptPage });
const date = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
function ReceiptPage() {
  const { kind, id } = Route.useParams();
  const valid =
    ["visit", "order", "payment", "patient"].includes(kind) && /^[a-f\d]{24}$/i.test(id);
  const query = useQuery({
    queryKey: ["receipt", kind, id],
    queryFn: () => apiRequest<Receipt>(`/receipts/${kind}/${id}`),
    enabled: valid,
    retry: false,
  });
  useEffect(() => {
    if (!query.data) return;
    const previous = document.title;
    document.title = `${query.data.number} — ${query.data.patient.name}`;
    return () => {
      document.title = previous;
    };
  }, [query.data]);
  if (!valid)
    return (
      <AppLayout>
        <p>Invalid receipt link.</p>
        <Link to="/payments" className="btn-secondary">
          Back to payments
        </Link>
      </AppLayout>
    );
  if (query.isPending)
    return (
      <AppLayout>
        <LoadingState label="Preparing receipt…" />
      </AppLayout>
    );
  if (query.isError || !query.data)
    return (
      <AppLayout>
        <ErrorState onRetry={() => void query.refetch()} />
      </AppLayout>
    );
  const r = query.data;
  const { patient, settings, visit, order, payment } = r;
  const registration = kind === "patient";
  const title = registration
    ? "Patient registration slip"
    : payment
      ? "Payment receipt"
      : order
        ? "Spectacle order receipt"
        : "Visit bill & prescription";
  const eye = visit?.eyeExamination;
  const rows = order
    ? [
        {
          label: `Frame${order.frameName ? ` · ${order.frameName}` : ""}`,
          qty: 1,
          rate: order.framePrice ?? 0,
          amount: order.framePrice ?? 0,
        },
        {
          label: `Lenses${order.lensType ? ` · ${order.lensType}` : ""}`,
          qty: 1,
          rate: order.lensPrice ?? 0,
          amount: order.lensPrice ?? 0,
        },
        {
          label: "Other charges",
          qty: 1,
          rate: order.otherCharges ?? 0,
          amount: order.otherCharges ?? 0,
        },
      ]
    : visit
      ? [
          {
            label: "Consultation / eye examination",
            qty: 1,
            rate: visit.charges.consultation ?? 0,
            amount: visit.charges.consultation ?? 0,
          },
          ...visit.medicines.map((m) => ({
            label: m.medicineName,
            qty: m.quantity,
            rate: m.unitPrice ?? 0,
            amount: m.totalPrice ?? 0,
          })),
          {
            label: "Other charges",
            qty: 1,
            rate: visit.charges.other ?? 0,
            amount: visit.charges.other ?? 0,
          },
        ]
      : [];
  return (
    <AppLayout>
      <div className="receipt-toolbar">
        <Link
          to={
            registration ? "/patients" : payment ? "/payments" : order ? "/spectacles" : "/visits"
          }
          className="btn-secondary"
        >
          <ArrowLeft size={16} />
          Back to listing
        </Link>
        <div>
          <p>Print this receipt or choose “Save as PDF” in the print dialog.</p>
          <button className="btn-primary" onClick={() => window.print()}>
            <Printer size={16} />
            Print / Save PDF
          </button>
        </div>
      </div>
      <article className="receipt-page">
        <ReceiptHeader shop={settings} />
        <div className="receipt-title">
          <div>
            <p className="receipt-kicker">PATIENT COPY</p>
            <h2>{title}</h2>
          </div>
          <div>
            <strong>{r.number}</strong>
            <p>{date(r.date)}</p>
          </div>
        </div>
        <section className="receipt-patient">
          <div>
            <span className="receipt-label">Patient</span>
            <h3>{patient.name}</h3>
            <p>
              {patient.patientId}
              {patient.age != null && ` · ${patient.age} years`}
              {patient.gender && ` · ${patient.gender.replaceAll("_", " ")}`}
            </p>
            {patient.mobile && <p>{patient.mobile}</p>}
          </div>
          <div>
            <span className="receipt-label">
              {registration ? "Registration" : payment ? "Against bill" : "Bill status"}
            </span>
            <strong>
              {registration
                ? patient.patientId
                : payment
                  ? r.billNumber
                  : r.cancelled
                    ? "CANCELLED"
                    : r.due === 0
                      ? "PAID"
                      : r.paid > 0
                        ? "PARTIALLY PAID"
                        : "UNPAID"}
            </strong>
            {order && <p>Order: {order.status.replaceAll("_", " ")}</p>}
            {order?.deliveryDate && <p>Expected delivery: {date(order.deliveryDate)}</p>}
          </div>
        </section>
        {r.cancelled && (
          <p className="receipt-notice">This order is cancelled. No amount is currently payable.</p>
        )}
        {registration ? null : payment ? (
          <section className="receipt-payment">
            <span className="receipt-label">Amount received on this receipt</span>
            <strong>{formatCurrency(payment.amount)}</strong>
            <div className="receipt-payment-meta">
              <p>
                Method:{" "}
                <b>{payment.paymentMethod === "UPI" ? "UPI / QR" : payment.paymentMethod}</b>
              </p>
              <p>
                Reference: <b>{payment.referenceNumber || "—"}</b>
              </p>
            </div>
            {payment.notes && <p>{payment.notes}</p>}
          </section>
        ) : (
          <section className="receipt-section">
            <h3>Charges</h3>
            <div className="receipt-table-wrap">
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows
                    .filter(
                      (row) =>
                        row.amount !== 0 ||
                        row.label.startsWith("Consultation") ||
                        row.label.startsWith("Frame") ||
                        row.label.startsWith("Lenses"),
                    )
                    .map((row, i) => (
                      <tr key={i}>
                        <td>{row.label}</td>
                        <td>{row.qty}</td>
                        <td>{formatCurrency(row.rate)}</td>
                        <td>{formatCurrency(row.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="receipt-totals">
              {!!(order?.discount || visit?.charges.discount) && (
                <p>
                  <span>Discount</span>
                  <strong>
                    −{formatCurrency(order?.discount || visit?.charges.discount || 0)}
                  </strong>
                </p>
              )}
              <p className="receipt-total">
                <span>Bill total</span>
                <strong>{formatCurrency(r.total)}</strong>
              </p>
              <p>
                <span>Received to date</span>
                <strong>{formatCurrency(r.paid)}</strong>
              </p>
              <p>
                <span>Current balance due</span>
                <strong>{formatCurrency(r.due)}</strong>
              </p>
            </div>
          </section>
        )}
        {payment && (
          <section className="receipt-balance">
            <div>
              <span className="receipt-label">Bill total</span>
              <strong>{formatCurrency(r.total)}</strong>
            </div>
            <div>
              <span className="receipt-label">Total received to date</span>
              <strong>{formatCurrency(r.paid)}</strong>
            </div>
            <div>
              <span className="receipt-label">Current balance due</span>
              <strong>{formatCurrency(r.due)}</strong>
            </div>
          </section>
        )}
        {registration && (
          <section className="receipt-section">
            {[
              ["Address", patient.address],
              ["Blood group", patient.bloodGroup],
              ["Allergies", patient.allergies],
              ["Medical notes", patient.medicalNotes],
            ].map(([label, value]) =>
              value ? (
                <p key={label} className="receipt-note">
                  <b>{label}:</b> {value}
                </p>
              ) : null,
            )}
          </section>
        )}
        {order && (
          <section className="receipt-section">
            <h3>{order ? "Spectacle prescription" : "Eye examination"}</h3>
            <div className="receipt-table-wrap">
              <table className="receipt-table receipt-eye">
                <thead>
                  <tr>
                    {["Eye", "SPH", "CYL", "AXIS", "ADD", "VA"].map((x) => (
                      <th key={x}>{x}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <EyeRow label="Right (OD)" eye={order?.rightEye ?? eye?.rightEye} />
                  <EyeRow label="Left (OS)" eye={order?.leftEye ?? eye?.leftEye} />
                </tbody>
              </table>
            </div>
            <p className="receipt-small">PD: {order?.pd ?? eye?.pd ?? "—"} mm</p>
            {eye?.remarks && <p className="receipt-note">{eye.remarks}</p>}
          </section>
        )}
        {visit && <ClinicalAssessment symptoms={visit.symptoms} diagnoses={visit.diagnoses} />}
        {visit?.eyeExamination && (
          <InvestigationDetails value={visit.eyeExamination} title="Visit investigation" />
        )}
        {visit && (
          <section className="receipt-section">
            <h3>Consultation & prescription</h3>
            {visit.complaint && (
              <p className="receipt-note">
                <b>Complaint:</b> {visit.complaint}
              </p>
            )}
            {visit.doctorNotes && (
              <p className="receipt-note">
                <b>Doctor notes:</b> {visit.doctorNotes}
              </p>
            )}
            {visit.medicines.map((m, i) => (
              <div className="receipt-medicine" key={i}>
                <strong>
                  {i + 1}. {m.medicineName}
                </strong>
                {m.strength && <p>Strength / form: {m.strength}</p>}
                {m.eye && <p>Application: {eyeLabels[m.eye]}</p>}
                <p>
                  Quantity: {m.quantity}
                  {m.dosage && ` · Dosage: ${m.dosage}`}
                  {m.frequency && ` · Frequency: ${m.frequency}`}
                  {m.duration && ` · Duration: ${m.duration}`}
                </p>
                {m.instructions && <p>{m.instructions}</p>}
              </div>
            ))}
            {visit.followUpDate && (
              <p className="receipt-followup">Follow-up: {date(visit.followUpDate)}</p>
            )}
          </section>
        )}
        {order?.notes && (
          <section className="receipt-section">
            <h3>Order notes</h3>
            <p className="receipt-note">{order.notes}</p>
          </section>
        )}
        {!payment && !registration && (
          <section className="receipt-section">
            <h3>Payment record</h3>
            {r.payments.length === 0 ? (
              <p className="receipt-small">
                No payment recorded. This bill does not confirm receipt of money.
              </p>
            ) : (
              <div className="receipt-table-wrap">
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>Receipt / date</th>
                      <th>Method / reference</th>
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.payments.map((p) => (
                      <tr key={p._id}>
                        <td>
                          {p.paymentId}
                          <small>{date(p.paymentDate)}</small>
                        </td>
                        <td>
                          {p.paymentMethod}
                          <small>{p.referenceNumber || "—"}</small>
                        </td>
                        <td>{formatCurrency(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        <footer className="receipt-footer">
          <div>
            <strong>Thank you for visiting.</strong>
            <p>Please keep this copy for your records.</p>
            {!registration && (
              <p>
                Balances as of {date(r.generatedAt)}.{" "}
                {payment
                  ? "This receipt acknowledges only the payment shown above."
                  : "Paid amounts reflect recorded payments only."}
              </p>
            )}
          </div>
          <div className="receipt-signature">
            {visit ? "Doctor’s signature" : "Authorised signature"}
          </div>
        </footer>
      </article>
      <div className="receipt-toolbar receipt-bottom">
        {registration && (
          <Link to="/patients/$id/visits/new" params={{ id: patient._id }} className="btn-primary">
            Continue to diagnosis & prescription
          </Link>
        )}
        <Link to="/patients/$id" params={{ id: patient._id }} className="btn-secondary">
          Open patient profile
        </Link>
      </div>
    </AppLayout>
  );
}
function EyeRow({ label, eye }: { label: string; eye: Eye | undefined }) {
  const power = (v: number | undefined) => (v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(2)}`);
  return (
    <tr>
      <td>{label}</td>
      <td>{power(eye?.sph)}</td>
      <td>{power(eye?.cyl)}</td>
      <td>{eye?.axis ?? "—"}</td>
      <td>{power(eye?.add)}</td>
      <td>{eye?.va || "—"}</td>
    </tr>
  );
}

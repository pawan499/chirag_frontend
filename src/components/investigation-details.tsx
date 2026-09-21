import type { Examination } from "@/lib/clinic";
import { investigationFields } from "@/lib/investigation";
export function InvestigationDetails({
  value,
  title = "Registration investigation",
}: {
  value: Examination | undefined;
  title?: string;
}) {
  if (!value) return null;
  return (
    <section className="receipt-section">
      <h3>{title}</h3>
      <div className="receipt-table-wrap">
        <table className="receipt-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Right eye (OD)</th>
              <th>Left eye (OS)</th>
            </tr>
          </thead>
          <tbody>
            {investigationFields.map(({ key, label }) => (
              <tr key={key}>
                <td>{label}</td>
                <td>{value.rightEye?.[key] ?? "—"}</td>
                <td>{value.leftEye?.[key] ?? "—"}</td>
              </tr>
            ))}
            {(value.rightEye?.va || value.leftEye?.va) && (
              <tr>
                <td>Visual acuity (VA)</td>
                <td>{value.rightEye?.va || "—"}</td>
                <td>{value.leftEye?.va || "—"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="receipt-small">Pupillary distance (PD): {value.pd ?? "—"} mm</p>
      {value.remarks && <p className="receipt-note">{value.remarks}</p>}
    </section>
  );
}

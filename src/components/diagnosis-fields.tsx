import { diagnosisOptions, eyeLabels, type Diagnosis } from "@/lib/clinical-options";
export type DiagnosisDraft = Omit<Diagnosis, "eye"> & { eye: Diagnosis["eye"] | "" };
export function DiagnosisFields({
  value,
  onChange,
}: {
  value: DiagnosisDraft[];
  onChange: (value: DiagnosisDraft[]) => void;
}) {
  const update = (index: number, patch: Partial<DiagnosisDraft>) =>
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  return (
    <section className="panel p-5 space-y-4">
      <h2 className="font-bold">2. Diagnosis</h2>
      <p className="text-sm text-muted-foreground">
        Record the clinician’s assessment. Select a condition or enter another diagnosis.
      </p>
      <datalist id="diagnosis-options">
        {diagnosisOptions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      {value.map((row, index) => (
        <div key={index} className="grid gap-3 rounded border p-3 sm:grid-cols-3">
          <label>
            <span className="field-label">Condition / disease</span>
            <input
              className="field-control"
              list="diagnosis-options"
              required
              maxLength={200}
              value={row.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
          </label>
          <label>
            <span className="field-label">Affected eye</span>
            <select
              className="field-control"
              required
              value={row.eye}
              onChange={(e) => update(index, { eye: e.target.value as Diagnosis["eye"] })}
            >
              <option value="">Select affected eye</option>
              {(["OD", "OS", "OU"] as const).map((eye) => (
                <option key={eye} value={eye}>
                  {eyeLabels[eye]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Assessment</span>
            <select
              className="field-control"
              value={row.status}
              onChange={(e) => update(index, { status: e.target.value as Diagnosis["status"] })}
            >
              <option value="PROVISIONAL">Provisional / suspected</option>
              <option value="CONFIRMED">Confirmed by clinician</option>
            </select>
          </label>
          <button
            className="btn-ghost"
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            Remove diagnosis
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary"
        disabled={value.length >= 20}
        onClick={() => onChange([...value, { name: "", eye: "", status: "PROVISIONAL" }])}
      >
        Add diagnosis
      </button>
    </section>
  );
}

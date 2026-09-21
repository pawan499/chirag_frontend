import { eyeLabels, medicineNameSuggestions } from "@/lib/clinical-options";
import { formatCurrency } from "@/lib/app-data";
export type PrescriptionItem = {
  key: string;
  id: string;
  name: string;
  strength: string;
  price: number;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  eye: keyof typeof eyeLabels | "";
};
type Medicine = { _id: string; name: string; defaultPrice: number; unit?: string };
export function PrescriptionFields({
  items,
  onChange,
  medicines,
}: {
  items: PrescriptionItem[];
  onChange: (items: PrescriptionItem[]) => void;
  medicines: Medicine[];
}) {
  function add(medicine?: Medicine) {
    onChange([
      ...items,
      {
        key: crypto.randomUUID(),
        id: medicine?._id ?? "",
        name: medicine?.name ?? "",
        strength: "",
        price: medicine?.defaultPrice ?? 0,
        quantity: 1,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        eye: "",
      },
    ]);
  }
  function update(index: number, patch: Partial<PrescriptionItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  return (
    <section className="panel p-5 space-y-4">
      <h2 className="font-bold">3. Prescribed medicines (optional)</h2>
      <p className="text-sm text-muted-foreground">
        Enter the clinician’s prescription, including the exact product and strength. Medicine
        choices and doses are entered manually.
      </p>
      <select
        aria-label="Add medicine from catalogue"
        className="field-control"
        value=""
        onChange={(e) => {
          const medicine = medicines.find((m) => m._id === e.target.value);
          if (medicine) add(medicine);
        }}
      >
        <option value="">Select from medicine catalogue</option>
        {medicines.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
            {m.unit ? ` · ${m.unit}` : ""} · {formatCurrency(m.defaultPrice ?? 0)}
          </option>
        ))}
      </select>
      <button type="button" className="btn-secondary" onClick={() => add()}>
        Add medicine by name
      </button>
      <datalist id="medicine-name-suggestions">
        {medicineNameSuggestions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      {items.map((item, index) => (
        <div key={item.key} className="rounded border p-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="field-label">Medicine / exact product name</span>
              <input
                className="field-control"
                required
                maxLength={200}
                readOnly={!!item.id}
                list={!item.id ? "medicine-name-suggestions" : undefined}
                value={item.name}
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </label>
            <label>
              <span className="field-label">Strength / form</span>
              <input
                className="field-control"
                maxLength={100}
                placeholder="As on the prescribed product"
                value={item.strength}
                onChange={(e) => update(index, { strength: e.target.value })}
              />
            </label>
            <label>
              <span className="field-label">Eye / application site</span>
              <select
                className="field-control"
                value={item.eye}
                onChange={(e) => update(index, { eye: e.target.value as PrescriptionItem["eye"] })}
              >
                <option value="">Select if applicable</option>
                {Object.entries(eyeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {(["quantity", "price", "dosage", "frequency", "duration"] as const).map((key) => (
              <label key={key}>
                <span className="field-label">
                  {
                    {
                      quantity: "Quantity / packs",
                      price: "Unit price (₹)",
                      dosage: "Dose",
                      frequency: "Frequency",
                      duration: "Duration",
                    }[key]
                  }
                </span>
                <input
                  className="field-control"
                  required={key === "quantity" || key === "price"}
                  type={key === "quantity" || key === "price" ? "number" : "text"}
                  min={key === "quantity" ? 1 : 0}
                  step={key === "price" ? "0.01" : 1}
                  maxLength={100}
                  value={item[key]}
                  onChange={(e) =>
                    update(index, {
                      [key]:
                        key === "quantity" || key === "price"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </label>
            ))}
          </div>
          <label className="block">
            <span className="field-label">Instructions</span>
            <textarea
              className="field-control"
              maxLength={500}
              value={item.instructions}
              onChange={(e) => update(index, { instructions: e.target.value })}
            />
          </label>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            Remove medicine
          </button>
        </div>
      ))}
    </section>
  );
}

import { VisionInput } from "./vision-options";
import { investigationFields } from "@/lib/investigation";
import type { Eye } from "@/lib/clinic";
export function EyeFields({
  prefix,
  label,
  eye = {},
  detailed = false,
}: {
  prefix: string;
  label: string;
  eye?: Eye | undefined;
  detailed?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-bold">{label}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(["sph", "cyl", "axis", "add", "va"] as const).map((key) => (
          <label key={key}>
            <span className="field-label">{key.toUpperCase()}</span>
            {key === "va" ? (
              <VisionInput
                name={`${prefix}.${key}`}
                defaultValue={eye.va ?? ""}
                maxLength={20}
                placeholder="6/6"
              />
            ) : (
              <input
                name={`${prefix}.${key}`}
                className="field-control"
                defaultValue={eye[key] ?? ""}
                type="number"
                step={key === "axis" ? "1" : "0.25"}
                min={key === "axis" ? 0 : -50}
                max={key === "axis" ? 180 : 50}
                placeholder="—"
              />
            )}
          </label>
        ))}
      </div>
      {detailed && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {investigationFields
            .filter((field) =>
              ["unaidedVision", "correctedVision", "pinholeVision", "nearVision", "iop"].includes(
                field.key,
              ),
            )
            .map((field) => (
              <label key={field.key}>
                <span className="field-label">{field.label}</span>
                {field.key === "iop" ? (
                  <input
                    name={`${prefix}.${field.key}`}
                    className="field-control"
                    defaultValue={eye.iop ?? ""}
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <VisionInput
                    name={`${prefix}.${field.key}`}
                    defaultValue={String(eye[field.key] ?? "")}
                    near={field.key === "nearVision"}
                    maxLength={40}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
        </div>
      )}
    </fieldset>
  );
}

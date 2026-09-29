import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "./icons";
import { investigationFields } from "@/lib/investigation";
import { VisionInput } from "./vision-options";
import { FormMessage } from "./ui";
import { ApiRequestError } from "@/lib/app-data";
import {
  genderLabels,
  patientFormSchema,
  type PatientFormValues,
  type PatientRecord,
} from "@/lib/patient-data";

export function PatientForm({
  patient,
  onSave,
  cancel,
}: {
  patient?: PatientRecord;
  onSave: (values: PatientFormValues) => Promise<void>;
  cancel: ReactNode;
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? {
          ...patient,
          gender: patient.gender ?? "",
        }
      : {},
  });
  const submit = async (values: PatientFormValues) => {
    clearErrors("root");
    try {
      await onSave(values);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        for (const issue of error.fields) {
          const field = issue.field.replace(/^body\./, "");
          if (field in patientFormSchema.shape)
            setError(field as keyof PatientFormValues, { message: issue.message });
        }
      }
      setError("root", {
        message:
          error instanceof ApiRequestError && error.status === 401
            ? "Your session has expired. Please sign in again."
            : error instanceof Error
              ? error.message
              : "Could not save patient. Please try again.",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-5">
        <section className="panel p-5">
          <h2 className="mb-5 font-bold text-ink">Basic information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Patient name" required error={errors.name?.message}>
              <input
                {...register("name")}
                className="field-control"
                maxLength={120}
                placeholder="e.g. Raj Kumar"
                autoFocus
              />
            </Field>
            <Field label="Mobile number" error={errors.mobile?.message}>
              <input
                {...register("mobile")}
                className="field-control"
                maxLength={20}
                placeholder="e.g. 98765 43210"
                type="tel"
              />
            </Field>
            <Field label="Age" error={errors.age?.message}>
              <input
                {...register("age", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="field-control"
                type="number"
                min={0}
                max={130}
                step={1}
                placeholder="Years"
              />
            </Field>
            <Field label="Gender" error={errors.gender?.message}>
              <select {...register("gender")} className="field-control">
                <option value="">Select gender</option>
                {Object.entries(genderLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Blood group" error={errors.bloodGroup?.message}>
              <input
                {...register("bloodGroup")}
                className="field-control"
                maxLength={10}
                list="blood-groups"
                placeholder="Select or enter blood group"
              />
              <datalist id="blood-groups">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                  <option key={group} value={group} />
                ))}
              </datalist>
            </Field>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="mb-5 font-bold text-ink">Additional details</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Address" error={errors.address?.message}>
              <textarea
                {...register("address")}
                className="field-control min-h-24"
                maxLength={500}
                placeholder="Patient address"
              />
            </Field>
            <Field label="Allergies" error={errors.allergies?.message}>
              <textarea
                {...register("allergies")}
                className="field-control min-h-24"
                maxLength={1000}
                placeholder="Known allergies, if any"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Medical notes" error={errors.medicalNotes?.message}>
                <textarea
                  {...register("medicalNotes")}
                  className="field-control min-h-28"
                  maxLength={3000}
                  placeholder="Anything useful for future visits"
                />
              </Field>
            </div>
          </div>
        </section>
        <section className="panel space-y-6 p-5">
          <div>
            <h2 className="font-bold text-ink">Registration investigation</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional eye readings recorded at registration.
            </p>
          </div>
          {(["rightEye", "leftEye"] as const).map((side) => (
            <fieldset key={side}>
              <legend className="mb-4 font-semibold">
                {side === "rightEye" ? "Right eye · OD" : "Left eye · OS"}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {investigationFields.map((item) => {
                  const name = `investigation.${side}.${item.key}` as const;
                  const error = errors.investigation?.[side]?.[item.key]?.message;
                  return (
                    <Field key={item.key} label={item.label} error={error}>
                      {"min" in item ? (
                        <input
                          {...register(name, {
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
                          })}
                          className="field-control"
                          type="number"
                          min={item.min}
                          max={item.max}
                          step={item.key === "axis" ? "1" : "any"}
                          placeholder={item.placeholder}
                        />
                      ) : (
                        <Controller
                          name={name}
                          control={control}
                          render={({ field }) => (
                            <VisionInput
                              name={field.name}
                              ref={field.ref}
                              value={String(field.value ?? "")}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
                              near={item.key === "nearVision"}
                              maxLength={40}
                              placeholder={item.placeholder}
                            />
                          )}
                        />
                      )}
                    </Field>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="PD (mm)" error={errors.investigation?.pd?.message}>
              <input
                {...register("investigation.pd", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="field-control"
                type="number"
                min={0}
                max={100}
                step="any"
              />
            </Field>
            <Field label="Investigation remarks" error={errors.investigation?.remarks?.message}>
              <textarea
                {...register("investigation.remarks")}
                className="field-control min-h-24"
                maxLength={2000}
              />
            </Field>
          </div>
        </section>
        <FormMessage>{errors.root?.message}</FormMessage>
        <div className="mobile-sticky-actions flex justify-end gap-3">
          {cancel}
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Saving…" : patient ? "Save changes" : "Save patient"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
      <FormMessage>{error}</FormMessage>
    </label>
  );
}

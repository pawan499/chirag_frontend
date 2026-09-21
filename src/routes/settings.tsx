import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, fetchSettings } from "@/lib/app-data";
import { ErrorState, LoadingState } from "@/components/ui";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save, Settings as SettingsIcon } from "@/components/icons";
import { AppLayout } from "@/components/app-layout";
import { FormMessage, PageHeader } from "@/components/ui";
export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Chirag Eye Care & Optics" },
      {
        name: "description",
        content: "Update Chirag Eye Care & Optics shop information and default visit settings.",
      },
      { property: "og:title", content: "Settings — Chirag Eye Care & Optics" },
      { property: "og:description", content: "Keep shop information and default fees up to date." },
    ],
  }),
  component: Settings,
});
const schema = z.object({
  doctor: z.string().trim().min(2, "Enter the doctor name.").max(100),
  shop: z.string().trim().min(2, "Enter the shop name.").max(100),
  mobile: z.string().trim().max(20).optional(),
  email: z.string().email("Enter a valid email.").or(z.literal("")),
  address: z.string().max(240).optional(),
  registration: z.string().max(40).optional(),
  fee: z.coerce.number().min(0).max(100000),
});
type SettingsForm = z.infer<typeof schema>;
function Settings() {
  const cache = useQueryClient();
  const query = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctor: "",
      shop: "",
      mobile: "",
      email: "",
      address: "",
      registration: "",
      fee: 0,
    },
  });
  useEffect(() => {
    if (query.data) {
      const d = query.data;
      reset({
        doctor: String(d["doctorName"] ?? ""),
        shop: String(d["shopName"] ?? ""),
        mobile: String(d["mobile"] ?? ""),
        email: String(d["email"] ?? ""),
        address: String(d["address"] ?? ""),
        registration: String(d["registrationNumber"] ?? ""),
        fee: Number(d["defaultConsultationFee"] ?? 0),
      });
    }
  }, [query.data, reset]);
  const submit = async (data: SettingsForm) => {
    try {
      await apiRequest("/settings", {
        method: "PATCH",
        body: JSON.stringify({
          doctorName: data.doctor,
          shopName: data.shop,
          mobile: data.mobile,
          email: data.email,
          address: data.address,
          registrationNumber: data.registration,
          defaultConsultationFee: data.fee,
        }),
      });
      await cache.invalidateQueries();
      toast.success("Settings updated successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save settings");
    }
  };
  if (query.isPending)
    return (
      <AppLayout>
        <LoadingState />
      </AppLayout>
    );
  if (query.isError)
    return (
      <AppLayout>
        <ErrorState onRetry={() => void query.refetch()} />
      </AppLayout>
    );
  return (
    <AppLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Keep your shop information and default visit settings current."
        action={
          <span className="rounded-md bg-surface-blue p-2 text-info">
            <SettingsIcon size={20} />
          </span>
        }
      />
      <form onSubmit={handleSubmit(submit)} className="max-w-3xl space-y-5">
        <section className="panel p-5">
          <h2 className="mb-5 font-bold text-ink">Shop information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Doctor name" error={errors.doctor?.message}>
              <input {...register("doctor")} className="field-control" />
            </Field>
            <Field label="Shop name" error={errors.shop?.message}>
              <input {...register("shop")} className="field-control" />
            </Field>
            <Field label="Mobile">
              <input {...register("mobile")} className="field-control" inputMode="tel" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} className="field-control" type="email" />
            </Field>
            <Field label="Address">
              <textarea {...register("address")} className="field-control min-h-24" />
            </Field>
            <Field label="Registration number (optional)">
              <input {...register("registration")} className="field-control" />
            </Field>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="mb-5 font-bold text-ink">Default settings</h2>
          <div className="max-w-xs">
            <Field label="Default eye test fee" error={errors.fee?.message}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ₹
                </span>
                <input {...register("fee")} className="field-control pl-8" type="number" min="0" />
              </div>
            </Field>
          </div>
        </section>
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            <Save size={16} />
            {isSubmitting ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      <FormMessage>{error}</FormMessage>
    </label>
  );
}

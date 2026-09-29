import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-alert-dialog";
import { ShieldCheck, TriangleAlert } from "lucide-react";
type Options = { title: string; message: string; confirmText: string; danger?: boolean };
export function useConfirmPopup() {
  const [options, setOptions] = useState<Options | null>(null);
  const pending = useRef<((value: boolean) => void) | null>(null);
  const confirm = useCallback(
    (value: Options) =>
      new Promise<boolean>((resolve) => {
        if (pending.current) {
          resolve(false);
          return;
        }
        pending.current = resolve;
        setOptions(value);
      }),
    [],
  );
  const finish = (result: boolean) => {
    const resolve = pending.current;
    pending.current = null;
    setOptions(null);
    resolve?.(result);
  };
  useEffect(
    () => () => {
      pending.current?.(false);
      pending.current = null;
    },
    [],
  );
  const Icon = options?.danger ? TriangleAlert : ShieldCheck;
  const popup = (
    <Dialog.Root
      open={!!options}
      onOpenChange={(open) => {
        if (!open) finish(false);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${options?.danger ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-700"}`}
          >
            <Icon size={27} strokeWidth={1.8} />
          </div>
          <Dialog.Title className="text-xl font-bold tracking-tight text-slate-900">
            {options?.title}
          </Dialog.Title>
          <Dialog.Description className="mt-3 max-h-[45vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {options?.message}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Dialog.Cancel
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
              onClick={() => finish(false)}
            >
              Cancel
            </Dialog.Cancel>
            <Dialog.Action
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${options?.danger ? "bg-red-600 hover:bg-red-700" : "bg-teal-700 hover:bg-teal-800"}`}
              onClick={() => finish(true)}
            >
              {options?.confirmText}
            </Dialog.Action>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
  return { confirm, popup };
}

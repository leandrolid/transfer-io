import { FormEvent, useState, useTransition } from "react";

export type FormState = {
  success: boolean;
  message: string | null;
  errors: Partial<Record<string, string[]>> | null | undefined;
};

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: (data: FormData) => Promise<void> | void,
  initialState?: FormState
) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState(
    initialState ?? { success: false, message: null, errors: null }
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const state = await action(data);
      if (state.success && onSuccess) {
        await onSuccess(data);
      }
      setFormState(state);
    });
    // requestFormReset(form)
  }

  return [formState, handleSubmit, isPending] as const;
}

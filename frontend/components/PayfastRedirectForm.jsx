import React, { useEffect, useRef } from "react";

export default function PayfastRedirectForm({ action, payload, autoSubmit = false }) {
  const formRef = useRef(null);

  useEffect(() => {
    if (autoSubmit && formRef.current && action && payload) {
      formRef.current.submit();
    }
  }, [autoSubmit, action, payload]);

  if (!action || !payload) return null;

  return (
    <form ref={formRef} method="POST" action={action}>
      {Object.entries(payload).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={String(value ?? "")} />
      ))}
      <button type="submit">Proceed to Payfast</button>
    </form>
  );
}

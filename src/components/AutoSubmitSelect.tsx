"use client";

// Select qui soumet son formulaire dès que la valeur change (filtres de liste).
export function AutoSubmitSelect(props: React.ComponentProps<"select">) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}

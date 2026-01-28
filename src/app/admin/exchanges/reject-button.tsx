"use client";
import { Button } from "@/components/ui/button";

export default function RejectExchangeButton({ id }: { id: string }) {
  const reject = async () => {
    const res = await fetch(`/api/exchanges/${id}/reject`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Exchange rejected!");
      location.reload();
    } else {
      alert("Failed to reject");
    }
  };

  return (
    <Button variant="destructive" onClick={reject}>
      Reject
    </Button>
  );
}

"use client";
import { Button } from "@/components/ui/button";

export default function ApproveExchangeButton({ id }: { id: string }) {
  const approve = async () => {
    const res = await fetch(`/api/exchanges/${id}/approve`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Exchange approved!");
      location.reload();
    } else {
      alert("Failed to approve");
    }
  };

  return (
    <Button variant="default" onClick={approve}>
      Approve
    </Button>
  );
}

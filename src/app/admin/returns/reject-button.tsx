"use client";
import { Button } from "@/components/ui/button";

export default function ApproveReturnButton({ id }: { id: string }) {
  const approve = async () => {
    const res = await fetch(`/api/returns/${id}/approve`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Return approved!");
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

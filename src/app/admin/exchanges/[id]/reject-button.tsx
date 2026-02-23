"use client";

import { useRouter } from "next/navigation";

export default function RejectExchangeButton({ id }: { id: string }) {
  const router = useRouter();

  const reject = async () => {
    await fetch(`/api/admin/exchanges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });

    router.refresh();
  };

  return (
    <button
      onClick={reject}
      className="px-3 py-1 bg-[#4A5422] text-white rounded"
    >
      Reject
    </button>
  );
}

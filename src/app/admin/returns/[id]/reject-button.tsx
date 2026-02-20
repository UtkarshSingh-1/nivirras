"use client";

import { useRouter } from "next/navigation";

export default function RejectReturnButton({ id }: { id: string }) {
  const router = useRouter();

  const reject = async () => {
    await fetch(`/api/admin/returns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });

    router.refresh();
  };

  return (
    <button
      onClick={reject}
      className="px-3 py-1 bg-red-600 text-white rounded"
    >
      Reject
    </button>
  );
}

'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from "next/image"

export default function ReviewItem({ review }: any) {
  const [helpful, setHelpful] = useState(review.helpful ?? 0)
  const [notHelpful, setNotHelpful] = useState(review.notHelpful ?? 0)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function vote(type: "helpful" | "notHelpful") {
    if (voted || loading) return
    setLoading(true)
    try {
      await axios.post("/api/reviews/helpful", { reviewId: review.id, vote: type })
      if (type === "helpful") setHelpful((n: number) => n + 1)
      else setNotHelpful((n: number) => n + 1)
      setVoted(true)
    } catch (err: any) {
      if (err?.response?.status === 400) setVoted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded space-y-2">
      <div className="font-semibold">{review.rating} ★</div>
      <div className="font-medium">{review.title}</div>
      <div className="text-sm text-[#4A5422]">{review.comment}</div>

      {review.media?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.media.map((m: any, i: number) =>
            m.type === "image" ? (
              <Image
                key={i}
                src={m.url}
                alt="Review media"
                width={80}
                height={80}
                sizes="80px"
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <video key={i} src={m.url} width={160} controls className="rounded" />
            )
          )}
        </div>
      )}

      <div className="flex gap-4 text-sm pt-2">
        <button
          onClick={() => vote("helpful")}
          disabled={voted || loading}
          className="text-[#636B2F] disabled:opacity-50"
        >
          Helpful ({helpful})
        </button>
        <button
          onClick={() => vote("notHelpful")}
          disabled={voted || loading}
          className="text-[#4A5422] disabled:opacity-50"
        >
          Not Helpful ({notHelpful})
        </button>
      </div>
    </div>
  )
}

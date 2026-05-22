'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from "next/image"

export default function ReviewForm({ productId, onAdd }: any) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function uploadFile(file: File) {
    if (file.type.startsWith("video") && file.size > 15 * 1024 * 1024) {
      alert("Max video size is 15MB")
      return
    }

    if (file.type.startsWith("image") && file.size > 5 * 1024 * 1024) {
      alert("Max image size is 5MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/review/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
      return
    }

    setMedia(prev => [...prev, {
      type: file.type.startsWith("video") ? "video" : "image",
      url: data.url
    }])
  }

  async function submit() {
    setLoading(true)
    const { data } = await axios.post("/api/reviews", {
      productId,
      rating,
      title,
      comment,
      media
    })
    onAdd(data.review)
    setTitle("")
    setComment("")
    setMedia([])
    setLoading(false)
  }

  return (
    <div className="border p-4 rounded space-y-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setRating(n)}>
            <span className={`text-xl ${n <= rating ? "text-[#8A9353]" : "text-[#8A9353]"}`}>★</span>
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="border rounded w-full p-2"
      />

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write your review..."
        className="border rounded w-full p-2"
      />

      <input type="file" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />

      <div className="flex gap-2 flex-wrap">
        {media.map((m, i) =>
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
            <video key={i} src={m.url} width={120} controls />
          )
        )}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-[#636B2F] text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Submit Review"}
      </button>
    </div>
  )
}

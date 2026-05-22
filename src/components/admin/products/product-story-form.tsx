"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface StoryProduct {
  id: string
  name: string
  category: { name: string }
  storyTitle: string
  storyContent: string
  storyImages: string[]
}

interface ProductStoryFormProps {
  product: StoryProduct
}

export function ProductStoryForm({ product }: ProductStoryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [storyTitle, setStoryTitle] = useState(product.storyTitle)
  const [storyContent, setStoryContent] = useState(product.storyContent)
  const [storyImages, setStoryImages] = useState<string[]>(product.storyImages ?? [])

  const hasStory = Boolean(storyTitle.trim() || storyContent.trim() || storyImages.length > 0)

  const addImageUrl = () => {
    const trimmed = newImageUrl.trim()
    if (!trimmed) return

    if (storyImages.includes(trimmed)) {
      toast({
        title: "Duplicate URL",
        description: "This image URL is already in the list.",
        variant: "destructive",
      })
      return
    }

    setStoryImages((prev) => [...prev, trimmed])
    setNewImageUrl("")
  }

  const removeImageUrl = (index: number) => {
    setStoryImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!storyTitle.trim() || !storyContent.trim()) {
      toast({
        title: "Missing fields",
        description: "Story title and content are required.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/story`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyTitle: storyTitle.trim(),
          storyContent: storyContent.trim(),
          storyImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save product story")
      }

      toast({
        title: "Story saved",
        description: "Product story updated successfully.",
      })

      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save product story"
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const onRemoveStory = async () => {
    setRemoving(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/story`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to remove product story")
      }

      setStoryTitle("")
      setStoryContent("")
      setStoryImages([])

      toast({
        title: "Story removed",
        description: "Product story has been removed.",
      })

      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove product story"
      toast({
        title: "Remove failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setRemoving(false)
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Story Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story-title">Story Title</Label>
            <Input
              id="story-title"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Enter the story title"
              className="border-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-content">Story Content</Label>
            <Textarea
              id="story-content"
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              placeholder="Describe the story behind this product"
              className="border-0 min-h-[140px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-image-url">Story Image URLs</Label>
            <div className="flex gap-2">
              <Input
                id="story-image-url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                className="border-0"
              />
              <Button type="button" variant="outline" onClick={addImageUrl} className="border-0 bg-muted/30">
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {storyImages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No story images added.</p>
              ) : (
                storyImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
                  >
                    <p className="text-sm truncate">{url}</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeImageUrl(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onRemoveStory}
            disabled={removing || !hasStory}
            className="border-0 bg-muted/30"
          >
            {removing ? "Removing..." : "Remove Story"}
          </Button>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/products/${product.id}`)}
              className="border-0 bg-muted/30"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-crimson-600 hover:bg-crimson-700 border-0">
              {saving ? "Saving..." : "Save Story"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

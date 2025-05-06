"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactDialog() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [open, setOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" id="contact-dialog-trigger" onClick={() => setOpen(true)}>
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>Send us a message and we'll get back to you as soon as possible.</DialogDescription>
        </DialogHeader>
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Message Sent!</h3>
            <p className="text-center text-muted-foreground">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Message" />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={status==='loading'}>{status==='loading' ? 'Sending...' : 'Send'}</Button>
            </DialogFooter>
            {status==='success' && <div className="text-green-600 text-sm mt-2">Message sent!</div>}
            {status==='error' && <div className="text-red-600 text-sm mt-2">Failed to send. Please try again.</div>}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

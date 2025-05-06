import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  // Use Brevo SMTP settings from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.CONTACT_EMAIL_HOST,
    port: Number(process.env.CONTACT_EMAIL_PORT),
    secure: process.env.CONTACT_EMAIL_SECURE === "true",
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  })

  // Debug logging for environment variables (do not log actual password)
  console.log('CONTACT_EMAIL_USER loaded:', !!process.env.CONTACT_EMAIL_USER)
  console.log('CONTACT_EMAIL_PASS loaded:', !!process.env.CONTACT_EMAIL_PASS)
  console.log('CONTACT_EMAIL_HOST loaded:', !!process.env.CONTACT_EMAIL_HOST)

  try {
    await transporter.sendMail({
      from: 'DipBuyer Team <noreply@dipbuyer.ai>',
      to: 'vashakmadze.sergo@gmail.com',
      subject: `DipBuyer Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Message:</b><br/>${message}`,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    // Robust error logging for debugging
    console.error("Contact API error:", error)
    console.error("CONTACT_EMAIL_USER present:", !!process.env.CONTACT_EMAIL_USER)
    console.error("CONTACT_EMAIL_PASS present:", !!process.env.CONTACT_EMAIL_PASS)
    console.error("CONTACT_EMAIL_HOST present:", !!process.env.CONTACT_EMAIL_HOST)
    return NextResponse.json({ ok: false, error: 'Failed to send message.' }, { status: 500 })
  }
} 
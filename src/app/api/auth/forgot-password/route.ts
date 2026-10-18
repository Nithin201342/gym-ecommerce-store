import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/password-reset";
import { forgotPasswordSchema } from "@/lib/validations/auth";

const GENERIC_MESSAGE =
  "If an account with that email can be recovered, instructions will be sent. If you don't receive an email, check your spam folder or try again later.";
const TOKEN_LIFETIME_MS = 60 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const siteUrl = process.env.NEXTAUTH_URL;
  if (!smtpUser || !smtpPass || !siteUrl) {
    console.error("Password recovery SMTP is not configured.");
    return NextResponse.json(
      { error: "Password recovery email is not configured. Check the server setup." },
      { status: 503 }
    );
  }

  let resetUrl: URL;
  try {
    resetUrl = new URL("/reset-password", siteUrl);
    if (resetUrl.protocol !== "https:" && resetUrl.hostname !== "localhost") {
      throw new Error("Password reset URL must use HTTPS.");
    }
  } catch (error) {
    console.error("Invalid NEXTAUTH_URL for password recovery:", error);
    return NextResponse.json(
      { error: "Password recovery is temporarily unavailable." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error("Password recovery SMTP verification failed:", error);
    return NextResponse.json(
      { error: "Password recovery email is unavailable. Check SMTP settings and the server log." },
      { status: 503 }
    );
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const now = new Date();
  const activeToken = await prisma.verificationToken.findFirst({
    where: { identifier: email, expires: { gt: now } },
    orderBy: { expires: "desc" },
  });
  const issuedAt = activeToken
    ? activeToken.expires.getTime() - TOKEN_LIFETIME_MS
    : 0;
  if (activeToken && now.getTime() - issuedAt < REQUEST_COOLDOWN_MS) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const { token, tokenHash } = createPasswordResetToken();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: tokenHash,
      expires: new Date(now.getTime() + TOKEN_LIFETIME_MS),
    },
  });
  resetUrl.searchParams.set("token", token);

  try {
    const result = await transporter.sendMail({
      from: { name: "NovaFit", address: smtpUser },
      to: email,
      subject: "Reset your NovaFit password",
      text: `We received a request to reset your NovaFit password.\n\nReset your password: ${resetUrl.toString()}\n\nThis link expires in one hour and can only be used once. If you did not request this, you can ignore this email.`,
      html: `<p>We received a request to reset your NovaFit password.</p>
        <p><a href="${resetUrl.toString()}">Reset your password</a></p>
        <p>This link expires in one hour and can only be used once. If you did not request this, you can ignore this email.</p>`,
    });

    if (result.accepted.length === 0) {
      throw new Error("SMTP server did not accept the password reset email.");
    }

    console.info("Password reset email accepted by SMTP server.");
  } catch (error) {
    await prisma.verificationToken.deleteMany({ where: { token: tokenHash } });
    console.error("Password reset email delivery failed:", error);
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}

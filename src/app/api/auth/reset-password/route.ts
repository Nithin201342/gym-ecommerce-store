import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/password-reset";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;
  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();

  const validToken = await prisma.verificationToken.findFirst({
    where: { token: tokenHash, expires: { gt: now } },
    select: { identifier: true },
  });
  if (!validToken) {
    return NextResponse.json(
      { error: "The reset link is invalid or has expired." },
      { status: 400 }
    );
  }
  const eligibleUser = await prisma.user.findUnique({
    where: { email: validToken.identifier },
    select: { password: true },
  });
  if (!eligibleUser?.password) {
    return NextResponse.json(
      { error: "The reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const reset = await prisma.$transaction(async (transaction) => {
    const resetToken = await transaction.verificationToken.findUnique({
      where: { token: tokenHash },
    });
    if (!resetToken || resetToken.expires <= now) return false;

    const user = await transaction.user.findUnique({
      where: { email: resetToken.identifier },
      select: { id: true, password: true },
    });
    if (!user?.password) return false;

    const consumed = await transaction.verificationToken.deleteMany({
      where: {
        id: resetToken.id,
        token: tokenHash,
        expires: { gt: now },
      },
    });
    if (consumed.count !== 1) return false;

    await transaction.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    await transaction.verificationToken.deleteMany({
      where: { identifier: resetToken.identifier },
    });
    return true;
  });

  if (!reset) {
    return NextResponse.json(
      { error: "The reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Your password has been updated. You can now sign in." });
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildQRContent, generateQRDataUrl, generateQRSvg } from "@/lib/qr-generator";
import type { QRCodeType, QRStyleOptions } from "@/lib/qr-generator";
import { PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await req.json();
    const { type, data, style, format = "png", save = false } = body as {
      type: QRCodeType;
      data: Record<string, string>;
      style: Partial<QRStyleOptions>;
      format: string;
      save: boolean;
    };

    const content = buildQRContent(type, data);
    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // Check user limits if authenticated
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscription: true },
      });

      const plan = user?.plan || "FREE";
      const planConfig = PLANS[plan];

      // Check daily limit for free users
      if (plan === "FREE") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await prisma.qRCode.count({
          where: {
            userId: session.user.id,
            createdAt: { gte: today },
          },
        });
        if (todayCount >= planConfig.limits.qrCodesPerDay) {
          return NextResponse.json(
            { error: "Daily QR code limit reached. Upgrade to Pro for unlimited." },
            { status: 429 }
          );
        }
      }

      // Check AI style access
      if (style?.aiStyle && !planConfig.limits.aiStyles) {
        return NextResponse.json(
          { error: "AI styles require a Pro or Business plan." },
          { status: 403 }
        );
      }

      // Check format access
      if (format !== "png" && !(planConfig.limits.formats as readonly string[]).includes(format)) {
        return NextResponse.json(
          { error: `${format.toUpperCase()} export requires a Pro or Business plan.` },
          { status: 403 }
        );
      }
    }

    let result: string;
    if (format === "svg") {
      result = await generateQRSvg(content, style);
    } else {
      result = await generateQRDataUrl(content, style);
    }

    // Save to database if user is authenticated and wants to save
    if (save && session?.user?.id) {
      await prisma.qRCode.create({
        data: {
          userId: session.user.id,
          type,
          content,
          title: data.title || data.url || data.text || type,
          style: JSON.stringify(style),
          imageUrl: result.substring(0, 500), // Store truncated for reference
          isAI: !!style?.aiStyle,
        },
      });
    }

    return NextResponse.json({ image: result, format });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

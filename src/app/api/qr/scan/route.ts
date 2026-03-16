import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { qrCodeId } = await req.json();
    if (!qrCodeId) {
      return NextResponse.json({ error: "Missing QR code ID" }, { status: 400 });
    }

    const headers = Object.fromEntries(req.headers.entries());
    const userAgent = headers["user-agent"] || "";
    const ip = headers["x-forwarded-for"]?.split(",")[0] || "unknown";

    let device = "unknown";
    let browser = "unknown";
    let os = "unknown";

    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";
    else device = "desktop";

    if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent)) browser = "Safari";

    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/mac/i.test(userAgent)) os = "macOS";
    else if (/linux/i.test(userAgent)) os = "Linux";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/ios|iphone|ipad/i.test(userAgent)) os = "iOS";

    await prisma.scanEvent.create({
      data: {
        qrCodeId,
        ip,
        device,
        browser,
        os,
      },
    });

    await prisma.qRCode.update({
      where: { id: qrCodeId },
      data: { scanCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Scan tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track scan" },
      { status: 500 }
    );
  }
}

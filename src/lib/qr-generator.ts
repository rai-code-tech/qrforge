import QRCode from "qrcode";

export type QRCodeType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "social";

export type QRShape = "square" | "dots" | "rounded";

export interface QRStyleOptions {
  foreground: string;
  background: string;
  shape: QRShape;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  size: number;
  margin: number;
  logoUrl?: string;
  frameText?: string;
  frameColor?: string;
  aiStyle?: string;
}

export const defaultStyle: QRStyleOptions = {
  foreground: "#000000",
  background: "#ffffff",
  shape: "square",
  errorCorrectionLevel: "H",
  size: 400,
  margin: 2,
};

export function buildQRContent(type: QRCodeType, data: Record<string, string>): string {
  switch (type) {
    case "url":
      return data.url || "";
    case "text":
      return data.text || "";
    case "wifi":
      return `WIFI:T:${data.encryption || "WPA"};S:${data.ssid || ""};P:${data.password || ""};;`;
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${data.lastName || ""};${data.firstName || ""}`,
        `FN:${data.firstName || ""} ${data.lastName || ""}`,
        data.org ? `ORG:${data.org}` : "",
        data.title ? `TITLE:${data.title}` : "",
        data.phone ? `TEL:${data.phone}` : "",
        data.email ? `EMAIL:${data.email}` : "",
        data.website ? `URL:${data.website}` : "",
        data.address ? `ADR:;;${data.address}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    case "email":
      return `mailto:${data.email || ""}?subject=${encodeURIComponent(data.subject || "")}&body=${encodeURIComponent(data.body || "")}`;
    case "phone":
      return `tel:${data.phone || ""}`;
    case "sms":
      return `sms:${data.phone || ""}${data.message ? `?body=${encodeURIComponent(data.message)}` : ""}`;
    case "whatsapp":
      return `https://wa.me/${data.phone || ""}${data.message ? `?text=${encodeURIComponent(data.message)}` : ""}`;
    case "social":
      return data.url || "";
    default:
      return data.text || data.url || "";
  }
}

export async function generateQRDataUrl(
  content: string,
  style: Partial<QRStyleOptions> = {}
): Promise<string> {
  const opts = { ...defaultStyle, ...style };

  const dataUrl = await QRCode.toDataURL(content || "https://qrforge.com", {
    width: opts.size,
    margin: opts.margin,
    color: {
      dark: opts.foreground,
      light: opts.background,
    },
    errorCorrectionLevel: opts.errorCorrectionLevel,
  });

  return dataUrl;
}

export async function generateQRSvg(
  content: string,
  style: Partial<QRStyleOptions> = {}
): Promise<string> {
  const opts = { ...defaultStyle, ...style };

  const svg = await QRCode.toString(content || "https://qrforge.com", {
    type: "svg",
    width: opts.size,
    margin: opts.margin,
    color: {
      dark: opts.foreground,
      light: opts.background,
    },
    errorCorrectionLevel: opts.errorCorrectionLevel,
  });

  return svg;
}

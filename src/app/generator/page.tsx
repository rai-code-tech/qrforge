"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  QrCode,
  Link2,
  Type,
  Wifi,
  User,
  Mail,
  Phone,
  Loader2,
  Save,
  Palette,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone";
type QRShape = "square" | "dots" | "rounded";

const qrTypes: { value: QRType; label: string; icon: React.ElementType }[] = [
  { value: "url", label: "URL", icon: Link2 },
  { value: "text", label: "Text", icon: Type },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "vCard", icon: User },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
];

const shapes: { value: QRShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
];

const errorLevels = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

export default function GeneratorPage() {
  const { data: session } = useSession();
  const [qrType, setQrType] = useState<QRType>("url");
  const [data, setData] = useState<Record<string, string>>({ url: "https://example.com" });
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [shape, setShape] = useState<QRShape>("square");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [size, setSize] = useState(400);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "svg">("png");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const generateQR = useCallback(
    async (save = false) => {
      if (save) setSaving(true);
      else setGenerating(true);

      try {
        const res = await fetch("/api/qr/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: qrType,
            data,
            style: { foreground, background, shape, errorCorrectionLevel: errorLevel, size },
            format: "png",
            save,
          }),
        });

        const result = await res.json();
        if (res.ok) {
          setQrImage(result.image);
          if (save) toast.success("QR code saved to your dashboard!");
        } else {
          toast.error(result.error || "Failed to generate QR code");
        }
      } catch {
        toast.error("Failed to generate QR code");
      } finally {
        setGenerating(false);
        setSaving(false);
      }
    },
    [qrType, data, foreground, background, shape, errorLevel, size]
  );

  // Auto-generate on changes with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      generateQR(false);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [generateQR]);

  function updateData(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleDownload() {
    if (!qrImage) return;

    if (format === "svg") {
      // Generate SVG and download
      fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: qrType,
          data,
          style: { foreground, background, shape, errorCorrectionLevel: errorLevel, size },
          format: "svg",
          save: false,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.image) {
            const blob = new Blob([result.image], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "qrforge-qrcode.svg";
            a.click();
            URL.revokeObjectURL(url);
          }
        })
        .catch(() => toast.error("Failed to download SVG"));
      return;
    }

    // PNG download
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "qrforge-qrcode.png";
    a.click();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="mt-1 text-muted-foreground">
          Create beautiful, customizable QR codes in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left: Controls */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="content" className="gap-2">
                <QrCode className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="gap-2">
                <Palette className="h-4 w-4" />
                Style
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* QR Type Selector */}
              <div>
                <Label className="mb-3 block text-sm font-medium">QR Code Type</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {qrTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setQrType(type.value);
                        setData({});
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                        qrType === type.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-500"
                          : "hover:border-blue-500/50 hover:bg-accent"
                      }`}
                    >
                      <type.icon className="h-5 w-5" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Fields */}
              <div className="space-y-4 rounded-xl border bg-card p-6">
                {qrType === "url" && (
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={data.url || ""}
                      onChange={(e) => updateData("url", e.target.value)}
                    />
                  </div>
                )}

                {qrType === "text" && (
                  <div className="space-y-2">
                    <Label htmlFor="text">Text Content</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter your text here..."
                      value={data.text || ""}
                      onChange={(e) => updateData("text", e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {qrType === "wifi" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ssid">Network Name (SSID)</Label>
                      <Input
                        id="ssid"
                        placeholder="My WiFi Network"
                        value={data.ssid || ""}
                        onChange={(e) => updateData("ssid", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="WiFi password"
                        value={data.password || ""}
                        onChange={(e) => updateData("password", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Encryption</Label>
                      <Select
                        value={data.encryption || "WPA"}
                        onValueChange={(v) => updateData("encryption", v ?? "WPA")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {qrType === "vcard" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={data.firstName || ""}
                          onChange={(e) => updateData("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={data.lastName || ""}
                          onChange={(e) => updateData("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcard-email">Email</Label>
                      <Input
                        id="vcard-email"
                        type="email"
                        placeholder="john@example.com"
                        value={data.email || ""}
                        onChange={(e) => updateData("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcard-phone">Phone</Label>
                      <Input
                        id="vcard-phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={data.phone || ""}
                        onChange={(e) => updateData("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org">Organization</Label>
                      <Input
                        id="org"
                        placeholder="Company name"
                        value={data.org || ""}
                        onChange={(e) => updateData("org", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        value={data.website || ""}
                        onChange={(e) => updateData("website", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {qrType === "email" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email-to">Email Address</Label>
                      <Input
                        id="email-to"
                        type="email"
                        placeholder="recipient@example.com"
                        value={data.email || ""}
                        onChange={(e) => updateData("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Email subject"
                        value={data.subject || ""}
                        onChange={(e) => updateData("subject", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body">Body</Label>
                      <Textarea
                        id="body"
                        placeholder="Email body..."
                        value={data.body || ""}
                        onChange={(e) => updateData("body", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {qrType === "phone" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="+1234567890"
                      value={data.phone || ""}
                      onChange={(e) => updateData("phone", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="space-y-6">
              <div className="space-y-6 rounded-xl border bg-card p-6">
                {/* Colors */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Colors</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fg-color" className="text-xs text-muted-foreground">
                        Foreground
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="fg-color"
                          value={foreground}
                          onChange={(e) => setForeground(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border"
                        />
                        <Input
                          value={foreground}
                          onChange={(e) => setForeground(e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bg-color" className="text-xs text-muted-foreground">
                        Background
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="bg-color"
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border"
                        />
                        <Input
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick color presets */}
                <div>
                  <Label className="mb-3 block text-xs text-muted-foreground">Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { fg: "#000000", bg: "#ffffff", name: "Classic" },
                      { fg: "#1e40af", bg: "#dbeafe", name: "Blue" },
                      { fg: "#7c3aed", bg: "#f3e8ff", name: "Purple" },
                      { fg: "#059669", bg: "#d1fae5", name: "Green" },
                      { fg: "#dc2626", bg: "#fee2e2", name: "Red" },
                      { fg: "#ffffff", bg: "#0f172a", name: "Dark" },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setForeground(preset.fg);
                          setBackground(preset.bg);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all hover:border-blue-500/50"
                      >
                        <div
                          className="h-3 w-3 rounded-full border"
                          style={{ backgroundColor: preset.fg }}
                        />
                        <div
                          className="h-3 w-3 rounded-full border"
                          style={{ backgroundColor: preset.bg }}
                        />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shape */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Shape</Label>
                  <div className="flex gap-2">
                    {shapes.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setShape(s.value)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          shape === s.value
                            ? "border-blue-500 bg-blue-500/10 text-blue-500"
                            : "hover:border-blue-500/50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Correction */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Error Correction</Label>
                  <Select
                    value={errorLevel}
                    onValueChange={(v) => { if (v) setErrorLevel(v as typeof errorLevel); }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {errorLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Higher levels allow more of the QR code to be damaged while remaining scannable.
                  </p>
                </div>

                {/* Size */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">
                    Size: {size}px
                  </Label>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="50"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>200px</span>
                    <span>1000px</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
                <Settings className="h-4 w-4" />
                Live Preview
              </h2>

              <div
                className="flex items-center justify-center rounded-xl p-4"
                style={{ backgroundColor: background }}
              >
                {generating && !qrImage ? (
                  <div className="flex h-64 w-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt="Generated QR Code"
                    className="max-h-80 max-w-full"
                  />
                ) : (
                  <div className="flex h-64 w-64 flex-col items-center justify-center text-muted-foreground">
                    <QrCode className="mb-2 h-16 w-16 opacity-20" />
                    <p className="text-sm">Your QR code will appear here</p>
                  </div>
                )}
              </div>

              {generating && qrImage && (
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating...
                </div>
              )}
            </div>

            {/* Download & Actions */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 space-y-2">
                <Label className="text-sm font-medium">Download Format</Label>
                <div className="flex gap-2">
                  {(["png", "svg"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium uppercase transition-all ${
                        format === f
                          ? "border-blue-500 bg-blue-500/10 text-blue-500"
                          : "hover:border-blue-500/50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={!qrImage}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {format.toUpperCase()}
                </Button>

                {session && (
                  <Button
                    variant="outline"
                    onClick={() => generateQR(true)}
                    disabled={saving || !qrImage}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save to Dashboard
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

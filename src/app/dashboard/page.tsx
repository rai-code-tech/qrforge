"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Plus,
  Trash2,
  ExternalLink,
  BarChart3,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface QRCodeItem {
  id: string;
  title: string | null;
  type: string;
  content: string;
  isAI: boolean;
  scanCount: number;
  createdAt: string;
  _count: { scans: number };
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
      return;
    }
    if (session) {
      fetchQRCodes();
    }
  }, [session, isPending, router]);

  async function fetchQRCodes() {
    try {
      const res = await fetch("/api/qr/history");
      if (res.ok) {
        const data = await res.json();
        setQrCodes(data.qrCodes || []);
      }
    } catch {
      toast.error("Failed to load QR codes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/qr/history?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
        toast.success("QR code deleted");
      } else {
        toast.error("Failed to delete QR code");
      }
    } catch {
      toast.error("Failed to delete QR code");
    } finally {
      setDeleting(null);
    }
  }

  if (isPending || (!session && !isPending)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {session?.user?.name || "there"}! Manage your QR codes.
          </p>
        </div>
        <Link href="/generator">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <QrCode className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{qrCodes.length}</p>
              <p className="text-sm text-muted-foreground">Total QR Codes</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {qrCodes.reduce((sum, qr) => sum + (qr._count?.scans || qr.scanCount || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Scans</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {qrCodes.filter((qr) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return new Date(qr.createdAt) >= today;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Created Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Codes List */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Your QR Codes</h2>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : qrCodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
            <QrCode className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No QR codes yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first QR code to get started.
            </p>
            <Link href="/generator" className="mt-6 inline-block">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Create QR Code
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">
                      {qr.title || "Untitled QR Code"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {qr.type}
                      </Badge>
                      {qr.isAI && (
                        <Badge className="bg-purple-500/10 text-purple-500 text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleDelete(qr.id)}
                    disabled={deleting === qr.id}
                  >
                    {deleting === qr.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">
                  {qr.content}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {qr._count?.scans || qr.scanCount || 0} scans
                  </span>
                  <span>
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight,
  Users,
  DollarSign,
  X,
  AlertTriangle,
  Download,
  FileText,
} from "lucide-react";
import { bookingApi, Booking } from "@/services/api.service";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-brand-500/20 text-brand-300 border-brand-500/30",
};

const tabs = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Generate & download invoice as HTML→print
  const downloadInvoice = (booking: Booking) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice #${booking._id.slice(-8).toUpperCase()}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1e293b; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
    .invoice-title { font-size: 28px; font-weight: bold; color: #1e293b; }
    .badge { background: #4f46e5; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .section { margin-bottom: 24px; }
    .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; }
    td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; }
    .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #4f46e5; border-bottom: none; }
    .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; background: #dcfce7; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">✈ TravelAI</div>
      <div style="color:#64748b;font-size:13px;margin-top:4px">hello@travelai.com</div>
    </div>
    <div style="text-align:right">
      <div class="invoice-title">INVOICE</div>
      <div style="color:#64748b;font-size:14px">#${booking._id.slice(-8).toUpperCase()}</div>
      <div style="color:#64748b;font-size:13px;margin-top:4px">${new Date(booking.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:30px">
    <div class="section">
      <h3>Booking Details</h3>
      <div><strong>Package:</strong> ${booking.packageItem?.title || "Travel Package"}</div>
      <div><strong>Destination:</strong> ${booking.packageItem?.destination?.name || "—"}</div>
      <div><strong>Travel Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} → ${new Date(booking.endDate).toLocaleDateString()}</div>
      <div><strong>Guests:</strong> ${booking.guests}</div>
    </div>
    <div class="section">
      <h3>Payment Status</h3>
      <div><span class="status">${booking.isPaid ? "✓ Paid" : "Pending"}</span></div>
      <div style="margin-top:8px"><strong>Method:</strong> ${booking.paymentMethod}</div>
      ${booking.paidAt ? `<div><strong>Paid on:</strong> ${new Date(booking.paidAt).toLocaleDateString()}</div>` : ""}
      <div style="margin-top:8px"><strong>Status:</strong> ${booking.status.toUpperCase()}</div>
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
    <tbody>
      <tr>
        <td>${booking.packageItem?.title || "Travel Package"}</td>
        <td>${booking.guests} guest${booking.guests > 1 ? "s" : ""}</td>
        <td>$${((booking.totalPrice + booking.discount) / booking.guests).toFixed(2)}</td>
        <td>$${(booking.totalPrice + booking.discount).toFixed(2)}</td>
      </tr>
      ${booking.discount > 0 ? `<tr><td colspan="3" style="color:#16a34a">Discount Applied</td><td style="color:#16a34a">-$${booking.discount.toFixed(2)}</td></tr>` : ""}
    </tbody>
    <tfoot>
      <tr class="total-row"><td colspan="3">Total</td><td>$${booking.totalPrice.toFixed(2)}</td></tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>Thank you for choosing TravelAI! For support: hello@travelai.com | help.travelai.com</p>
    <p>This is a computer-generated invoice and does not require a signature.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TravelAI-Invoice-${booking._id.slice(-8).toUpperCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    bookingApi
      .getMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await bookingApi.updateStatus(cancelId, "cancelled");
      setBookings((prev) =>
        prev.map((b) => (b._id === cancelId ? { ...b, status: "cancelled" } : b))
      );
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-slate-400 mt-1">Manage and track all your travel bookings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-brand-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {tab}
            <span className="ml-2 text-xs opacity-70">
              ({tab === "all" ? bookings.length : bookings.filter((b) => b.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="animate-spin text-brand-500" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
          <CalendarCheck size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-300 font-medium">No bookings found</p>
          <Link
            href="/packages"
            className="mt-4 inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm"
          >
            Browse packages <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Image */}
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={booking.packageItem?.images?.[0] || "/api/placeholder/128/128"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {booking.packageItem?.title || "Travel Package"}
                      </h3>
                      <p className="text-slate-400 text-sm mt-0.5">
                        Booking #{booking._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                        statusColor[booking.status]
                      }`}
                    >
                      {booking.status === "pending" && <Clock size={12} />}
                      {booking.status === "confirmed" && <CheckCircle size={12} />}
                      {booking.status === "cancelled" && <XCircle size={12} />}
                      {booking.status === "completed" && <CheckCircle size={12} />}
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarCheck size={14} />
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} />
                      ${booking.totalPrice.toLocaleString()}
                      {booking.discount > 0 && (
                        <span className="text-green-400 text-xs">
                          (-${booking.discount.toFixed(0)} discount)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!booking.isPaid && booking.status !== "cancelled" && (
                      <button
                        onClick={async () => {
                          await bookingApi.pay(booking._id);
                          setBookings((prev) =>
                            prev.map((b) =>
                              b._id === booking._id
                                ? { ...b, isPaid: true, status: "confirmed" }
                                : b
                            )
                          );
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-medium transition-colors"
                      >
                        Pay Now (Mock)
                      </button>
                    )}
                    {booking.status === "pending" && (
                      <button
                        onClick={() => setCancelId(booking._id)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.isPaid && (
                      <span className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-medium">
                        ✓ Paid
                      </span>
                    )}
                    <button
                      onClick={() => downloadInvoice(booking)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      <Download size={13} />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <AlertTriangle className="text-red-400" size={20} />
              </div>
              <h3 className="font-semibold text-white">Cancel Booking?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              This action cannot be undone. Are you sure you want to cancel this booking?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

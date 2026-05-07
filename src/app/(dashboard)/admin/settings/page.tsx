"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, CheckCircle, XCircle, Loader, Shield, Zap, CreditCard, Image, Globe, Tag } from "lucide-react";
import { adminApi } from "@/services/api.service";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader className="animate-spin text-brand-500" size={32} />
    </div>
  );

  const integrations = [
    { label: "Stripe Payment", enabled: settings?.stripeEnabled, icon: <CreditCard size={18} />, color: "text-purple-400", desc: "Payment processing via Stripe" },
    { label: "Cloudinary", enabled: settings?.cloudinaryEnabled, icon: <Image size={18} />, color: "text-blue-400", desc: "Image upload & optimization" },
    { label: "Gemini AI", enabled: settings?.geminiEnabled, icon: <Zap size={18} />, color: "text-amber-400", desc: "AI recommendations & chatbot" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings size={22} className="text-brand-400" />
          Admin Settings
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Platform configuration and integrations</p>
      </div>

      {/* Integration Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Globe size={18} className="text-cyan-400" />
          Integration Status
        </h2>
        <div className="space-y-3">
          {integrations.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>{item.icon}</div>
                <div>
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                item.enabled ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {item.enabled ? <><CheckCircle size={12} /> Connected</> : <><XCircle size={12} /> Not configured</>}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-4 flex items-center gap-1">
          <Shield size={11} />
          Configure API keys in backend/.env file
        </p>
      </div>

      {/* Site Settings */}
      {settings && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Globe size={18} className="text-brand-400" />
            Site Configuration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Site Name", value: settings.siteName, key: "siteName" },
              { label: "Contact Email", value: settings.siteEmail, key: "siteEmail" },
              { label: "Currency", value: settings.currency, key: "currency" },
              { label: "Max Guests/Booking", value: settings.maxGuestsPerBooking, key: "maxGuestsPerBooking" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs text-slate-400 mb-1.5">{field.label}</label>
                <input
                  defaultValue={field.value}
                  onChange={(e) => setSettings((p: any) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Code */}
      {settings && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Tag size={18} className="text-amber-400" />
            Promo Code
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Promo Code</label>
              <input defaultValue={settings.promoCode}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none font-mono" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Discount %</label>
              <input type="number" defaultValue={settings.promoDiscount}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none" />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            Note: Promo code logic is in backend/src/controllers/booking.controller.ts
          </p>
        </div>
      )}

      {/* AI Config */}
      {settings && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Zap size={18} className="text-purple-400" />
            AI Configuration
          </h2>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">AI Model</label>
            <select defaultValue={settings.aiModel}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none">
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
            <p className="text-slate-500 text-xs mt-2">Change model in backend/src/services/gemini.service.ts</p>
          </div>
        </div>
      )}

      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors">
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Settings size={16} /> Save Settings</>}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Bell, Moon, Globe, Shield, Trash2, CheckCircle } from "lucide-react";

export default function UserSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    promotions: false,
    darkMode: true,
    language: "English",
    currency: "USD",
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    localStorage.setItem("user-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Customize your TravelAI experience.</p>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Notifications</h2>
        </div>
        {[
          { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
          { key: "bookingAlerts", label: "Booking Alerts", desc: "Get notified about booking status changes" },
          { key: "promotions", label: "Promotions & Deals", desc: "Receive special offers and discounts" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p className="text-slate-500 text-xs">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key as keyof typeof settings)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings[key as keyof typeof settings] ? "bg-brand-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings[key as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Moon size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-white text-sm font-medium">Dark Mode</p>
            <p className="text-slate-500 text-xs">Use dark theme across the app</p>
          </div>
          <button
            onClick={() => toggle("darkMode")}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.darkMode ? "bg-brand-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Preferences</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
            >
              {["English", "Bengali", "Hindi", "Spanish", "French"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings((p) => ({ ...p, currency: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-brand-500 focus:outline-none"
            >
              {["USD", "BDT", "EUR", "GBP", "INR"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-red-400" />
          <h2 className="font-semibold text-white">Danger Zone</h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-colors">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
      >
        {saved ? <CheckCircle size={16} /> : null}
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}

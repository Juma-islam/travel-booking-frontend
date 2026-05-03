"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Heart,
  Loader,
  Send,
  Copy,
  Download,
} from "lucide-react";

const travelTypes = ["Adventure", "Relaxation", "Cultural", "Family", "Solo", "Luxury"];
const seasons = ["Spring", "Summer", "Fall", "Winter", "Any"];
const interests = ["History", "Nature", "Food", "Adventure", "Culture", "Shopping", "Nightlife", "Wellness"];

interface PlannerState {
  destination: string;
  budget: string;
  travelType: string;
  season: string;
  selectedInterests: string[];
  days: string;
}

interface Results {
  recommendations?: string;
  itinerary?: string;
  budget?: string;
}

export default function AIPlannerPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState<PlannerState>({
    destination: "",
    budget: "",
    travelType: "",
    season: "",
    selectedInterests: [],
    days: "",
  });

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.destination.trim() !== "";
      case 2:
        return formData.budget !== "";
      case 3:
        return formData.travelType !== "";
      case 4:
        return formData.season !== "";
      case 5:
        return formData.selectedInterests.length > 0;
      case 6:
        return formData.days !== "";
      default:
        return false;
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      console.log("API Base:", API_BASE);
      console.log("Form Data:", formData);

      // Check if backend is reachable
      try {
        const healthCheck = await fetch(`${API_BASE}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!healthCheck.ok) {
          throw new Error(`Backend health check failed: ${healthCheck.status}`);
        }
      } catch (healthErr) {
        console.error("Backend health check failed:", healthErr);
        alert(
          `Cannot connect to backend at ${API_BASE}. Please ensure the backend server is running on port 5000.`
        );
        setLoading(false);
        return;
      }

      // Get recommendations
      console.log("Fetching recommendations...");
      const recRes = await fetch(`${API_BASE}/api/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: formData.budget,
          travelType: formData.travelType,
          season: formData.season,
          locationPreference: formData.destination,
        }),
      });
      if (!recRes.ok) throw new Error(`Recommendations failed: ${recRes.status}`);
      const rec = await recRes.json();
      console.log("Recommendations received:", rec);

      // Get itinerary
      console.log("Fetching itinerary...");
      const itRes = await fetch(`${API_BASE}/api/ai/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          days: formData.days,
          interests: formData.selectedInterests.join(", "),
        }),
      });
      if (!itRes.ok) throw new Error(`Itinerary failed: ${itRes.status}`);
      const it = await itRes.json();
      console.log("Itinerary received:", it);

      // Get budget estimate
      console.log("Fetching budget...");
      const budRes = await fetch(`${API_BASE}/api/ai/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          days: formData.days,
          travelStyle: formData.travelType,
        }),
      });
      if (!budRes.ok) throw new Error(`Budget failed: ${budRes.status}`);
      const bud = await budRes.json();
      console.log("Budget received:", bud);

      setResults({
        recommendations: rec.result || "No recommendations available",
        itinerary: it.result || "No itinerary available",
        budget: bud.result || "No budget information available",
      });
      setShowResults(true);
    } catch (error) {
      console.error("Error generating plan:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate travel plan. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_40%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-4 py-2 text-sm font-semibold text-brand-300 border border-brand-500/30 mb-4">
              <Sparkles size={16} />
              AI-Powered Travel Planning
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Your Personal Travel Planner
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Let our AI create a perfect itinerary tailored just for you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-8 lg:grid-cols-[300px_1fr]"
          >
            {/* Progress Sidebar */}
            <aside className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 h-fit sticky top-20">
              <h3 className="text-lg font-semibold text-white mb-6">Plan Your Trip</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      step === s
                        ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                        : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        step === s
                          ? "bg-brand-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {s}
                    </span>
                    {
                      [
                        "Destination",
                        "Budget",
                        "Travel Type",
                        "Season",
                        "Interests",
                        "Duration",
                      ][s - 1]
                    }
                  </button>
                ))}
              </div>
              <button
                onClick={generatePlan}
                disabled={!formData.destination || !formData.budget || !formData.travelType || !formData.season || formData.selectedInterests.length === 0 || !formData.days || loading}
                className="mt-8 w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-500"
              >
                {loading ? (
                  <>
                    <Loader className="inline mr-2 animate-spin" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="inline mr-2" size={16} />
                    Generate Plan
                  </>
                )}
              </button>
            </aside>

            {/* Main Form Area */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        Where would you like to go?
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({ ...formData, destination: e.target.value })
                        }
                        placeholder="e.g., Paris, Thailand, Japan..."
                        className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-400">
                      <p>💡 Tip: Be specific! "Paris in Spring" is better than just "Paris"</p>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        What's your budget?
                      </label>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {["$500-1000", "$1000-2500", "$2500-5000", "$5000-10000", "$10000+"].map(
                          (b) => (
                            <button
                              key={b}
                              onClick={() => setFormData({ ...formData, budget: b })}
                              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                formData.budget === b
                                  ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                                  : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                              }`}
                            >
                              {b}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        What's your travel style?
                      </label>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {travelTypes.map((t) => (
                          <button
                            key={t}
                            onClick={() => setFormData({ ...formData, travelType: t })}
                            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                              formData.travelType === t
                                ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                                : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        When do you want to travel?
                      </label>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {seasons.map((s) => (
                          <button
                            key={s}
                            onClick={() => setFormData({ ...formData, season: s })}
                            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                              formData.season === s
                                ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                                : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        What are you interested in? (Select at least 1)
                      </label>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {interests.map((i) => (
                          <button
                            key={i}
                            onClick={() => handleInterestToggle(i)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                              formData.selectedInterests.includes(i)
                                ? "border border-brand-500 bg-brand-600/20 text-brand-200"
                                : "border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-slate-400">
                        Selected: {formData.selectedInterests.length} interest
                        {formData.selectedInterests.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-sm uppercase tracking-[0.3em] text-slate-400">
                        How many days?
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={formData.days}
                        onChange={(e) =>
                          setFormData({ ...formData, days: e.target.value })
                        }
                        placeholder="e.g., 5, 10, 14..."
                        className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-brand-500 focus:outline-none"
                      />
                      <p className="mt-3 text-sm text-slate-400">
                        A {formData.days}-day trip starting {formData.days && formData.days > 5 ? "is plenty to explore" : "is perfect for a quick getaway"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  onClick={() => setStep(Math.min(6, step + 1))}
                  disabled={!isStepValid() || step === 6}
                  className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-500"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Results View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Travel Plan is Ready!</h2>
                <p className="mt-2 text-slate-400">
                  {formData.days} days in {formData.destination} • {formData.budget} • {formData.travelType}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowResults(false);
                  setStep(1);
                }}
                className="rounded-full border border-slate-700 bg-slate-950/80 px-6 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600"
              >
                Create New Plan
              </button>
            </div>

            {/* Results Tabs */}
            <div className="grid gap-6">
              {/* Recommendations */}
              {results.recommendations && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <MapPin className="text-brand-400" size={28} />
                      AI Recommendations
                    </h3>
                    <button
                      onClick={() => copyToClipboard(results.recommendations || "")}
                      className="rounded-full border border-slate-700 bg-slate-950/80 p-3 text-slate-400 transition hover:text-white"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {results.recommendations}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {results.itinerary && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Calendar className="text-brand-400" size={28} />
                      Detailed Itinerary
                    </h3>
                    <button
                      onClick={() => copyToClipboard(results.itinerary || "")}
                      className="rounded-full border border-slate-700 bg-slate-950/80 p-3 text-slate-400 transition hover:text-white"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {results.itinerary}
                  </div>
                </div>
              )}

              {/* Budget */}
              {results.budget && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <DollarSign className="text-brand-400" size={28} />
                      Budget Breakdown
                    </h3>
                    <button
                      onClick={() => copyToClipboard(results.budget || "")}
                      className="rounded-full border border-slate-700 bg-slate-950/80 p-3 text-slate-400 transition hover:text-white"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {results.budget}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-500"
              >
                <Sparkles size={18} />
                Browse Matching Packages
              </Link>
              <button
                onClick={() => {
                  setShowResults(false);
                  setStep(1);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-center font-semibold text-slate-300 transition hover:border-slate-600"
              >
                <Sparkles size={18} />
                Create Another Plan
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

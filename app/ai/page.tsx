"use client";

import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import { Brain, Sparkles, Menu } from "lucide-react";
import { toast } from "sonner";

interface RecommendationResponse {
    summary: string;
    recommendations: string[];
}

export default function AIPage() {
    const [summary, setSummary] = useState("");
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        loadInsights();
    }, []);

    async function loadInsights() {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ai/recommendations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load AI insights");
            }

            const data: RecommendationResponse =
                await response.json();

            setSummary(data.summary);
            setRecommendations(data.recommendations);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load AI insights.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-dvh bg-slate-950">

            <Dashboard
                mobileOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />

          <main className="min-w-0 flex-1 overflow-y-auto hide-scrollbar px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="mx-auto max-w-5xl">

                    {/* MOBILE TOP BAR */}

                    <div className="mb-4 flex items-center justify-between lg:hidden">

                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:border-slate-700 hover:text-emerald-400"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>

                        <span className="text-sm font-semibold text-emerald-400">
                            AI Insights
                        </span>

                        <div className="w-[41px]" />

                    </div>

                    <div className="mb-8 sm:mb-10">

                        <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:gap-3 sm:text-4xl">
                            <Brain className="shrink-0 text-emerald-400" />
                            AI Music Insights
                        </h1>

                        <p className="mt-3 text-sm text-slate-400 sm:text-base">
                            AI analyzes your music library and discovers
                            patterns in your listening habits.
                        </p>

                    </div>

                    {loading ? (

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400 sm:p-10">
                            Analyzing your music library...
                        </div>

                    ) : (

                        <div className="space-y-6 sm:space-y-8">

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-8">

                                <div className="mb-5 flex items-center gap-2">

                                    <Sparkles className="shrink-0 text-emerald-400" />

                                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                                        Your Music Personality
                                    </h2>

                                </div>

                                <p className="leading-7 text-slate-300 sm:leading-8">
                                    {summary}
                                </p>

                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-8">

                                <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
                                    Recommended Artists
                                </h2>

                                {recommendations.length === 0 ? (

                                    <p className="text-slate-400">
                                        No recommendations available.
                                    </p>

                                ) : (

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        {recommendations.map((artist) => (

                                            <div
                                                key={artist}
                                                className="rounded-lg border border-slate-700 bg-slate-800 p-5 transition hover:border-emerald-500"
                                            >
                                                <p className="text-lg font-semibold text-white">
                                                    {artist}
                                                </p>
                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}
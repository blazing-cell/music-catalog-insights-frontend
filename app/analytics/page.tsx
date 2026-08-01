"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Dashboard from "@/app/components/dashboard";
import { Menu } from "lucide-react";

interface LibrarySong {
    id: number;
    song: {
        id: number;
        trackId: number;
        trackName: string;
        artistName: string;
        collectionName: string;
        artworkUrl: string;
        previewUrl: string;
        genre: string | null;
        releaseYear: number | null;
        primaryGenreName: string | null;
    };
}

// =========================
// SITE PALETTE
// =========================

const ACCENT = [
    "#10b981",
    "#34d399",
    "#6ee7b7",
    "#059669",
    "#047857",
    "#475569",
];

const AXIS_STYLE = {
    fontSize: 11,
    fill: "#94a3b8",
};

const tooltipStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    fontSize: 12,
    color: "#e2e8f0",
};

// =========================
// STAT CARD
// =========================

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
            <p className="text-sm text-slate-400">
                {label}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
                {value}
            </h2>
        </div>
    );
}

// =========================
// CHART CARD
// =========================

function ChartCard({
    title,
    children,
    isEmpty,
    emptyMessage,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    isEmpty: boolean;
    emptyMessage: string;
    className?: string;
}) {
    return (
        <div
            className={`rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg ${className}`}
        >
            <h2 className="mb-3 text-sm font-semibold text-white">
                {title}
            </h2>

            {isEmpty ? (
                <p className="py-8 text-center text-sm text-slate-500">
                    {emptyMessage}
                </p>
            ) : (
                <div className="h-44">
                    {children}
                </div>
            )}
        </div>
    );
}

// =========================
// ANALYTICS PAGE
// =========================

export default function Analytics() {
    const [librarySongs, setLibrarySongs] =
        useState<LibrarySong[]>([]);

    const [mobileNavOpen, setMobileNavOpen] =
        useState(false);

    // =========================
    // FETCH USER LIBRARY SONGS
    // =========================

    useEffect(() => {
        const fetchLibrarySongs = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    console.error(
                        "No authentication token found"
                    );

                    return;
                }

                const response =
                    await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/librarysongs/user`,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json",
                            },
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch library songs: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                setLibrarySongs(data);
            } catch (error) {
                console.error(
                    "Error fetching library songs:",
                    error
                );
            }
        };

        fetchLibrarySongs();
    }, []);

    // =========================
    // SONGS BY ARTIST
    // =========================

    const artistCounts: Record<
        string,
        number
    > = {};

    librarySongs.forEach(
        (librarySong) => {
            const artist =
                librarySong.song.artistName ||
                "Unknown Artist";

            artistCounts[artist] =
                (artistCounts[artist] || 0) + 1;
        }
    );

    const artistData = Object.entries(
        artistCounts
    )
        .map(
            ([artist, songs]) => ({
                artist,
                songs,
            })
        )
        .sort(
            (a, b) =>
                b.songs - a.songs
        );

    // =========================
    // TOP 10 ARTISTS
    // =========================

    const topArtists = artistData
        .slice(0, 10)
        .slice()
        .reverse();

    // =========================
    // GENRE DISTRIBUTION
    // =========================

    const genreCounts: Record<
        string,
        number
    > = {};

    librarySongs.forEach(
        (librarySong) => {
            const genre =
                librarySong.song.primaryGenreName ||
                librarySong.song.genre ||
                "Unknown";

            genreCounts[genre] =
                (genreCounts[genre] || 0) + 1;
        }
    );

    const genreData = Object.entries(
        genreCounts
    )
        .map(
            ([genre, songs]) => ({
                genre,
                songs,
            })
        )
        .sort(
            (a, b) =>
                b.songs - a.songs
        );

    // =========================
    // RELEASES BY YEAR
    // =========================

    const releaseYearCounts: Record<
        number,
        number
    > = {};

    librarySongs.forEach(
        (librarySong) => {
            const year =
                librarySong.song.releaseYear;

            if (year !== null) {
                releaseYearCounts[year] =
                    (releaseYearCounts[year] || 0) +
                    1;
            }
        }
    );

    const releasesByYearData =
        Object.entries(
            releaseYearCounts
        )
            .map(
                ([year, songs]) => ({
                    year: Number(year),
                    songs,
                })
            )
            .sort(
                (a, b) =>
                    a.year - b.year
            );

    // =========================
    // ARTIST SONG DISTRIBUTION
    // =========================

    const artistSongFrequency: Record<
        number,
        number
    > = {};

    Object.values(
        artistCounts
    ).forEach(
        (songCount) => {
            artistSongFrequency[
                songCount
            ] =
                (artistSongFrequency[
                    songCount
                ] || 0) + 1;
        }
    );

    const histogramData =
        Object.entries(
            artistSongFrequency
        )
            .map(
                ([
                    songsPerArtist,
                    numberOfArtists,
                ]) => ({
                    songsPerArtist:
                        Number(
                            songsPerArtist
                        ),

                    numberOfArtists,
                })
            )
            .sort(
                (a, b) =>
                    a.songsPerArtist -
                    b.songsPerArtist
            );

    // =========================
    // ALBUM DISTRIBUTION
    // =========================

    const collectionCounts: Record<
        string,
        number
    > = {};

    librarySongs.forEach(
        (librarySong) => {
            const collection =
                librarySong.song
                    .collectionName ||
                "Unknown Album";

            collectionCounts[
                collection
            ] =
                (collectionCounts[
                    collection
                ] || 0) + 1;
        }
    );

    const collectionData =
        Object.entries(
            collectionCounts
        )
            .map(
                ([collection, songs]) => ({
                    collection,
                    songs,
                })
            )
            .sort(
                (a, b) =>
                    b.songs - a.songs
            );

    // =========================
    // SUMMARY
    // =========================

    const totalSongs =
        librarySongs.length;

    const totalArtists =
        Object.keys(
            artistCounts
        ).length;

    const totalCollections =
        Object.keys(
            collectionCounts
        ).length;

    // =========================
    // RENDER
    // =========================

   return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-950 text-white">

        <Dashboard
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
        />

        <main
            className="
                min-h-0
                min-w-0
                flex-1
                overflow-y-auto
                px-4
                py-6
                sm:px-6
                sm:py-8
                lg:px-10
            "
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >

            <div className="mx-auto max-w-6xl">

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
                        Analytics
                    </span>

                    <div className="w-[41px]" />

                </div>

                <h1 className="mb-6 hidden text-3xl font-bold tracking-tight lg:block">
                    Music Analytics
                </h1>


                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <StatCard
                        label="Total songs"
                        value={totalSongs}
                    />

                    <StatCard
                        label="Total artists"
                        value={totalArtists}
                    />

                    <StatCard
                        label="Total albums"
                        value={totalCollections}
                    />

                </div>


                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

                    <ChartCard
                        title="Songs By Artist"
                        isEmpty={artistData.length === 0}
                        emptyMessage="No artist data available"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topArtists}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="artist"
                                    tick={AXIS_STYLE}
                                />
                                <YAxis
                                    tick={AXIS_STYLE}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                />
                                <Bar dataKey="songs">
                                    {
                                        topArtists.map(
                                            (_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        ACCENT[
                                                            index %
                                                            ACCENT.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>


                    <ChartCard
                        title="Genre Distribution"
                        isEmpty={genreData.length === 0}
                        emptyMessage="No genre data available"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>

                                <Pie
                                    data={genreData}
                                    dataKey="songs"
                                    nameKey="genre"
                                    outerRadius={60}
                                >
                                    {
                                        genreData.map(
                                            (_, index)=>(
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        ACCENT[
                                                            index %
                                                            ACCENT.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )
                                    }
                                </Pie>

                                <Tooltip
                                    contentStyle={tooltipStyle}
                                />

                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>


                    <ChartCard
                        title="Releases By Year"
                        isEmpty={releasesByYearData.length === 0}
                        emptyMessage="No release data available"
                    >

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={releasesByYearData}>

                                <CartesianGrid strokeDasharray="3 3"/>

                                <XAxis
                                    dataKey="year"
                                    tick={AXIS_STYLE}
                                />

                                <YAxis
                                    tick={AXIS_STYLE}
                                />

                                <Tooltip
                                    contentStyle={tooltipStyle}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="songs"
                                    stroke="#10b981"
                                />

                            </LineChart>

                        </ResponsiveContainer>
                        

                    </ChartCard>
<ChartCard
    title="Artist Song Distribution"
    isEmpty={histogramData.length === 0}
    emptyMessage="No artist frequency data available"
>
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogramData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
                dataKey="songsPerArtist"
                tick={AXIS_STYLE}
                label={{
                    value: "Songs per artist",
                    position: "insideBottom",
                    offset: -5,
                }}
            />

            <YAxis
                tick={AXIS_STYLE}
            />

            <Tooltip
                contentStyle={tooltipStyle}
            />

            <Bar
                dataKey="numberOfArtists"
            >
                {
                    histogramData.map(
                        (_, index) => (
                            <Cell
                                key={index}
                                fill={
                                    ACCENT[
                                        index %
                                        ACCENT.length
                                    ]
                                }
                            />
                        )
                    )
                }
            </Bar>

        </BarChart>
    </ResponsiveContainer>
</ChartCard>

                </div>

            </div>

        </main>

    </div>
);
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
    Menu,
    Music2,
    Pause,
    Play,
    Search,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Dashboard from "@/app/components/dashboard";

type SortOption = "recent" | "title" | "artist";

interface Song {
    id: number;
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl: string;
    previewUrl: string;
    trackTimeMillis?: number;
    releaseYear?: number | null;
    primaryGenreName?: string | null;
}

interface Library {
    id: number;
    name: string;
}

interface LibrarySong {
    id: number;
    library: Library;
    song: Song;
}

// =========================
// HELPERS
// =========================

function formatDuration(ms?: number): string | null {
    if (!ms) {
        return null;
    }

    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function LibrarySongsPage() {
    const params = useParams();
    const libraryId = params.id as string;

    const [songs, setSongs] = useState<LibrarySong[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [playingSongId, setPlayingSongId] = useState<number | null>(null);

    // =========================
    // MOBILE SIDEBAR
    // =========================

    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // =========================
    // FETCH LIBRARY SONGS
    // =========================

    async function fetchLibrarySongs(id: string) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in");
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/librarysongs/library/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch library songs: ${response.status}`
                );
            }

            const data: LibrarySong[] = await response.json();

            setSongs(data);
        } catch (error) {
            console.error(
                "Error fetching library songs:",
                error
            );

            toast.error(
                "Failed to load library songs"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // PLAY / PAUSE SONG
    // =========================

    function togglePlay(
        songId: number,
        previewUrl: string
    ) {
        if (
            playingSongId === songId &&
            audioRef.current
        ) {
            audioRef.current.pause();
            audioRef.current = null;
            setPlayingSongId(null);

            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(previewUrl);

        audioRef.current = audio;

        setPlayingSongId(songId);

        audio.play().catch((error) => {
            console.error(
                "Error playing preview:",
                error
            );

            setPlayingSongId(null);
            audioRef.current = null;

            toast.error(
                "Unable to play song preview"
            );
        });

        audio.onended = () => {
            setPlayingSongId(null);
            audioRef.current = null;
        };
    }

    // =========================
    // DELETE LIBRARY SONG
    // =========================

    async function deleteLibrarySong(
        librarySongId: number
    ) {
        const token =
            localStorage.getItem("token");

        if (!token) {
            toast.error(
                "You are not logged in"
            );

            return;
        }

        // Stop currently playing song
        if (
            playingSongId ===
            librarySongId
        ) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            setPlayingSongId(null);
        }

        try {
            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/librarysongs/${librarySongId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Failed to delete song: ${response.status}`
                );
            }

            setSongs((current) =>
                current.filter(
                    (song) =>
                        song.id !==
                        librarySongId
                )
            );

            toast.success(
                "Song removed from library"
            );
        } catch (error) {
            console.error(
                "Error deleting library song:",
                error
            );

            toast.error(
                "Failed to remove song from library"
            );
        }
    }

    // =========================
    // EFFECTS
    // =========================

    useEffect(() => {
        if (libraryId) {
            fetchLibrarySongs(
                libraryId
            );
        }
    }, [libraryId]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // =========================
    // SEARCH + SORT
    // =========================

    const visibleSongs =
        useMemo(() => {
            const q =
                query
                    .trim()
                    .toLowerCase();

            const filtered = q
                ? songs.filter(
                      (librarySong) =>
                          librarySong.song.trackName
                              .toLowerCase()
                              .includes(q) ||
                          librarySong.song.artistName
                              .toLowerCase()
                              .includes(q) ||
                          librarySong.song.collectionName
                              .toLowerCase()
                              .includes(q) ||
                          librarySong.song
                              .primaryGenreName
                              ?.toLowerCase()
                              .includes(q)
                  )
                : songs;

            const sorted =
                [...filtered];

            if (
                sortBy === "title"
            ) {
                sorted.sort(
                    (a, b) =>
                        a.song.trackName.localeCompare(
                            b.song.trackName
                        )
                );
            } else if (
                sortBy === "artist"
            ) {
                sorted.sort(
                    (a, b) =>
                        a.song.artistName.localeCompare(
                            b.song.artistName
                        )
                );
            } else {
                sorted.sort(
                    (a, b) =>
                        b.id - a.id
                );
            }

            return sorted;
        }, [
            songs,
            query,
            sortBy,
        ]);

    // =========================
    // LIBRARY NAME
    // =========================

    const libraryName =
        songs.length > 0
            ? songs[0].library.name
            : `Library ${libraryId}`;

    // =========================
    // RENDER
    // =========================

    return (
        <div className="
            flex
            h-dvh
            overflow-hidden
            bg-slate-950
            text-white
        ">

            {/* =========================
                SIDEBAR / DASHBOARD
                Slide-in drawer below lg, static
                side column from lg up (handled
                inside the Dashboard component).
                Rendered unconditionally so the
                mobile drawer can actually open.
            ========================= */}

            <Dashboard
                mobileOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />

            {/* =========================
                MAIN CONTENT
                ONLY THIS SIDE SCROLLS
            ========================= */}

            <main className="
                min-w-0
                flex-1
                overflow-y-auto
                px-4
                py-6
                sm:px-6
                sm:py-8
                lg:px-10
                [&::-webkit-scrollbar]:hidden
                [scrollbar-width:none]
                [-ms-overflow-style:none]
            ">

                <div className="
                    mx-auto
                    max-w-6xl
                ">

                    {/* MOBILE TOP BAR */}

                    <div className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        lg:hidden
                    ">

                        <button
                            onClick={() =>
                                setMobileNavOpen(true)
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-slate-800
                                bg-slate-900
                                p-2.5
                                text-slate-300
                                transition
                                hover:border-slate-700
                                hover:text-emerald-400
                            "
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>

                        <span className="
                            text-sm
                            font-semibold
                            text-emerald-400
                        ">
                            Library
                        </span>

                        <div className="w-[41px]" />

                    </div>

                    {/* HEADER */}

                    <div className="
                        mb-8
                        flex
                        flex-col
                        gap-1
                    ">

                        <div className="
                            hidden
                            items-center
                            gap-2
                            text-emerald-400
                            lg:flex
                        ">

                            <Music2
                                size={18}
                            />

                            <span className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-widest
                            ">
                                Library
                            </span>

                        </div>

                        <h1 className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-white
                            sm:text-3xl
                            lg:text-4xl
                        ">
                            {libraryName}
                        </h1>

                        <p className="
                            text-sm
                            text-slate-500
                        ">
                            {loading
                                ? "Loading your saved songs..."
                                : `${songs.length} song${
                                      songs.length === 1
                                          ? ""
                                          : "s"
                                  } saved`}
                        </p>

                    </div>


                    {/* SEARCH + SORT */}

                    {!loading &&
                        songs.length > 0 && (

                        <div className="
                            mb-5
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <div className="
                                relative
                                flex-1
                                sm:max-w-xs
                            ">

                                <Search
                                    size={16}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-500
                                    "
                                />

                                <input
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(
                                            e.target.value
                                        )
                                    }
                                    placeholder="
                                        Search songs, artists, albums...
                                    "
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-800
                                        bg-slate-900
                                        py-2
                                        pl-9
                                        pr-3
                                        text-sm
                                        text-white
                                        placeholder:text-slate-500
                                        outline-none
                                        focus:border-emerald-500/60
                                    "
                                />

                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value as SortOption
                                    )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-800
                                    bg-slate-900
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-300
                                    outline-none
                                    focus:border-emerald-500/60
                                "
                            >

                                <option value="recent">
                                    Recently added
                                </option>

                                <option value="title">
                                    Title A-Z
                                </option>

                                <option value="artist">
                                    Artist A-Z
                                </option>

                            </select>

                        </div>
                    )}


                    {/* LOADING */}

                    {loading && (
                        <div className="
                            space-y-3
                        ">

                            {Array.from({
                                length: 5,
                            }).map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="
                                            h-[72px]
                                            animate-pulse
                                            rounded-xl
                                            border
                                            border-slate-800
                                            bg-slate-900/60
                                        "
                                    />
                                )
                            )}

                        </div>
                    )}


                    {/* EMPTY */}

                    {!loading &&
                        songs.length === 0 && (

                        <div className="
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-800
                            py-20
                            text-center
                        ">

                            <Music2
                                size={28}
                                className="
                                    mx-auto
                                    mb-3
                                    text-slate-700
                                "
                            />

                            <p className="
                                text-slate-400
                            ">
                                No songs in this library yet.
                            </p>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-600
                            ">
                                Songs you save will show up here.
                            </p>

                        </div>
                    )}


                    {/* NO SEARCH RESULTS */}

                    {!loading &&
                        songs.length > 0 &&
                        visibleSongs.length === 0 && (

                        <div className="
                            rounded-2xl
                            border
                            border-dashed
                            border-slate-800
                            py-16
                            text-center
                            text-slate-500
                        ">
                            No songs match &ldquo;
                            {query}
                            &rdquo;
                        </div>
                    )}


                    {/* SONG LIST */}

                    {!loading &&
                        visibleSongs.length > 0 && (

                        <div className="
                            space-y-2.5
                        ">

                            {visibleSongs.map(
                                (librarySong) => {

                                    const isPlaying =
                                        playingSongId ===
                                        librarySong.id;

                                    const duration =
                                        formatDuration(
                                            librarySong.song
                                                .trackTimeMillis
                                        );

                                    return (
                                        <div
                                            key={
                                                librarySong.id
                                            }
                                            className={`
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                p-3
                                                transition
                                                sm:gap-4
                                                ${
                                                    isPlaying
                                                        ? "border-emerald-500/50 bg-emerald-500/[0.04]"
                                                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                                                }
                                            `}
                                        >

                                            {/* ARTWORK */}

                                            <div className="
                                                relative
                                                shrink-0
                                            ">

                                                <img
                                                    src={
                                                        librarySong
                                                            .song
                                                            .artworkUrl
                                                    }
                                                    alt={
                                                        librarySong
                                                            .song
                                                            .trackName
                                                    }
                                                    className="
                                                        h-12
                                                        w-12
                                                        rounded-lg
                                                        object-cover
                                                        sm:h-14
                                                        sm:w-14
                                                    "
                                                />

                                                {isPlaying && (
                                                    <span className="
                                                        absolute
                                                        -right-1
                                                        -top-1
                                                        flex
                                                        h-3
                                                        w-3
                                                    ">

                                                        <span className="
                                                            absolute
                                                            inline-flex
                                                            h-full
                                                            w-full
                                                            animate-ping
                                                            rounded-full
                                                            bg-emerald-400
                                                            opacity-75
                                                        "/>

                                                        <span className="
                                                            relative
                                                            inline-flex
                                                            h-3
                                                            w-3
                                                            rounded-full
                                                            bg-emerald-500
                                                        "/>

                                                    </span>
                                                )}

                                            </div>


                                            {/* DETAILS */}

                                            <div className="
                                                min-w-0
                                                flex-1
                                            ">

                                                <h2 className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                ">
                                                    {
                                                        librarySong
                                                            .song
                                                            .trackName
                                                    }
                                                </h2>

                                                <p className="
                                                    truncate
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    {
                                                        librarySong
                                                            .song
                                                            .artistName
                                                    }
                                                </p>

                                                <p className="
                                                    hidden
                                                    truncate
                                                    text-xs
                                                    text-slate-600
                                                    sm:block
                                                ">
                                                    {
                                                        librarySong
                                                            .song
                                                            .collectionName
                                                    }
                                                </p>

                                                {librarySong
                                                    .song
                                                    .primaryGenreName && (

                                                    <p className="
                                                        hidden
                                                        truncate
                                                        text-xs
                                                        text-emerald-500/70
                                                        sm:block
                                                    ">
                                                        {
                                                            librarySong
                                                                .song
                                                                .primaryGenreName
                                                        }
                                                    </p>

                                                )}

                                            </div>


                                            {/* DURATION */}

                                            {duration && (
                                                <span className="
                                                    hidden
                                                    shrink-0
                                                    text-xs
                                                    tabular-nums
                                                    text-slate-500
                                                    sm:block
                                                ">
                                                    {duration}
                                                </span>
                                            )}


                                            {/* ACTIONS */}

                                            <div className="
                                                flex
                                                shrink-0
                                                items-center
                                                gap-2
                                            ">

                                                {librarySong
                                                    .song
                                                    .previewUrl && (

                                                    <button
                                                        onClick={() =>
                                                            togglePlay(
                                                                librarySong.id,
                                                                librarySong
                                                                    .song
                                                                    .previewUrl
                                                            )
                                                        }
                                                        title={
                                                            isPlaying
                                                                ? "Pause preview"
                                                                : "Play preview"
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-emerald-500
                                                            text-white
                                                            transition
                                                            hover:bg-emerald-600
                                                        "
                                                    >

                                                        {isPlaying ? (
                                                            <Pause
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <Play
                                                                size={16}
                                                            />
                                                        )}

                                                    </button>

                                                )}

                                                <button
                                                    onClick={() =>
                                                        deleteLibrarySong(
                                                            librarySong.id
                                                        )
                                                    }
                                                    title="
                                                        Remove from library
                                                    "
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-slate-800
                                                        text-slate-500
                                                        opacity-100
                                                        transition
                                                        hover:border-red-500/40
                                                        hover:bg-red-500/10
                                                        hover:text-red-400
                                                        sm:opacity-0
                                                        sm:group-hover:opacity-100
                                                    "
                                                >

                                                    <Trash2
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}
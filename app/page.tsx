"use client";

import { useEffect, useRef, useState } from "react";
import Dashboard from "./components/dashboard";
import { Pause, Play, X, Menu } from "lucide-react";
import { toast } from "sonner";

interface Song {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string;
    releaseYear: number | null;
    primaryGenreName: string;
}

interface Library {
    id: number;
    name: string;
}

interface RecommendationResponse {
    summary: string;
    recommendations: string[];
}

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // =========================
    // MOBILE SIDEBAR
    // =========================

    const [mobileNavOpen, setMobileNavOpen] =
        useState(false);

    // =========================
    // AI RECOMMENDATIONS
    // =========================

    const [recommendations, setRecommendations] =
        useState<Song[]>([]);
const showRecommendations =
    searchTerm.trim() === "" && songs.length === 0;
    const [recommendationSummary, setRecommendationSummary] =
        useState("");

    const [recommendationLoading, setRecommendationLoading] =
        useState(false);

    // =========================
    // LIBRARIES
    // =========================

    const [libraries, setLibraries] =
        useState<Library[]>([]);

    // =========================
    // SELECTED SONG
    // =========================

    const [selectedSong, setSelectedSong] =
        useState<Song | null>(null);

    // =========================
    // MODAL
    // =========================

    const [showLibraryModal, setShowLibraryModal] =
        useState(false);

    // =========================
    // ADDING SONG
    // =========================

    const [addingSong, setAddingSong] =
        useState(false);

    // =========================
    // CURRENTLY PLAYING
    // =========================

    const [playingSongId, setPlayingSongId] =
        useState<number | null>(null);

    // =========================
    // AUDIO REFERENCE
    // =========================

    const audioRef =
        useRef<HTMLAudioElement | null>(null);

    // =========================
    // SEARCH SONGS
    // =========================

 async function searchSongs(query?: string) {

    const term =
        query ?? searchTerm;


    if (!term.trim()) {
            toast.error("Please enter a song or artist");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/songs/search?term=${encodeURIComponent(
    term.trim()
)}`
            );

            if (!response.ok) {
                throw new Error("Failed to search songs");
            }

            const data = await response.json();

            setSongs(
                Array.isArray(data.results)
                    ? data.results
                    : []
            );
            console.log("Search results:", data.results);
        } catch (error) {
            console.error(
                "Error searching songs:",
                error
            );

            toast.error(
                "Failed to search songs"
            );
        } finally {
            setLoading(false);
        }
    }

   // =========================
// LOAD AI RECOMMENDATIONS
// =========================

async function loadRecommendations() {

    const token = localStorage.getItem("token");
    document.cookie =`token=${token}; path=/; max-age=86400`;

    if (!token) {

        console.log("No JWT token found.");

        return;
    }

    setRecommendationLoading(true);

    try {

        const aiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/ai/recommendations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (aiResponse.status === 401) {

            toast.error("Session expired. Please login again.");

            return;
        }

        if (aiResponse.status === 403) {

            toast.error("You are not authorized.");

            return;
        }

        if (!aiResponse.ok) {

            throw new Error("Failed to load recommendations");
        }

        const aiData: RecommendationResponse =
            await aiResponse.json();

        setRecommendationSummary(
            aiData.summary ?? ""
        );

        const recommendedArtists =
            Array.isArray(aiData.recommendations)
                ? aiData.recommendations
                : [];

        if (recommendedArtists.length === 0) {

            setRecommendations([]);

            return;
        }

        const searchResults: Song[] = [];

        for (const artist of recommendedArtists) {

            try {

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/songs/search?term=${encodeURIComponent(
                        artist
                    )}`
                );

                if (!response.ok) continue;

                const data = await response.json();

                if (Array.isArray(data.results)) {

                    searchResults.push(
                        ...data.results.slice(0, 2)
                    );
                }

            } catch (error) {

                console.error(error);

            }
        }

        const uniqueSongs = Array.from(
            new Map(
                searchResults.map(song => [
                    song.trackId,
                    song,
                ])
            ).values()
        );

        setRecommendations(
            uniqueSongs.slice(0, 10)
        );

    } catch (error) {

        console.error(
            "Recommendation Error:",
            error
        );

        toast.error(
            "Failed to load recommendations."
        );

    } finally {

        setRecommendationLoading(false);

    }
}

    // =========================
    // PLAY / PAUSE PREVIEW
    // =========================

    function togglePlay(
        songId: number,
        previewUrl: string
    ) {
        // Stop currently playing song
        // if same song is clicked

        if (
            playingSongId === songId &&
            audioRef.current
        ) {
            audioRef.current.pause();

            audioRef.current = null;

            setPlayingSongId(null);

            return;
        }

        // Stop previous audio

        if (audioRef.current) {
            audioRef.current.pause();

            audioRef.current = null;
        }

        // Create audio

        const audio =
            new Audio(previewUrl);

        audioRef.current =
            audio;

        // Set currently playing

        setPlayingSongId(
            songId
        );

        // Play

        audio
            .play()
            .catch((error) => {
                console.error(
                    "Error playing preview:",
                    error
                );

                setPlayingSongId(
                    null
                );

                audioRef.current =
                    null;

                toast.error(
                    "Unable to play song preview"
                );
            });

        // Reset when finished

        audio.onended = () => {
            setPlayingSongId(
                null
            );

            audioRef.current =
                null;
        };
    }

    // =========================
    // LOAD USER LIBRARIES
    // =========================

    async function loadLibraries() {
        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            toast.error(
                "You are not logged in"
            );

            return;
        }

        try {
            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/library/my`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Accept":
                                "application/json",
                        },
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to load libraries"
                );
            }

            const data =
                await response.json();

            setLibraries(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Error loading libraries:",
                error
            );

            toast.error(
                "Failed to load your libraries"
            );
        }
    }

    // =========================
    // OPEN LIBRARY SELECTION
    // =========================

    function openLibrarySelection(
        song: Song
    ) {
        setSelectedSong(
            song
        );

        loadLibraries();

        setShowLibraryModal(
            true
        );
    }

    // =========================
    // ADD SONG TO LIBRARY
    // =========================

    async function addSongToLibrary(
        libraryId: number
    ) {
        if (!selectedSong) {
            return;
        }

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            toast.error(
                "You are not logged in"
            );

            return;
        }

        setAddingSong(
            true
        );

        try {
            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/librarysongs/${libraryId}/songs`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`,

                            "Accept":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                trackId:
                                    selectedSong.trackId,

                                trackName:
                                    selectedSong.trackName,

                                artistName:
                                    selectedSong.artistName,

                                collectionName:
                                    selectedSong.collectionName,

                                artworkUrl100:
                                    selectedSong.artworkUrl100,

                                previewUrl:
                                    selectedSong.previewUrl,

                                releaseYear:
                                    selectedSong.releaseYear,

                                primaryGenreName:
                                    selectedSong.primaryGenreName,
                            }),
                    }
                );

            if (!response.ok) {
                const errorText =
                    await response.text();

                console.error(
                    "Backend error:",
                    errorText
                );

                throw new Error(
                    "Failed to add song"
                );
            }

            toast.success(
                `"${selectedSong.trackName}" added to library`
            );

            setShowLibraryModal(
                false
            );

            setSelectedSong(
                null
            );
        } catch (error) {
            console.error(
                "Error adding song:",
                error
            );

            toast.error(
                "Failed to add song to library"
            );
        } finally {
            setAddingSong(
                false
            );
        }
    }

    // =========================
    // LOAD RECOMMENDATIONS
    // WHEN PAGE OPENS
    // =========================

    useEffect(() => {
        loadRecommendations();
    }, []);

    // =========================
    // CLEANUP AUDIO
    // =========================

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();

                audioRef.current =
                    null;
            }
        };
    }, []);

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-slate-950">

            {/* =========================
                SIDEBAR / DASHBOARD
                Slide-in drawer below lg, static
                side column from lg up (handled
                inside the Dashboard component).
            ========================== */}

            <Dashboard
                mobileOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />

           <main className="min-w-0 flex-1 overflow-hidden overflow-y-auto" style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}>

                <div className="p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-5xl">

                        {/* MOBILE TOP BAR */}

                        <div className="mb-4 flex items-center justify-between lg:hidden">

                            <button
                                onClick={() =>
                                    setMobileNavOpen(true)
                                }
                                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition hover:border-slate-700 hover:text-emerald-400"
                                aria-label="Open menu"
                            >
                                <Menu size={20} />
                            </button>

                            <h1 className="text-lg font-bold text-emerald-400">
                                Music Library
                            </h1>

                            <div className="w-[41px]" />

                        </div>

                        {/* TITLE (desktop) */}

                        <h1 className="mb-6 hidden text-center text-2xl font-bold text-emerald-400 sm:mb-8 sm:text-3xl lg:block lg:text-4xl">
                            Music Library
                        </h1>

                        {/* SEARCH BAR */}

                        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row">

                            <input
                                type="text"
                                placeholder="Search for a song or artist..."
                                value={
                                    searchTerm
                                }
  onChange={(e) => {

    const value = e.target.value;

    setSearchTerm(value);


    if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
    }


    if (value.trim() === "") {

        setSongs([]);

        return;

    }


    searchTimeout.current = setTimeout(() => {

        searchSongs(value);

    }, 500);

}}
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        searchSongs();
                                    }
                                }}
                                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                            />

                            <button
                                 onClick={() => searchSongs()}
                                disabled={
                                    loading
                                }
                                className="w-full shrink-0 rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                            >
                                Search
                            </button>

                        </div>

                        {/* =========================
                            AI RECOMMENDATIONS
                        ========================== */}

                       {showRecommendations && (
<section className="mb-10 sm:mb-12">
                            <div className="mb-5">

                                <h2 className="text-xl font-bold text-white sm:text-2xl">
                                    Recommended For You
                                </h2>

                                {recommendationSummary && (
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                        {
                                            recommendationSummary
                                        }
                                    </p>
                                )}

                            </div>

                            {/* LOADING */}

                            {recommendationLoading && (
                                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-8">
                                    <p className="text-slate-400">
                                        Finding music you might like...
                                    </p>
                                </div>
                            )}

                            {/* NO RECOMMENDATIONS */}

                            {!recommendationLoading &&
                                recommendations.length === 0 && (
                                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-8">
                                        <p className="text-slate-400">
                                            Add more songs to your library to get personalized recommendations.
                                        </p>
                                    </div>
                                )}

                            {/* RECOMMENDATIONS */}

                            {!recommendationLoading &&
                                recommendations.length > 0 && (
                                    <div className="grid gap-4 sm:grid-cols-2">

                                        {recommendations.map(
                                            (song) => {

                                                const isPlaying =
                                                    playingSongId ===
                                                    song.trackId;

                                                return (
                                                    <div
                                                        key={
                                                            song.trackId
                                                        }
                                                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-lg transition hover:border-slate-700 sm:gap-4 sm:p-4"
                                                    >

                                                        {/* ARTWORK */}

                                                        <img
                                                            src={
                                                                song.artworkUrl100
                                                            }
                                                            alt={
                                                                song.trackName
                                                            }
                                                            className="h-14 w-14 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
                                                        />

                                                        {/* DETAILS */}

                                                        <div className="min-w-0 flex-1">

                                                            <h3 className="truncate font-semibold text-white">
                                                                {
                                                                    song.trackName
                                                                }
                                                            </h3>

                                                            <p className="truncate text-sm text-slate-400">
                                                                {
                                                                    song.artistName
                                                                }
                                                            </p>

                                                            <p className="truncate text-xs text-slate-500">
                                                                {
                                                                    song.collectionName
                                                                }
                                                            </p>

                                                        </div>

                                                        {/* ACTIONS */}

                                                        <div className="flex shrink-0 gap-2">

                                                            {song.previewUrl && (
                                                                <button
                                                                    onClick={() =>
                                                                        togglePlay(
                                                                            song.trackId,
                                                                            song.previewUrl
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-slate-700 p-2 text-white transition hover:bg-slate-600"
                                                                >
                                                                    {isPlaying ? (
                                                                        <Pause
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Play
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    openLibrarySelection(
                                                                        song
                                                                    )
                                                                }
                                                                className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                                                            >
                                                                Add
                                                            </button>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                        </section>
)}
                        {/* SEARCH LOADING */}

                        {loading && (
                            <p className="mb-5 text-center text-slate-400">
                                Searching...
                            </p>
                        )}

                        {/* SEARCH RESULTS TITLE */}

                        {songs.length > 0 && (
                            <h2 className="mb-5 text-xl font-bold text-white sm:text-2xl">
                                Search Results
                            </h2>
                        )}

                        {/* SEARCH RESULTS */}

                        <div className="space-y-4">

                            {songs.map(
                                (song) => {

                                    const isPlaying =
                                        playingSongId ===
                                        song.trackId;

                                    return (
                                        <div
                                            key={
                                                song.trackId
                                            }
                                            className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:flex-row sm:items-center"
                                        >

                                            {/* ARTWORK */}

                                            <img
                                                src={
                                                    song.artworkUrl100
                                                }
                                                alt={
                                                    song.trackName
                                                }
                                                className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                            />

                                            {/* DETAILS */}

                                            <div className="min-w-0 flex-1">

                                                <h2 className="truncate text-lg font-bold text-white">
                                                    {
                                                        song.trackName
                                                    }
                                                </h2>

                                                <p className="truncate text-slate-300">
                                                    {
                                                        song.artistName
                                                    }
                                                </p>

                                                <p className="truncate text-sm text-slate-500">
                                                    {
                                                        song.collectionName
                                                    }
                                                </p>

                                                {song.primaryGenreName && (
                                                    <p className="mt-1 text-xs text-emerald-400">
                                                        {
                                                            song.primaryGenreName
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            {/* ACTIONS */}

                                            <div className="flex shrink-0 items-center gap-2">

                                                {song.previewUrl ? (
                                                    <button
                                                        onClick={() =>
                                                            togglePlay(
                                                                song.trackId,
                                                                song.previewUrl
                                                            )
                                                        }
                                                        className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 font-medium text-white transition hover:bg-slate-600 sm:px-4"
                                                    >
                                                        {isPlaying ? (
                                                            <>
                                                                <Pause
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                                <span>
                                                                    Pause
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                                <span>
                                                                    Play
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-slate-500">
                                                        Preview unavailable
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        openLibrarySelection(
                                                            song
                                                        )
                                                    }
                                                    className="rounded-lg bg-emerald-500 px-3 py-2 font-medium text-white transition hover:bg-emerald-600 sm:px-4"
                                                >
                                                    Add
                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </div>

            </main>

            {/* =========================
                LIBRARY MODAL
            ========================== */}

            {showLibraryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">

                    <div className="relative flex max-h-[85vh] w-full max-w-[450px] flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6">

                        {/* CLOSE */}

                        <button
                            onClick={() => {
                                setShowLibraryModal(
                                    false
                                );

                                setSelectedSong(
                                    null
                                );
                            }}
                            className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
                        >
                            <X
                                size={22}
                            />
                        </button>

                        {/* TITLE */}

                        <h2 className="mb-2 pr-8 text-xl font-bold text-white sm:text-2xl">
                            Add to Library
                        </h2>

                        {/* SONG */}

                        {selectedSong && (
                            <p className="mb-6 text-sm text-slate-400">
                                Select a library for{" "}
                                <span className="font-semibold text-emerald-400">
                                    {
                                        selectedSong.trackName
                                    }
                                </span>
                            </p>
                        )}

                        {/* LIBRARIES */}

                        {libraries.length === 0 ? (
                            <p className="py-8 text-center text-slate-400">
                                You don't have any
                                libraries yet.
                            </p>
                        ) : (
                            <div className="space-y-3 overflow-y-auto">

                                {libraries.map(
                                    (library) => (
                                        <button
                                            key={
                                                library.id
                                            }
                                            onClick={() =>
                                                addSongToLibrary(
                                                    library.id
                                                )
                                            }
                                            disabled={
                                                addingSong
                                            }
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-4 text-left text-white transition hover:border-emerald-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <p className="font-semibold">
                                                {
                                                    library.name
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Click to add song
                                            </p>
                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}
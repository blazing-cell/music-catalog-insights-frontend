"use client";

import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import { Frown, Menu, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Library {
    id: number;
    name: string;
}

export default function LibraryPage() {
 const router = useRouter();
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [libraryName, setLibraryName] = useState("");

    // =========================
    // MOBILE SIDEBAR
    // =========================

    const [mobileNavOpen, setMobileNavOpen] =
        useState(false);

    // =========================
    // LOAD USER'S LIBRARIES
    // =========================

    async function loadLibraries() {

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in");
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/library/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load libraries");
            }

            const data = await response.json();

            setLibraries(data);

        } catch (error) {

            console.error("Error loading libraries:", error);

            toast.error("Failed to load your libraries");

        } finally {

            setLoading(false);

        }
    }


    // =========================
    // CREATE LIBRARY
    // =========================

    async function createLibrary() {

        if (!libraryName.trim()) {
            toast.error("Please enter a library name");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in");
            return;
        }

        try {

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/library`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name: libraryName.trim(),
                    }),
                }
            );

           if (!response.ok) {

    if(response.status === 401){

        localStorage.removeItem("token");

        toast.error(
            "Session expired. Please login again."
        );

        router.push("/login");

        return;

    }


    throw new Error(
        "Failed to load libraries"
    );

}

            // Clear input
            setLibraryName("");

            // Close modal
            setShowCreateModal(false);

            // Show success toast
            toast.success("Library created successfully!");

            // Reload libraries
            await loadLibraries();

        } catch (error) {

            console.error("Error creating library:", error);

            toast.error("Failed to create library");

        }
    }


    // =========================
    // DELETE LIBRARY
    // =========================

    async function deleteLibrary(id: number) {

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in");
            return;
        }

        try {

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/library/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete library");
            }

            // Remove deleted library from UI
            setLibraries((previousLibraries) =>
                previousLibraries.filter(
                    (library) => library.id !== id
                )
            );

            toast.success("Library deleted successfully");

        } catch (error) {

            console.error("Error deleting library:", error);

            toast.error("Failed to delete library");

        }
    }


    // =========================
    // CONFIRM DELETE
    // =========================

    function confirmDelete(id: number) {

        toast("Delete this library?", {
            description: "This action cannot be undone.",

            action: {
                label: "Delete",

                onClick: () => {
                    deleteLibrary(id);
                },
            },
        });
    }


    // =========================
    // LOAD LIBRARIES ON PAGE LOAD
    // =========================

    useEffect(() => {

        loadLibraries();

    }, []);


    return (

        <div className="flex h-dvh min-h-screen overflow-hidden bg-slate-950">

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

            {/* =========================
                MAIN CONTENT
            ========================== */}

            <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

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
                            My Library
                        </h1>

                        <div className="w-[41px]" />

                    </div>

                    {/* =========================
                        HEADER
                    ========================== */}

                    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">

                        <div className="hidden sm:block">

                            <h1 className="text-3xl font-bold text-emerald-400 lg:text-4xl">
                                My Library
                            </h1>

                            <p className="mt-2 text-slate-400">
                                Manage your personal music libraries
                            </p>

                        </div>

                        <p className="text-sm text-slate-400 sm:hidden">
                            Manage your personal music libraries
                        </p>


                        {/* CREATE LIBRARY BUTTON */}

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 sm:w-auto"
                        >

                            <Plus size={20} />

                            Create Library

                        </button>

                    </div>


                    {/* =========================
                        LOADING
                    ========================== */}

                    {loading && (

                        <div className="py-20 text-center">

                            <p className="text-slate-400">
                                Loading your libraries...
                            </p>

                        </div>

                    )}


                    {/* =========================
                        NO LIBRARIES
                    ========================== */}

                    {!loading && libraries.length === 0 && (

                        <div className="flex flex-col items-center justify-center py-20 text-center sm:py-32">

                            <Frown
                                size={50}
                                className="mb-4 text-slate-600"
                            />

                            <h2 className="text-xl font-semibold text-white">
                                No libraries yet
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Create your first music library to get started.
                            </p>

                        </div>

                    )}


                    {/* =========================
                        LIBRARY LIST
                    ========================== */}

                    {!loading && libraries.length > 0 && (

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {libraries.map((library) => (

                                <div
                                    key={library.id}
                                    className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500"
                                >

                                    {/* LIBRARY HEADER */}

                                    <div className="flex items-center justify-between gap-3">

                                        <h2 className="truncate text-xl font-bold text-white">
                                            {library.name}
                                        </h2>


                                        {/* DELETE BUTTON */}

                                        <button
                                            onClick={() =>
                                                confirmDelete(library.id)
                                            }
                                            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                            title="Delete library"
                                        >

                                            <Trash2 size={20} />

                                        </button>

                                    </div>


                                    <p className="mt-2 text-sm text-slate-400">
                                        Your personal music library
                                    </p>


                                    {/* OPEN LIBRARY BUTTON */}

                                    <button
                                    onClick={() =>router.push(`/library/${library.id}`)}
                                        className="mt-6 w-full rounded-lg bg-slate-800 py-2 text-sm font-medium text-emerald-400 transition hover:bg-slate-700"
                                    >

                                        Open Library

                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>


            {/* =========================
                CREATE LIBRARY MODAL
            ========================== */}

            {showCreateModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">

                    <div className="relative w-full max-w-[450px] rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6">

                        {/* CLOSE BUTTON */}

                        <button
                            onClick={() => {
                                setShowCreateModal(false);
                                setLibraryName("");
                            }}
                            className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
                        >

                            <X size={22} />

                        </button>


                        {/* TITLE */}

                        <h2 className="mb-2 pr-8 text-xl font-bold text-white sm:text-2xl">
                            Create Library
                        </h2>

                        <p className="mb-6 text-sm text-slate-400">
                            Give your new music library a name.
                        </p>


                        {/* INPUT */}

                        <input
                            type="text"
                            placeholder="e.g. My Favorites"
                            value={libraryName}
                            onChange={(e) =>
                                setLibraryName(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    createLibrary();
                                }

                            }}
                            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                        />


                        {/* BUTTONS */}

                        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

                            {/* CANCEL */}

                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setLibraryName("");
                                }}
                                className="rounded-lg bg-slate-700 px-5 py-2 text-white transition hover:bg-slate-600"
                            >

                                Cancel

                            </button>


                            {/* CREATE */}

                            <button
                                onClick={createLibrary}
                                className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-600"
                            >

                                Create

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}
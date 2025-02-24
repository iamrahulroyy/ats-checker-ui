"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload, History, Loader2 } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import dynamic from 'next/dynamic'
import type { ATSResponse } from "@/types/resume"

const ResumeList = dynamic(() => import('./ResumeList'), {
    loading: () => <div className="animate-pulse h-48 bg-slate-800/50 rounded-lg" />
})

const ResumeResults = dynamic(() => import('./ResumeResults'), {
    loading: () => <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-800/50 rounded w-1/4" />
        <div className="h-64 bg-slate-800/50 rounded" />
    </div>
})

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [atsResponse, setAtsResponse] = useState<ATSResponse | null>(null)
    const [showResults, setShowResults] = useState(true)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return
        setLoading(true)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload_resume/`, {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const data: ATSResponse = await response.json()
                setAtsResponse(data)
                setShowResults(true)
                toast({
                    title: "Success",
                    description: "Resume uploaded successfully",
                })
                setFile(null)
            } else {
                throw new Error("Upload failed")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to upload resume"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-zinc-100 p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#A78BFA] bg-clip-text text-transparent">
                        Resume Analysis
                    </h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 backdrop-blur-sm text-[#60A5FA] hover:text-[#93C5FD] h-14 px-6 text-base"
                            >
                                <History className="w-5 h-5 mr-3" />
                                Previous Uploads
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800">
                            <DialogTitle className="text-zinc-100">Previous Resume Uploads</DialogTitle>
                            <ResumeList />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-8 shadow-[0_0_50px_-12px] shadow-[#60A5FA]/20">
                    {/* Form section */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                                disabled={loading}
                                className="h-16 text-base bg-slate-800/50 border-slate-700/50 text-zinc-100 file:bg-gradient-to-r file:from-[#60A5FA] file:to-[#34D399] file:text-white file:border-0 file:rounded-lg file:px-6 file:py-4 file:h-full file:mr-6 hover:file:from-[#93C5FD] hover:file:to-[#6EE7B7] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!file || loading}
                            className="w-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] hover:from-[#93C5FD] hover:to-[#6EE7B7] text-white h-16 text-lg font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 mr-3" />
                                    Analyze Resume
                                </>
                            )}
                        </Button>
                    </form>

                    <AnimatePresence>
                        {atsResponse && showResults && (
                            <ResumeResults atsResponse={atsResponse} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
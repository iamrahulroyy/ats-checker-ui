"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload, History, Loader2, FileText } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import type { ATSResponse } from "@/types/resume"

const ResumeList = dynamic(() => import("@/components/ResumeList"), {
    loading: () => <div className="animate-pulse h-48 bg-white/[0.03] rounded-lg" />,
})

const ResumeResults = dynamic(() => import("@/components/ResumeResults"), {
    loading: () => (
        <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/[0.03] rounded w-1/4" />
            <div className="h-64 bg-white/[0.03] rounded" />
        </div>
    ),
})

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [atsResponse, setAtsResponse] = useState<ATSResponse | null>(null)
    const [showResults, setShowResults] = useState(true)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const [fileName, setFileName] = useState<string>("")

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()  // Add this to prevent event bubbling
        console.log("Form submission triggered")

        if (!file) {
            toast({
                title: "Error",
                description: "Please select a file first",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            // Updated URL format
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/`, {
                method: "POST",
                body: formData,
            })
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
    
            const data = await response.json()
            console.log("Response data:", data)
            
            setAtsResponse(data)
            setShowResults(true)
            toast({
                title: "Success",
                description: "Resume analyzed successfully",
            })
        } catch (error) {
            console.error("Upload failed:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to analyze resume",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl mx-auto space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold gradient-text">
                        Resume Analysis
                    </h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="glass-card hover:bg-white/[0.05] text-[#60A5FA] hover:text-[#38BDF8]"
                            >
                                <History className="w-4 h-4 mr-2" />
                                Previous Uploads
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0f172a] border-white/[0.05]">
                            <DialogTitle className="gradient-text">Previous Resume Uploads</DialogTitle>
                            <ResumeList />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="glass-card rounded-2xl p-12 gradient-border">
                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-12"
                    >
                        <div className="file-input-container">
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0]
                                    console.log("File selected:", selectedFile)
                                    setFile(selectedFile || null)
                                    setFileName(selectedFile?.name || "")
                                }}
                                required
                                disabled={loading}
                                className="glass-input"
                            />
                            {!fileName && (
                                <div className="file-placeholder">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Choose a PDF file to analyze
                                </div>
                            )}
                            {fileName && (
                                <div className="file-name-display">
                                    {fileName}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={!file || loading}
                            variant="default"
                            className="w-full bg-[#60A5FA] hover:bg-[#38BDF8] text-white h-14 
           text-base font-medium rounded-xl transition-all duration-200 
           disabled:opacity-50 disabled:cursor-not-allowed
           active:transform active:scale-95"
                            onClick={(e) => {
                                e.stopPropagation()
                                console.log("Button clicked", { file, loading })
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 mr-2" />
                                    Analyze Resume
                                </>
                            )}
                        </Button>
                    </form>

                    <AnimatePresence mode="wait"></AnimatePresence>
                    <AnimatePresence mode="wait">
                        {atsResponse && showResults && (
                            <ResumeResults key="results" atsResponse={atsResponse} />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
"use client"
import { Briefcase, Code, BookOpen, ArrowUp, Award } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import type { ATSResponse } from "@/types/resume"

interface ResumeResultsProps {
    atsResponse: ATSResponse
}

export default function ResumeResults({ atsResponse }: ResumeResultsProps) {
    const hasJobFit = atsResponse?.ats_score?.ats_score?.job_fit !== undefined

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-16"
        >
            <div className="space-y-8">
                <div>
                    <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent flex items-center gap-2">
                        <Award className="w-6 h-6 text-[#8B5CF6]" />
                        ATS Score Analysis
                    </h3>
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 shadow-lg">
                        <div className="mb-8">
                            <p className="text-base text-slate-300 mb-3 font-medium">Overall Score</p>
                            <Progress
                                value={atsResponse.ats_score.ats_score.ats_score}
                                className="h-4 bg-red-700"
                            />
                            <div className="flex justify-between mt-3">
                                <p className="text-base text-indigo-300 font-semibold">
                                    {atsResponse.ats_score.ats_score.ats_score}% Match Rate
                                </p>
                                <div className="flex items-center text-purple-300 text-sm">
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    <span>Top 25%</span>
                                </div>
                            </div>
                        </div>

                        {hasJobFit && (
                            <div className="mb-8">
                                <p className="text-base text-slate-300 mb-3 font-medium">Job Match</p>
                                <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-slate-800/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Briefcase className="w-5 h-5 text-[#8B5CF6]" />
                                        <p className="text-lg text-slate-200 font-medium">
                                            {atsResponse.ats_score.ats_score.job_fit?.job_title || "No specific job title detected"}
                                        </p>
                                    </div>
                                    <Progress
                                        value={atsResponse.ats_score.ats_score.job_fit?.fit_percentage || 0}
                                        className="h-3 bg-red-700"
                                    />
                                    <p className="text-base text-indigo-300 mt-3">
                                        {atsResponse.ats_score.ats_score.job_fit?.fit_percentage || 0}% fit
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div>
                                <p className="text-base text-slate-300 mb-3 font-medium">Feedback</p>
                                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50">
                                    <p className="text-base text-slate-200 leading-relaxed">
                                        {atsResponse.ats_score.ats_score.feedback}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-base text-slate-300 mb-4 font-medium">Improvements Needed</p>
                                <ul className="space-y-3">
                                    {atsResponse.ats_score.ats_score.improvements.map((improvement, index) => {
                                        let ImprovementIcon = ArrowUp;
                                        if (improvement.toLowerCase().includes('degree') || improvement.toLowerCase().includes('education')) {
                                            ImprovementIcon = BookOpen;
                                        } else if (improvement.toLowerCase().includes('experience')) {
                                            ImprovementIcon = Briefcase;
                                        } else if (improvement.toLowerCase().includes('project')) {
                                            ImprovementIcon = Code;
                                        }

                                        return (
                                            <li key={index} className="text-base text-slate-200 flex items-start bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                                                <ImprovementIcon className="w-5 h-5 text-[#A78BFA] mt-0.5 mr-3 flex-shrink-0" />
                                                {improvement}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

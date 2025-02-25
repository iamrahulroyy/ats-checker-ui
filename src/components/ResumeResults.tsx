"use client"
import { Briefcase, Code, BookOpen, Award } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import type { ATSResponse } from "@/types/resume"

interface ResumeResultsProps {
  atsResponse: ATSResponse
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export default function ResumeResults({ atsResponse }: ResumeResultsProps) {
  const hasJobFit = atsResponse?.ats_score?.ats_score?.job_fit !== undefined

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.5 }}
      className="mt-12 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Award className="w-7 h-7 text-primary" />
        <h3 className="text-2xl font-semibold gradient-text">
          ATS Score Analysis
        </h3>
      </div>

      <div className="space-y-6">
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground mb-4">Overall Score</p>
          <Progress 
            value={atsResponse.ats_score.ats_score.ats_score} 
            className="h-3 bg-secondary/30"
          />
          <div className="flex justify-between mt-4">
            <p className="text-primary font-medium text-lg">
              {atsResponse.ats_score.ats_score.ats_score}% Match Rate
            </p>
            {/* <div className="flex items-center text-[#4ECCA3] text-sm font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              Top 25%
            </div> */}
          </div>
        </motion.div>

        {hasJobFit && (
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-[#4ECCA3]" />
              <p className="text-lg font-medium gradient-text">
                {atsResponse.ats_score.ats_score.job_fit?.job_title || "No specific job title detected"}
              </p>
            </div>
            <Progress
              value={atsResponse.ats_score.ats_score.job_fit?.fit_percentage || 0}
              className="h-3 bg-secondary/30"
            />
            <p className="text-primary mt-4 font-medium">
              {atsResponse.ats_score.ats_score.job_fit?.fit_percentage || 0}% fit
            </p>
          </motion.div>
        )}

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground mb-3">Feedback</p>
          <p className="text-foreground leading-relaxed">
            {atsResponse.ats_score.ats_score.feedback}
          </p>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-sm text-muted-foreground mb-4">Improvements Needed</p>
          <ul className="space-y-4">
            {atsResponse.ats_score.ats_score.improvements.map((improvement, index) => {
              let ImprovementIcon = Code
              if (improvement.toLowerCase().includes("education")) {
                ImprovementIcon = BookOpen
              } else if (improvement.toLowerCase().includes("experience")) {
                ImprovementIcon = Briefcase
              }

              return (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 text-foreground"
                >
                  <ImprovementIcon className="w-5 h-5 text-[#4ECCA3] mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{improvement}</span>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}
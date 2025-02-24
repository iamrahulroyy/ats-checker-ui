export interface JobFit {
    job_title: string
    fit_percentage: number
}

export interface ATSScoreData {
    ats_score: number
    feedback: string
    improvements: string[]
    job_fit?: JobFit
}

export interface ATSResponse {
    filename: string
    ats_score: {
        resume_id: number
        ats_score: ATSScoreData
    }
}

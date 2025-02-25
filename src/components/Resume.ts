export type ATSResponse = {
    ats_score: {
      ats_score: {
        ats_score: number
        feedback: string
        improvements: string[]
        job_fit?: {
          job_title?: string
          fit_percentage: number
        }
      }
    }
  }
  
  
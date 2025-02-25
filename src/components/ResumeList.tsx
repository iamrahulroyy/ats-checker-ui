"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface Resume {
  id: number
  filename: string
  file_size: number
  file_url: string
}

export default function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([])

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/`)
        if (response.ok) {
          const data = await response.json()
          setResumes(data)
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error)
      }
    }

    fetchResumes()
  }, [])

  return (
    <div className="max-h-[400px] overflow-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-white/10 bg-[#0f172a]/95 sticky top-0">
            <TableHead className="text-foreground/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Filename</span>
              </div>
            </TableHead>
            <TableHead className="text-foreground/80">Size</TableHead>
            <TableHead className="text-foreground/80 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume, index) => (
            <motion.tr
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-white/10 hover:bg-white/[0.02]"
            >
              <TableCell className="text-white/90 font-medium">
                {resume.filename}
              </TableCell>
              <TableCell className="text-white/70">
                {(resume.file_size / 1024).toFixed(2)} KB
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${resume.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#60A5FA] hover:text-[#38BDF8] transition-colors"
                >
                  View
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
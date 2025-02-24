"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, ExternalLink } from "lucide-react"

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
    <div className="max-h-[400px] overflow-auto px-1">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 bg-slate-800/30">
            <TableHead className="text-slate-400">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Filename</span>
              </div>
            </TableHead>
            <TableHead className="text-slate-400">Size</TableHead>
            <TableHead className="text-slate-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id} className="border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <TableCell className="text-slate-300 py-3">{resume.filename}</TableCell>
              <TableCell className="text-slate-300 py-3">
                {(resume.file_size / 1024).toFixed(2)} KB
              </TableCell>
              <TableCell className="text-right py-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${resume.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
                >
                  View
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "./ui/Button"
import { Upload, File, X, Shield } from "lucide-react"

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void
  accept?: string
  maxSize?: number
  currentFile: File | null
}

export function FileUploader({ onFileSelected, accept = "*", maxSize = 10, currentFile }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    if (accept !== "*" && !file.type.match(accept)) {
      setError("Type de fichier non supporté. PDF requis.")
      return false
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`Fichier trop volumineux. Maximum ${maxSize}MB`)
      return false
    }

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelected(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelected(file)
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = () => {
    onFileSelected(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="file-uploader">
      {currentFile ? (
        <div className="file-selected">
          <div className="file-info">
            <div className="file-icon-container">
              <File className="file-icon" />
              <div className="file-ping"></div>
            </div>
            <div className="file-details">
              <p className="file-name">{currentFile.name}</p>
              <p className="file-meta">
                <Shield className="shield-icon" />
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB • Sécurisé
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={removeFile} className="remove-button">
            <X className="remove-icon" />
          </Button>
        </div>
      ) : (
        <div
          className={`drop-zone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="file-input" />

          <div className="upload-icon-container">
            <Upload className={`upload-icon ${dragActive ? "upload-active" : "upload-idle"}`} />
            {dragActive && <div className="upload-ping"></div>}
          </div>

          <p className="drop-title">Zone de Dépôt Sécurisée</p>
          <p className="drop-subtitle">Glissez votre PDF ici ou cliquez pour parcourir</p>

          <Button variant="outline" onClick={handleButtonClick} className="browse-button">
            Sélectionner un fichier
          </Button>

          <div className="security-info">
            <Shield className="security-icon" />
            <span>PDF • {maxSize}MB max • Cryptage SSL</span>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

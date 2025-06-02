"use client";

import { useState } from "react";
import { FileUploader } from "./components/FileUploader";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Alert } from "./components/ui/Alert";
import { Progress } from "./components/ui/Progress";
import { Modal } from "./components/ui/Modal";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Zap,
  Brain,
  Scan,
} from "lucide-react";
import "./App.css";

function findNestedValue(obj: any, key: string): any {
  if (obj === null || typeof obj !== "object") return undefined;
  if (key in obj) return obj[key];
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const value = findNestedValue(obj[k], key);
      if (value !== undefined) return value;
    }
  }
  return undefined;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"ready" | "loading" | "success" | "error">("ready");
  const [reportUrl, setReportUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [agentMessage, setAgentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const agentMessages = [
    "Analyse du document en cours...",
    "Traitement par intelligence artificielle...",
    "Génération des insights...",
    "Finalisation du rapport...",
  ];

  const typeMessage = (message: string) => {
    setIsTyping(true);
    setAgentMessage("");
    let i = 0;
    const typing = setInterval(() => {
      if (i < message.length) {
        setAgentMessage(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
      }
    }, 50);
  };

  const handleFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
    setStatus("ready");
    setErrorMessage("");
    setReportUrl("");
    setAgentMessage("");
    if (selectedFile) {
      typeMessage("Fichier détecté ! Prêt pour l'analyse...");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("loading");
    setErrorMessage("");
    setProgress(0);
    let messageIndex = 0;
    typeMessage(agentMessages[messageIndex]);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 25 && messageIndex === 0) {
          messageIndex = 1;
          typeMessage(agentMessages[messageIndex]);
        } else if (newProgress >= 50 && messageIndex === 1) {
          messageIndex = 2;
          typeMessage(agentMessages[messageIndex]);
        } else if (newProgress >= 75 && messageIndex === 2) {
          messageIndex = 3;
          typeMessage(agentMessages[messageIndex]);
        }
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("https://n8n.srv787725.hstgr.cloud/webhook/generate-diagnostic", {
        method: "POST",
        body: formData,
      });
      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) throw new Error("Erreur lors de l'envoi au serveur");
      const data = await response.json();
      console.log("Réponse JSON complète :", data);

      const url = findNestedValue(data, "lien");
      if (!url || typeof url !== "string") throw new Error("Lien manquant dans la réponse");

      console.log("📎 Lien généré :", url);
      setReportUrl(url);
      setStatus("success");
      setShowModal(true);
      typeMessage("Mission accomplie ! Rapport généré avec succès.");

    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      setStatus("error");
      setErrorMessage(error.message || "Erreur inconnue");
      typeMessage("Erreur détectée. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="agent-header">
          <div className="glow-background"></div>
          <div className="header-content">
            <div className="title-section">
              <div className="brain-container">
                <Brain className="brain-icon" />
                <div className="ping-effect"></div>
              </div>
              <h1 className="main-title">Agent Diagnostic</h1>
              <Zap className="spark-icon" />
            </div>
            <p className="subtitle">Intelligence Artificielle • Analyse Avancée • Rapport Instantané</p>
          </div>
        </div>

        {/* Status */}
        {agentMessage && (
          <div className="agent-status">
            <div className="status-content">
              <Scan className={`scan-icon ${loading ? "scanning" : ""}`} />
              <span className="status-text">
                {agentMessage}
                {isTyping && <span className="cursor">|</span>}
              </span>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <Card className="main-card">
          <div className="card-header">
            <div className="scan-line"></div>
            <div className="card-title">
              <FileText className="file-icon" />
              Zone de Téléchargement Sécurisée
            </div>
          </div>

          <div className="card-content">
            <FileUploader
              onFileSelected={handleFileSelected}
              accept="application/pdf"
              maxSize={10}
              currentFile={file}
            />

            {status === "loading" && (
              <div className="loading-section">
                <div className="progress-header">
                  <span className="progress-label">Progression de l'analyse</span>
                  <span className="progress-value">{progress}%</span>
                </div>
                <div className="progress-container">
                  <Progress value={progress} />
                  <div className="progress-shimmer"></div>
                </div>
                <div className="loading-dots">
                  <div className="dot dot-1"></div>
                  <div className="dot dot-2"></div>
                  <div className="dot dot-3"></div>
                </div>
              </div>
            )}
          </div>

          <div className="card-footer">
            <Button onClick={handleSubmit} disabled={loading || !file} className="submit-button">
              {loading ? (
                <>
                  <Loader2 className="spinner" /> Agent en action...
                </>
              ) : (
                <>
                  <Zap className="button-icon" /> Activer l'Agent Diagnostic
                </>
              )}
            </Button>

            {status === "success" && reportUrl && (
              <Alert type="success">
                <CheckCircle2 className="alert-icon success-icon" />
                <div className="alert-content">
                  <div className="alert-title">Mission Accomplie!</div>
                  <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                    <span>Accéder au Rapport</span>
                  </a>
                </div>
              </Alert>
            )}

            {status === "error" && (
              <Alert type="error">
                <AlertCircle className="alert-icon error-icon" />
                <div className="alert-content">
                  <div className="alert-title">Erreur Système</div>
                  <div className="alert-description">{errorMessage}</div>
                </div>
              </Alert>
            )}
          </div>
        </Card>

        <div className="agent-footer">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Agent IA • Statut: Opérationnel</span>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} url={reportUrl} />
      </div>
    </div>
  );
}

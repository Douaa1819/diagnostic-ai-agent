# Diagnostic AI Agent ⚡

This project is an intelligent diagnostic assistant powered by AI. It allows users to upload PDF files (such as business diagnostic reports), analyzes the content, and returns a downloadable link to a dynamically generated smart report using a Google Slides template.

## Features
-  Intelligent PDF analysis using GPT-4
-  Secure file upload zone
-  Real-time progress bar and typing animation
-  Google Drive integration for sharing final reports
-  Clean and interactive UI with React + CSS

## Technologies Used
- React + TypeScript
- GPT-4 via OpenAI API
- n8n workflow automation
- Google Drive API
- Custom modal & UI components

## How to Use
1. Upload your PDF file via the secure UI.
2. Click on "Activate Diagnostic Agent".
3. Wait for the AI to analyze and generate the report.
4. A modal will display with a download link to your generated report.

## Setup
```bash
npm install
npm run dev

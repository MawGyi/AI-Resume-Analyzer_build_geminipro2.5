# 🚀 AI Resume Analyzer

An intelligent, multi-tool application powered by the Google Gemini API to analyze, optimize, and tailor your resume for your next job application. Get instant, actionable feedback, match your resume to job descriptions, generate cover letters, and more.

![AI Resume Analyzer Screenshot](https://storage.googleapis.com/aistudio-project-marketplace-public/4f647961-e129-459a-881c-b715a31a9805/screely.png)

## ✨ Features

This application is a comprehensive toolkit for job seekers, offering several distinct modes:

-   **📄 Resume Analysis:** Get a detailed breakdown of your resume, including an overall score, a summary of its content, key strengths, areas for improvement, suggested keywords, and feedback on formatting.
-   **🎯 Job Description Match:** Upload your resume and a job description to see how well they align. The tool provides a match score, a summary, and highlights keywords found in your resume and those that are missing.
-   **✍️ Bullet Point Rewriter:** Input a resume bullet point and get several AI-generated variations that are more impactful, action-oriented, and tailored with specific keywords.
-   **✉️ Cover Letter Generator:** Automatically generate a professional and compelling cover letter based on the contents of your resume and a target job description.
-   **🤖 ATS Parser & Audit:** See how an Applicant Tracking System (ATS) would parse your resume. The tool extracts key information into a structured JSON format and then provides an AI-powered audit of the parsing quality with actionable recommendations.
-   **❓ Interview Question Generator:** Generate a list of targeted interview questions (behavioral, skill-gap, and situational) based on your resume and the job you're applying for.
-   **💾 Advanced Input:**
    -   Supports direct text entry and file uploads (`.pdf`, `.txt`, `.md`).
    -   Client-side PDF parsing to extract text.
    -   Full undo/redo history for all text inputs.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI:** [Google Gemini API](https://ai.google.dev/gemini-api) (`@google/genai`)
-   **PDF Parsing:** [PDF.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`)

## ⚙️ How It Works

The application leverages the power of the Google Gemini API, specifically the `gemini-2.5-pro` and `gemini-2.5-flash` models.

For each feature, a detailed prompt is sent to the Gemini API along with a strict `responseSchema`. This ensures that the API's response is always a structured, predictable JSON object that matches the application's TypeScript types. This method provides reliability and type safety, preventing common errors associated with parsing unstructured text from an LLM.

The client-side code then takes this structured JSON and renders it into a user-friendly, component-based interface.

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

You will need a Google Gemini API key. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ai-resume-analyzer.git
    cd ai-resume-analyzer
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a file named `.env` in the root of the project and add your API key:
    ```
    API_KEY=your_google_ai_studio_api_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

The application should now be running on your local machine.
# MedSTEM Tutor

MedSTEM Tutor is a web application designed to explain complex STEM concepts (like Blockchain or Thermodynamics) using medical analogies. This project was developed as part of a technical bootcamp to demonstrate the integration of Google Gemini AI with cloud-native deployment.

## 🚀 Live Demo
The application is hosted on Google Cloud Run:
[Your Cloud Run URL Here]

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **AI Engine:** Google Gemini 3 Flash
- **Development Environment:** Google AI Studio
- **Hosting:** Google Cloud Run (Serverless)

## 📦 Dependencies
The project relies on the following key libraries:
- `@google/generative-ai`: For interfacing with the Gemini API.
- `react`: UI library.
- `typescript`: For type-safe development.
- `lucide-react`: For iconography.

## ⚙️ Setup and Deployment

### 1. Google Cloud Configuration
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Cloud Run API** and **Artifact Registry API**.

### 2. AI Studio Prototyping
1. Open [Google AI Studio](https://aistudio.google.com/).
2. Create a new "Prompt" or "App" and select the **Gemini 3 Flash** model.
3. Define the **System Instructions** to act as a medical-themed STEM tutor.
4. Export the code or use the "Deploy to Cloud Run" feature.

### 3. Local Development
To run the project locally:
```bash
# Install dependencies
npm install

# Create a .env file with your API Key
VITE_GEMINI_API_KEY=your_api_key_here

# Start the dev server
npm run dev

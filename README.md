# 🛡️ PhishGuard: Real-Time Phishing Detection Pipeline

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![React](https://img.shields.io/badge/React-Vite-blueviolet.svg)
![Machine Learning](https://img.shields.io/badge/ML-XGBoost-orange.svg)

PhishGuard is a full-stack, end-to-end machine learning project designed to detect malicious phishing URLs in real-time. It moves beyond simple signature-based blacklists by utilizing structural and lexical feature extraction to identify zero-day phishing attempts.

**[📄 View the Full Architecture & Implementation PDF Report](./PhishGuard_Project_Report.pdf)**

## 🎥 Live Demonstration

Watch the system seamlessly integrate the ML model, FastAPI backend, and React UI to intercept threats in real-time.

🔗 **[Click Here to Watch the Demo Video](https://drive.google.com/file/d/13HgeUIEexdacKUpiUEhv5bRWQPOsmC7A/view?usp=drive_link)])**

---

## 🧠 System Architecture

The project is decoupled into four primary components:

1.  **The ML Brain:** An XGBoost classification model trained on a balanced dataset of verified phishing URLs (PhishTank) and dynamically generated safe URLs. Achieves >95% accuracy using lexical feature engineering (URL length, hyphen counts, IP presence, sensitive keywords).
2.  **The Backend API:** A high-performance REST API built with `FastAPI` serving the serialized `joblib` model for sub-500ms inference.
3.  **The Chrome Extension:** A Manifest V3 browser extension that intercepts the active tab's URL and communicates asynchronously with the backend.
4.  **The Analyst Dashboard:** A centralized, dark-mode React (Vite) interface for manual threat scanning and organizational telemetry.





## 🚀 How to Run Locally
If you wish to run the PhishGuard environment locally, you will need two separate terminal instances.


# 1. The Chrome Extension (User View)
This is the component that actually gets installed and saved directly into your browser to scan live websites. If this is the part you were actually trying to add to Chrome, here is how you do it:

### Open Google Chrome and navigate to chrome://extensions/.
### Turn on Developer mode in the top right.
### Click the Load unpacked button in the top left.
### Select your PhishGuard_Extension folder.


# 2. Start the Backend Server (Terminal 1)
### Install required Python dependencies
python -m pip install fastapi uvicorn xgboost pandas joblib
### Launch the FastAPI inference server
python -m uvicorn app:app --reload


# 3. Start the React Dashboard (Terminal 2)
### Navigate to the frontend directory
cd dashboard
### Install Node modules
npm install
npm install lucide-react
### Launch the Vite development server
npm run dev
### copy link like (http://localhost:5173) appeared in the terminal.


# 2: Open it in Google Chrome
Once your terminal says the server is running and gives you a local network link, you can open it!
### Open Google Chrome.
### Click on the address bar at the very top.
### Type in your local address(http://localhost:5173).
### Press Enter. Your dark-mode PhishGuard Analyst Dashboard will immediately load.



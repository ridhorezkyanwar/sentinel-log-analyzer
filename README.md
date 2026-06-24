# 🤖 Sentinel Log Analyzer

> **AI-Powered Threat Intelligence & SOC Copilot**
> 
> [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://sentinel-log-analyzer-phi.vercel.app/)
> [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
> [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
> [![Groq](https://img.shields.io/badge/AI-Groq_Llama3-orange?style=flat-square)](https://groq.com/)

An intelligent security log analysis tool that acts as a **Tier-3 SOC (Security Operations Center) Analyst**. It ingests raw server logs, firewall logs, or access logs, and utilizes Large Language Models (LLM) to detect threats, extract Indicators of Compromise (IoCs), and generate executive threat intelligence reports in real-time.

🌐 **Live:** [sentinel-log-analyzer-phi.vercel.app](https://sentinel-log-analyzer-phi.vercel.app/)

---

## ✨ Key Features

- 🧠 **AI-Driven Analysis:** Powered by **Llama 3.3 70B** via Groq API for ultra-fast inference (<500ms).
- 🔍 **Threat Detection:** Automatically identifies patterns like Brute Force, SQL Injection, XSS, Path Traversal, and Port Scanning.
- 📊 **IoC Extraction:** Intelligently extracts malicious IP addresses, suspicious user agents, and attack vectors.
- 📝 **Executive Reporting:** Generates structured Markdown reports with Severity Assessment and Remediation Steps.
- 🔒 **Secure Architecture:** API keys are managed via environment variables (never exposed to the client).
- ⚡ **Edge Deployment:** Deployed on Vercel Edge Network for global low-latency access.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **AI Engine** | Vercel AI SDK + Groq (Llama 3.3 70B) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Lucide React + Motion (Framer Motion) |
| **Deployment** | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed.
- A Groq API Key (Get one for free at [console.groq.com](https://console.groq.com/)).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ridhorezkyanwar/sentinel-log-analyzer.git
   cd sentinel-log-analyzer
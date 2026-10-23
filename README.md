# Sentinel Log Analyzer

> **AI-assisted security log triage and reporting**

<p>
  <a href="https://sentinel-log-analyzer-phi.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/LLM-Groq-orange?style=flat-square" alt="Groq LLM provider" />
</p>

Sentinel accepts user-supplied log text and asks a language model to produce a structured review with suspected attack patterns, candidate indicators of compromise (IoCs), a severity assessment, and suggested next steps.

**This is an educational triage aid, not an automated detection engine or a replacement for an analyst, SIEM, or incident-response process.** Model output can be incomplete or wrong and must be checked against the original logs.

## Features

- Submit server, access, authentication, or firewall log excerpts as text.
- Generate a Markdown report with an executive summary, suspected threats, candidate IoCs, severity, and suggested remediation.
- Use the Groq API with the `qwen/qwen3.6-27b` model configured in the API route.
- Keep the provider API key on the server rather than embedding it in browser code.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- Vercel AI SDK with the Groq provider
- Tailwind CSS 4
- Motion and Lucide React

## Run locally

### Requirements

- Node.js 22 or newer
- npm
- A Groq API key from [Groq Console](https://console.groq.com/)

### Setup

```bash
git clone https://github.com/ridhorezkyanwar/sentinel-log-analyzer.git
cd sentinel-log-analyzer
npm install
```

Create `.env.local` in the project root and add your key:

```dotenv
GROQ_API_KEY=replace_with_your_key
```

Keep the key private. Do not commit `.env.local` and do not rename the variable to a `NEXT_PUBLIC_*` variable.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

These are the lint and production-build scripts currently defined in `package.json`. The project does not currently define an `npm test` script, so these commands should not be represented as a passing automated test suite.

## Privacy and safe use

- Logs may contain usernames, IP addresses, session identifiers, internal hostnames, or secrets. Remove or mask data that should not leave your environment before submitting it.
- The server sends submitted log text to the configured Groq model provider for analysis. Review your provider's current data-handling terms before using sensitive or regulated logs.
- Treat the output as a set of hypotheses. Confirm suspected indicators and remediation steps with trusted telemetry and source evidence.
- Do not paste real incident data into the public demo unless you have permission to share it.

## Limitations

The current API route sends the supplied text to an LLM and returns its generated report. It does not, by itself, prove that an event occurred, guarantee that all attacks are detected, or replace deterministic correlation rules and threat-intelligence validation. Response time depends on input size, provider availability, and model latency; no fixed latency guarantee is claimed.

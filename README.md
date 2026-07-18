<div align="center">

<br/>

# BookNfix
### Agentic Service Provider Matching & Booking Platform

<br/>

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-2.0.0-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=flat-square&logo=groq&logoColor=white)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

> A full-stack, AI-driven service matching platform enabling dynamic provider search, intelligent rank-based booking, real-time scraping, and autonomous voice agents for inquiries — engineered with Groq function calling, Roman Urdu translation pipelines, real-time WebSocket chat, and a robust PostgreSQL + Redis backend.

---

</div>

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Key Features](#5-key-features)
6. [Agentic Pipeline & LLM Integration](#6-agentic-pipeline--llm-integration)
7. [Agentic Voice Caller & Localization](#7-agentic-voice-caller--localization)
8. [Computer Networks & Real-time WebSockets](#8-computer-networks--real-time-websockets)
9. [Project Structure](#9-project-structure)
10. [Getting Started](#10-getting-started)
11. [Environment Variables](#11-environment-variables)
12. [API Reference](#12-api-reference)

---

## 1. Problem Statement

Finding reliable, available, and skilled local service providers (electricians, plumbers, tutors, etc.) is often a tedious manual process. Users struggle with:

| Limitation | Description |
|---|---|
| **Manual Searching** | Users must manually browse listings, read reviews, and verify availability. |
| **Language Barriers** | Many local providers in South Asia communicate primarily in Urdu, while tech platforms default to English. |
| **Communication Friction** | Coordinating schedules and explaining problems requires multiple phone calls and text messages. |
| **Lack of Context** | Providers arrive on-site without a clear understanding of the specific problem or required tools. |

---

## 2. Solution Overview

**BookNfix (ServiceAI)** addresses these gaps through an autonomous, agentic matchmaking system. 

| Gap | BookNfix's Approach |
|---|---|
| **Manual Searching** | Groq-powered agents dynamically scrape, search, and rank local providers based on user intent and location. |
| **Language Barriers** | Built-in Roman Urdu to proper Nastaliq script translation ensures seamless communication with local providers. |
| **Communication Friction** | An autonomous voice agent (Vapi) calls providers to inquire about availability and explain the problem before booking. |
| **Lack of Context** | End-to-End Encrypted (E2EE) WebSocket chat allows users to share images and exact details with providers pre-arrival. |

---

## 3. System Architecture

The system operates across a dual-tier client-server architecture:

| Tier | Component | Technology |
|---|---|---|
| **Client** | Mobile Application | React Native (Expo) |
| **Server** | Backend API | FastAPI + Uvicorn |
| **Database** | Relational DB | PostgreSQL (SQLAlchemy) |
| **Cache/PubSub** | In-Memory Store | Redis |
| **AI Inference** | LLM Engine | Groq API (Llama-3.3-70b-versatile) |

### Block Diagram Summary
The user interacts with the **React Native** app, sending a natural language request (e.g., "I need a plumber to fix a leaking pipe"). The **FastAPI** backend routes this to the **Groq Agentic Pipeline**. The LLM decides the tool order: it parses the intent, triggers a **real-time scraper** to find providers, ranks them, and triggers the **Agentic Caller** (Vapi) to make an outbound voice call translated into Urdu. Once confirmed, a booking is saved in **PostgreSQL**, and a real-time **WebSocket** chat is opened via **Redis** pub/sub.

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Mobile** | React Native 0.81, Expo 54 | Cross-platform mobile app development |
| **State Management** | Zustand | Lightweight, fast global state management |
| **Navigation** | React Navigation v7 | Bottom tabs and native stack routing |
| **Backend** | FastAPI, Uvicorn | Async Python API server |
| **Database** | PostgreSQL, Alembic | Relational data storage and migrations |
| **Cache & PubSub** | Redis | WebSocket message brokering and rate limiting |
| **LLM Orchestration** | Groq, Llama-3.3-70b | Agentic function calling and reasoning |
| **Voice Agents** | Vapi, Twilio | Outbound automated AI phone calls |
| **Authentication** | Firebase Auth | Secure user identity and session management |

---

## 5. Key Features

### User Mobile App
- **Natural Language Booking:** Users simply type or speak their problem, and the AI parses the exact service category, urgency, and location.
- **Live Provider Discovery:** View real-time tracking of AI agents scraping, calling, and negotiating with providers in the background.
- **Bilingual Interface:** Toggle between English and Urdu dynamically via `LanguageContext`.
- **E2EE Chat:** Real-time chat with matched providers.
- **Booking History & Status:** Track upcoming, in-progress, and completed jobs.

### Agentic Backend
- **Dynamic Tool Execution:** The LLM independently chooses when to search, rank, or ask the user for clarification.
- **Autonomous Voice Calling:** Automatically calls providers, explains the job in Urdu, asks for their availability, and records the transcript.
- **Real-time Web Scraping:** Pulls local provider data on-the-fly when database records are insufficient.
- **Automated Email Notifications:** Sends SMTP booking confirmations to users and providers.

---

## 6. Agentic Pipeline & LLM Integration

Physically hardcoding booking logic is brittle. BookNfix uses **Function Calling** via Groq's lightning-fast inference to create a dynamic orchestration layer.

**The Tools:**
1. `parse_intent`: Extracts service type, urgency, and location from raw text.
2. `search_providers`: Queries PostgreSQL and triggers the real-time scraper if local density is low.
3. `rank_providers`: Sorts providers by distance, rating, and AI-assessed relevance to the specific problem.
4. `ask_clarification`: Halts the pipeline to ask the user a question if the request is ambiguous (e.g., "Is it a gas or electric heater?").

The **Llama-3.3-70b** model acts as the brain, determining the sequence of tools. If a provider rejects the job, the agent autonomously retries with the next best-ranked provider.

---

## 7. Agentic Voice Caller & Localization

To bridge the gap with local tradespeople, the system features a robust **Urdu Localization Pipeline**:

1. **Translation (Roman Urdu to Nastaliq):** Using a dedicated prompt on Groq, any Roman Urdu or mixed English user input is translated to proper Urdu script.
2. **Prompt Injection:** The translated text is injected into the system prompt for the outbound voice agent.
3. **Vapi Call Execution:** An outbound call is placed to the provider. The AI speaks in Urdu, explains the problem, and asks for availability.
4. **Transcript Processing:** The conversation transcript is saved, and the outcome (`accepted`, `rejected`, `voicemail`) is fed back to the Agentic Pipeline.

---

## 8. Computer Networks & Real-time WebSockets

The platform handles real-time bidirectional communication for live chats and agent status updates:

- **WebSocket Manager:** FastAPI handles concurrent WebSocket connections per user.
- **Redis Pub/Sub:** Enables horizontal scaling. When User A sends a message to Provider B, it is published to a Redis channel. Any worker node hosting Provider B's WebSocket connection receives the event and pushes it to the client.
- **Heartbeats:** Configurable ping/pong intervals keep mobile connections alive during background states.

---

## 9. Project Structure

```
BookNfix/
├── serviceai-backend/                    # Python FastAPI Backend
│   ├── main.py                           # App entry, CORS config, lifespan
│   ├── requirements.txt                  # Python dependencies
│   ├── .env.example                      # Environment variable template
│   ├── alembic/                          # DB Migration scripts
│   ├── app/
│   │   ├── api/                          # REST API Routes (v1 and v2)
│   │   ├── Agentic_Caller/               # Vapi integration & Urdu translations
│   │   ├── Agentic_booker/               # Orchestration pipeline
│   │   ├── agents/                       # Realtime scraper & LLM tools
│   │   ├── core/                         # DB connection, Redis config
│   │   ├── models/                       # SQLAlchemy ORM models
│   │   ├── services/                     # Email notifier, account management
│   │   └── websocket/                    # WS manager and Redis pub/sub
│   └── data/                             # SQLite fallback / CSV data
│
├── serviceai-mobile/                     # React Native Frontend
│   ├── App.js                            # Root navigation and providers
│   ├── package.json                      # Node dependencies
│   ├── app.json                          # Expo configuration
│   └── src/
│       ├── components/                   # Reusable UI elements (Badges, Cards)
│       ├── config/                       # Firebase & API constants
│       ├── constants/                    # Theme, colors, typography
│       ├── contexts/                     # AuthContext, LanguageContext
│       └── screens/                      # UI Screens (Home, Dashboard, Chat)
```

---

## 10. Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 16**
- **Redis**

### Step 1 — Backend Setup
```bash
cd serviceai-backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### Step 2 — Database & Redis
Ensure PostgreSQL and Redis are running. Run Alembic migrations:
```bash
alembic upgrade head
```

### Step 3 — Frontend Setup
```bash
cd serviceai-mobile
npm install
```

### Step 4 — Run All Services
```bash
# Terminal 1 — Backend
cd serviceai-backend
uvicorn main:app --reload

# Terminal 2 — Frontend
cd serviceai-mobile
npx expo start
```

---

## 11. Environment Variables

Create `.env` in `serviceai-backend/`:

```env
GROQ_API_KEY=your_groq_api_key
VAPI_API_KEY=your_vapi_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_id
POSTGRES_URL=postgresql+asyncpg://user:pass@localhost:5432/serviceai
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your_jwt_secret
EMAIL_APP_PASSWORD=your_gmail_app_password
```

---

## 12. API Reference

### Core Pipeline
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/parse-intent` | Extracts service details from natural language |
| `POST` | `/api/analyze` | Triggers the full end-to-end agentic booking pipeline |

### Bookings & Providers
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/search-providers` | Queries DB and triggers real-time scraper if needed |
| `POST` | `/api/rank-providers` | LLM-based ranking of providers based on problem |
| `POST` | `/api/book` | Finalizes booking and sends email notifications |

### WebSockets & Chat
| Method | Endpoint | Description |
|---|---|---|
| `WS` | `/ws` | Establishes persistent connection for real-time E2EE chat |

---

<div align="center">
<br/>
<sub>⚠️ This application is for educational and demonstration purposes.</sub><br/>
<sub>© 2026 BookNfix. All rights reserved.</sub>
</div>

# Portfolio Analyzer

A full-stack web application that helps users analyze their investment portfolios and receive AI-powered insights based on computed financial metrics.

 **Live Demo:** https://portfolio-analyzer-ashy.vercel.app/

---

## Overview

Most portfolio dashboards only display data — they don’t tell users what to do with it.

**Portfolio Analyzer** solves this by:

* Processing portfolio data using **Pandas**
* Computing key financial metrics
* Generating **AI-based investment suggestions**
* Visualizing everything in an interactive dashboard

---

## Key Idea

Instead of sending raw user input to an AI model, this project:

> **First computes structured financial metrics using Pandas, then feeds that data into the AI model.**

This significantly improves the quality and relevance of recommendations.

---

## Architecture

The project is divided into three main parts:

### 1. Frontend (Dashboard)

* Displays portfolio insights and recommendations
* Built with JavaScript (interactive UI)

### 2. Backend (API)

* Built using **FastAPI (Python)**
* Handles:

  * Input validation
  * Data processing
  * API responses

### 3. Data & AI Layer

* **Pandas** → Computes:

  * Asset allocation
  * Portfolio distribution
  * Basic risk indicators
* AI Model → Generates human-readable investment suggestions

---

## Data Flow

User Input → FastAPI Backend → Pandas Processing → AI Recommendation → Frontend Visualization

---

## Tech Stack

### Frontend

* JavaScript
* HTML
* CSS

### Backend

* Python
* FastAPI

### Data Processing

* Pandas
* NumPy

### Deployment

* Vercel (Serverless)

---

## Project Structure

```
Portfolio-Analyzer/
│
├── api/                  # FastAPI backend
├── fintech-dashboard/    # Frontend UI
├── investment-advisor/   # AI recommendation logic
├── vercel.json           # Deployment configuration
```

---

## Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Imposon/Portfolio-Analyzer.git
cd Portfolio-Analyzer
```

### 2. Run Backend

```
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Run Frontend

```
cd fintech-dashboard
npm install
npm start
```

---

## Features

*  Portfolio analysis dashboard
*  Financial metrics computation using Pandas
*  AI-generated investment suggestions
*  Fast API responses using FastAPI
*  Deployed on Vercel

---

##  Limitations

* Uses **SQLite**, which is not ideal for high concurrency
* AI recommendations are **not financial advice**
* No authentication system (yet)

---

## Future Improvements

* User authentication (JWT)
* Real-time stock data integration
* Improved risk analysis models
* Better evaluation of AI outputs
* Migration to scalable database (PostgreSQL / Supabase)

---

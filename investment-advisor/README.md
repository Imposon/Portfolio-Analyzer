# AI-Powered Investment Advisor Platform

A production-grade, full-stack Investment Advisor Platform with a dark fintech aesthetic. Users input their financial profile and receive deterministic portfolio recommendations enriched with AI-generated explanations via Groq API.

## Features

- **Portfolio Generation**: Deterministic allocation based on risk profile
- **AI Explanations**: Groq-powered personalized investment advice
- **Interactive Charts**: Growth projections, risk-return analysis, allocation visualization
- **Data Persistence**: SQLite database stores all requests and responses
- **Responsive Design**: Mobile-friendly dark fintech UI

## Tech Stack

### Backend
- **FastAPI**: Modern, high-performance Python web framework
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight database for data persistence
- **Pandas**: Data processing for asset datasets
- **Groq**: AI-powered explanation generation

### Frontend
- **React 18**: Component-based UI library
- **Vite**: Fast build tool and dev server
- **Recharts**: React charting library for visualizations
- **Axios**: HTTP client for API requests
- **Pure CSS**: Custom dark fintech theme (no Tailwind)

## Project Structure

```
investment-advisor/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # Hero, InputForm, Dashboard, Analytics
│   │   ├── styles/            # Per-component CSS files
│   │   ├── utils/             # chartHelpers.js, formatCurrency.js
│   │   ├── api/               # api.js (axios calls to backend)
│   │   └── App.jsx
│   └── vite.config.js
│
├── backend/                   # FastAPI + Python
│   ├── main.py                # App entry, CORS, router registration
│   ├── routes/
│   │   ├── portfolio.py       # POST /generate-portfolio
│   │   └── analysis.py       # GET /get-analysis/{portfolio_id}
│   ├── services/
│   │   ├── allocator.py       # Rule-based allocation engine
│   │   ├── recommender.py     # Asset picker from dataset
│   │   └── groq_service.py    # Groq API explanation generator
│   ├── database/
│   │   ├── db.py              # SQLite connection + init
│   │   └── models.py          # Pydantic models
│   ├── data/
│   │   ├── funds.csv          # Mutual fund dataset
│   │   └── stocks.csv         # Stock dataset
│   └── requirements.txt
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (get from https://console.groq.com)

### Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### POST /portfolio/generate-portfolio
Generate a new portfolio recommendation.

**Request:**
```json
{
  "amount": 100000,
  "risk": "medium",
  "horizon": 5,
  "goal": "wealth"
}
```

**Response:**
```json
{
  "portfolio_id": 1,
  "allocation": {
    "equity": 0.30,
    "debt": 0.20,
    "funds": 0.50
  },
  "assets": [...],
  "ai_explanation": "..."
}
```

### GET /analysis/get-analysis/{portfolio_id}
Get analysis data for an existing portfolio.

**Response:**
```json
{
  "growth_data": [...],
  "risk_return_data": [...],
  "allocation_data": {...}
}
```

## Allocation Rules

The portfolio allocation follows deterministic rules based on risk level:

| Risk Level | Equity | Debt | Funds |
|------------|--------|------|-------|
| Low        | 20%    | 50%  | 30%   |
| Medium     | 30%    | 20%  | 50%   |
| High       | 70%    | 10%  | 20%   |

## Design System

### Color Palette
- **Background**: `#0a0a1a`
- **Card Background**: `rgba(255, 255, 255, 0.05)`
- **Primary Blue**: `#4f8ef7`
- **Purple Accent**: `#9b59f5`
- **Text Primary**: `#f0f0ff`
- **Text Muted**: `#8888aa`

### Card Effects
- Glassmorphism with `backdrop-filter: blur(16px)`
- 3D hover transform with perspective
- Gradient top border accent

## Development Notes

- The Groq API integration includes a fallback explanation generator for when the API is unavailable
- All portfolio calculations use deterministic formulas (no randomness)
- SQLite database automatically initializes on first run
- Frontend uses Vite proxy for seamless API communication during development

## License

MIT License

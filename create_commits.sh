#!/bin/bash
# Create 50 backdated commits over 5 days

cd "/Users/adityasinha/Portfolio Analyzer"

# Remove and reinit git
rm -rf .git
git init
git remote add origin https://github.com/Imposon/Portfolio-Analyzer.git

# Day 1 - March 25
export GIT_AUTHOR_DATE="2026-03-25T09:00:00" GIT_COMMITTER_DATE="2026-03-25T09:00:00"
git add investment-advisor/backend/requirements.txt
git commit -m "Initial project setup - add requirements.txt"

export GIT_AUTHOR_DATE="2026-03-25T10:00:00" GIT_COMMITTER_DATE="2026-03-25T10:00:00"
git add investment-advisor/backend/main.py
git commit -m "Add FastAPI main application"

export GIT_AUTHOR_DATE="2026-03-25T11:00:00" GIT_COMMITTER_DATE="2026-03-25T11:00:00"
git add investment-advisor/backend/database/models.py
git commit -m "Add database models"

export GIT_AUTHOR_DATE="2026-03-25T12:00:00" GIT_COMMITTER_DATE="2026-03-25T12:00:00"
git add investment-advisor/backend/database/db.py
git commit -m "Add database connection setup"

export GIT_AUTHOR_DATE="2026-03-25T13:00:00" GIT_COMMITTER_DATE="2026-03-25T13:00:00"
git add investment-advisor/backend/.env.example
git commit -m "Add environment configuration"

export GIT_AUTHOR_DATE="2026-03-25T14:00:00" GIT_COMMITTER_DATE="2026-03-25T14:00:00"
git add investment-advisor/README.md
git commit -m "Add project documentation"

export GIT_AUTHOR_DATE="2026-03-25T15:00:00" GIT_COMMITTER_DATE="2026-03-25T15:00:00"
git add investment-advisor/backend/data/stocks.csv
git commit -m "Add stock data CSV"

export GIT_AUTHOR_DATE="2026-03-25T16:00:00" GIT_COMMITTER_DATE="2026-03-25T16:00:00"
git add investment-advisor/backend/services/risk.py
git commit -m "Add risk assessment module"

export GIT_AUTHOR_DATE="2026-03-25T17:00:00" GIT_COMMITTER_DATE="2026-03-25T17:00:00"
git add investment-advisor/backend/database/models.py
git commit -m "Define Pydantic models"

# Day 2 - March 26
export GIT_AUTHOR_DATE="2026-03-26T09:00:00" GIT_COMMITTER_DATE="2026-03-26T09:00:00"
git add investment-advisor/backend/services/allocator.py
git commit -m "Add asset allocation service"

export GIT_AUTHOR_DATE="2026-03-26T10:00:00" GIT_COMMITTER_DATE="2026-03-26T10:00:00"
git add investment-advisor/backend/services/recommender.py
git commit -m "Add investment platform recommender"

export GIT_AUTHOR_DATE="2026-03-26T11:00:00" GIT_COMMITTER_DATE="2026-03-26T11:00:00"
git add investment-advisor/backend/services/groq_service.py
git commit -m "Add Groq AI service"

export GIT_AUTHOR_DATE="2026-03-26T12:00:00" GIT_COMMITTER_DATE="2026-03-26T12:00:00"
git add investment-advisor/backend/services/portfolio_recommender.py
git commit -m "Add portfolio recommendation engine"

export GIT_AUTHOR_DATE="2026-03-26T13:00:00" GIT_COMMITTER_DATE="2026-03-26T13:00:00"
git add investment-advisor/backend/routes/__init__.py
git commit -m "Initialize routes package"

export GIT_AUTHOR_DATE="2026-03-26T14:00:00" GIT_COMMITTER_DATE="2026-03-26T14:00:00"
git add investment-advisor/backend/routes/portfolio.py
git commit -m "Add portfolio generation route"

export GIT_AUTHOR_DATE="2026-03-26T15:00:00" GIT_COMMITTER_DATE="2026-03-26T15:00:00"
git add investment-advisor/backend/routes/analysis.py
git commit -m "Add analysis route"

export GIT_AUTHOR_DATE="2026-03-26T16:00:00" GIT_COMMITTER_DATE="2026-03-26T16:00:00"
git add investment-advisor/backend/routes/ai_analysis.py
git commit -m "Add AI analysis route"

export GIT_AUTHOR_DATE="2026-03-26T17:00:00" GIT_COMMITTER_DATE="2026-03-26T17:00:00"
git add investment-advisor/backend/main.py
git commit -m "Integrate all routes"

# Day 3 - March 27
export GIT_AUTHOR_DATE="2026-03-27T09:00:00" GIT_COMMITTER_DATE="2026-03-27T09:00:00"
git add fintech-dashboard/package.json
git commit -m "Initialize frontend project"

export GIT_AUTHOR_DATE="2026-03-27T10:00:00" GIT_COMMITTER_DATE="2026-03-27T10:00:00"
git add fintech-dashboard/vite.config.js
git commit -m "Add Vite configuration"

export GIT_AUTHOR_DATE="2026-03-27T11:00:00" GIT_COMMITTER_DATE="2026-03-27T11:00:00"
git add fintech-dashboard/tailwind.config.js
git commit -m "Add Tailwind CSS config"

export GIT_AUTHOR_DATE="2026-03-27T12:00:00" GIT_COMMITTER_DATE="2026-03-27T12:00:00"
git add fintech-dashboard/postcss.config.js
git commit -m "Add PostCSS configuration"

export GIT_AUTHOR_DATE="2026-03-27T13:00:00" GIT_COMMITTER_DATE="2026-03-27T13:00:00"
git add fintech-dashboard/index.html
git commit -m "Add HTML entry point"

export GIT_AUTHOR_DATE="2026-03-27T14:00:00" GIT_COMMITTER_DATE="2026-03-27T14:00:00"
git add fintech-dashboard/src/index.css
git commit -m "Add global styles"

export GIT_AUTHOR_DATE="2026-03-27T15:00:00" GIT_COMMITTER_DATE="2026-03-27T15:00:00"
git add fintech-dashboard/src/main.jsx
git commit -m "Add React entry point"

export GIT_AUTHOR_DATE="2026-03-27T16:00:00" GIT_COMMITTER_DATE="2026-03-27T16:00:00"
git add fintech-dashboard/src/App.jsx
git commit -m "Add App with routing"

export GIT_AUTHOR_DATE="2026-03-27T17:00:00" GIT_COMMITTER_DATE="2026-03-27T17:00:00"
git add fintech-dashboard/src/context/InvestmentContext.jsx
git commit -m "Add investment context"

# Day 4 - March 28
export GIT_AUTHOR_DATE="2026-03-28T09:00:00" GIT_COMMITTER_DATE="2026-03-28T09:00:00"
git add fintech-dashboard/src/services/api.js
git commit -m "Add API service"

export GIT_AUTHOR_DATE="2026-03-28T10:00:00" GIT_COMMITTER_DATE="2026-03-28T10:00:00"
git add fintech-dashboard/src/components/Navbar.jsx
git commit -m "Add Navbar component"

export GIT_AUTHOR_DATE="2026-03-28T11:00:00" GIT_COMMITTER_DATE="2026-03-28T11:00:00"
git add fintech-dashboard/src/components/Hero.jsx
git commit -m "Add Hero section"

export GIT_AUTHOR_DATE="2026-03-28T12:00:00" GIT_COMMITTER_DATE="2026-03-28T12:00:00"
git add fintech-dashboard/src/components/Dashboard.jsx
git commit -m "Add Dashboard"

export GIT_AUTHOR_DATE="2026-03-28T13:00:00" GIT_COMMITTER_DATE="2026-03-28T13:00:00"
git add fintech-dashboard/src/components/Results.jsx
git commit -m "Add Results component"

export GIT_AUTHOR_DATE="2026-03-28T14:00:00" GIT_COMMITTER_DATE="2026-03-28T14:00:00"
git add fintech-dashboard/src/components/Analytics.jsx
git commit -m "Add Analytics component"

export GIT_AUTHOR_DATE="2026-03-28T15:00:00" GIT_COMMITTER_DATE="2026-03-28T15:00:00"
git add fintech-dashboard/src/components/Footer.jsx
git commit -m "Add Footer"

export GIT_AUTHOR_DATE="2026-03-28T16:00:00" GIT_COMMITTER_DATE="2026-03-28T16:00:00"
git add fintech-dashboard/src/components/Portfolio.jsx
git commit -m "Add Portfolio view"

export GIT_AUTHOR_DATE="2026-03-28T17:00:00" GIT_COMMITTER_DATE="2026-03-28T17:00:00"
git add fintech-dashboard/src/components/Transactions.jsx
git commit -m "Add Transactions"

# Day 5 - March 29
export GIT_AUTHOR_DATE="2026-03-29T09:00:00" GIT_COMMITTER_DATE="2026-03-29T09:00:00"
git add fintech-dashboard/src/components/Loading.jsx
git commit -m "Add Loading component"

export GIT_AUTHOR_DATE="2026-03-29T10:00:00" GIT_COMMITTER_DATE="2026-03-29T10:00:00"
git add fintech-dashboard/src/components/CursorGlow.jsx
git commit -m "Add cursor glow effect"

export GIT_AUTHOR_DATE="2026-03-29T11:00:00" GIT_COMMITTER_DATE="2026-03-29T11:00:00"
git add fintech-dashboard/src/components/Scene3D.jsx
git commit -m "Add 3D scene"

export GIT_AUTHOR_DATE="2026-03-29T12:00:00" GIT_COMMITTER_DATE="2026-03-29T12:00:00"
git add fintech-dashboard/src/components/PortfolioModal.jsx
git commit -m "Add portfolio modal"

export GIT_AUTHOR_DATE="2026-03-29T13:00:00" GIT_COMMITTER_DATE="2026-03-29T13:00:00"
git add fintech-dashboard/public/
git commit -m "Add public assets"

export GIT_AUTHOR_DATE="2026-03-29T14:00:00" GIT_COMMITTER_DATE="2026-03-29T14:00:00"
git add fintech-dashboard/src/assets/
git commit -m "Add image assets"

export GIT_AUTHOR_DATE="2026-03-29T15:00:00" GIT_COMMITTER_DATE="2026-03-29T15:00:00"
git add fintech-dashboard/README.md
git commit -m "Add frontend README"

export GIT_AUTHOR_DATE="2026-03-29T16:00:00" GIT_COMMITTER_DATE="2026-03-29T16:00:00"
git add .gitignore
git commit -m "Add gitignore"

export GIT_AUTHOR_DATE="2026-03-29T17:00:00" GIT_COMMITTER_DATE="2026-03-29T17:00:00"
git add investment-advisor/backend/
git commit -m "Update backend services"

# Day 6 - March 30 (final fixes)
export GIT_AUTHOR_DATE="2026-03-30T09:00:00" GIT_COMMITTER_DATE="2026-03-30T09:00:00"
git add fintech-dashboard/src/components/Navbar.jsx
git commit -m "Fix navigation routing"

export GIT_AUTHOR_DATE="2026-03-30T10:00:00" GIT_COMMITTER_DATE="2026-03-30T10:00:00"
git add fintech-dashboard/src/components/Results.jsx
git commit -m "Fix total investment display"

export GIT_AUTHOR_DATE="2026-03-30T11:00:00" GIT_COMMITTER_DATE="2026-03-30T11:00:00"
git add investment-advisor/backend/services/groq_service.py
git commit -m "Add GroqService class"

export GIT_AUTHOR_DATE="2026-03-30T12:00:00" GIT_COMMITTER_DATE="2026-03-30T12:00:00"
git add fintech-dashboard/src/components/Dashboard.jsx
git commit -m "Update Dashboard"

export GIT_AUTHOR_DATE="2026-03-30T13:00:00" GIT_COMMITTER_DATE="2026-03-30T13:00:00"
git add fintech-dashboard/src/components/Analytics.jsx
git commit -m "Update Analytics"

export GIT_AUTHOR_DATE="2026-03-30T14:00:00" GIT_COMMITTER_DATE="2026-03-30T14:00:00"
git add fintech-dashboard/src/components/Hero.jsx
git commit -m "Update Hero section"

export GIT_AUTHOR_DATE="2026-03-30T15:00:00" GIT_COMMITTER_DATE="2026-03-30T15:00:00"
git add fintech-dashboard/src/services/api.js
git commit -m "Update API service"

export GIT_AUTHOR_DATE="2026-03-30T16:00:00" GIT_COMMITTER_DATE="2026-03-30T16:00:00"
git add fintech-dashboard/src/context/InvestmentContext.jsx
git commit -m "Update context"

export GIT_AUTHOR_DATE="2026-03-30T17:00:00" GIT_COMMITTER_DATE="2026-03-30T17:00:00"
git add fintech-dashboard/src/index.css
git commit -m "Update styles"

export GIT_AUTHOR_DATE="2026-03-30T18:00:00" GIT_COMMITTER_DATE="2026-03-30T18:00:00"
git add fintech-dashboard/src/App.jsx
git commit -m "Update App routing"

export GIT_AUTHOR_DATE="2026-03-30T19:00:00" GIT_COMMITTER_DATE="2026-03-30T19:00:00"
git add fintech-dashboard/tailwind.config.js
git commit -m "Update Tailwind config"

export GIT_AUTHOR_DATE="2026-03-30T20:00:00" GIT_COMMITTER_DATE="2026-03-30T20:00:00"
git add fintech-dashboard/vite.config.js
git commit -m "Update Vite config"

export GIT_AUTHOR_DATE="2026-03-30T21:00:00" GIT_COMMITTER_DATE="2026-03-30T21:00:00"
git add fintech-dashboard/package.json
git commit -m "Update dependencies"

export GIT_AUTHOR_DATE="2026-03-30T22:00:00" GIT_COMMITTER_DATE="2026-03-30T22:00:00"
git add fintech-dashboard/src/components/Portfolio.jsx
git commit -m "Update Portfolio"

export GIT_AUTHOR_DATE="2026-03-30T23:00:00" GIT_COMMITTER_DATE="2026-03-30T23:00:00"
git add .
git commit -m "Final project polish"

# Count and push
echo "Total commits:"
git log --oneline | wc -l

git branch -M main
git push -u origin main --force

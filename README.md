# Lendrisk Intelligence

A comprehensive AI-powered credit risk assessment platform for African micro-lending institutions. Lendrisk combines behavioral analysis, machine learning, and real-time monitoring to help loan officers make informed lending decisions.

## 🚀 Features

### Core Capabilities
- **Behavioral Risk Scoring**: ML-powered risk assessment (0-100 score) based on transaction patterns
- **Real-time Monitoring**: Continuous drift detection and anomaly alerts for approved borrowers
- **Explainable AI**: LLM-generated insights explaining risk scores in plain language
- **Open Banking Integration**: Connects to Mono/Okra for transaction data
- **Active Alert Center**: Dashboard for monitoring behavioral changes and risk triggers

### Dashboard Modules
1. **Global Pulse (Overview)**: Portfolio-level statistics and borrower list
2. **Borrower Profiles**: Detailed risk analysis with income patterns, spending breakdown, and AI insights
3. **Loan Management**: Track disbursed loans, collections, and delinquencies
4. **Alert Center**: Active monitoring alerts with drift detection
5. **System Configuration**: Risk thresholds and API settings

### Technical Highlights
- **Hybrid ML Model**: GradientBoosting with synthetic training data + rule-based fallback
- **Behavioral Features**: Income regularity, survival rate, betting ratio, debt-to-income, cash withdrawal patterns
- **Drift Detection**: KS-test based monitoring for income drops, spending changes, and liquidity issues
- **Full API Backend**: RESTful FastAPI with SQLite (easily migratable to PostgreSQL)
- **Modern Frontend**: React + Vite + Tailwind CSS with glassmorphism design

## 📋 Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Sammione/Lendrisk.git
cd Lendrisk
```

### 2. Backend Setup (FastAPI)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env file with your API keys (see Configuration section)
```

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env.local
# Edit .env.local if needed

# Return to root
cd ..
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# OpenAI API Key (for LLM explanations)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///./lendrisk.db

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE

# API Configuration
API_URL=http://localhost:8000
```

**Note**: The application will work without OpenAI/Twilio keys (uses fallbacks), but for full functionality, configure these services.

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
# Activate virtual environment if not already active
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Start FastAPI server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Production Build

**Backend:**
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

Once the backend is running, access interactive API docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dashboard` | GET | Dashboard statistics |
| `/api/v1/borrowers` | GET | List all borrowers (paginated) |
| `/api/v1/borrowers/{id}` | GET | Get borrower details with charts |
| `/api/v1/borrowers/{id}/loan-action` | POST | Approve/Reject/Request more data |
| `/api/v1/borrowers/{id}/monitor` | POST | Run drift detection |
| `/api/v1/loans` | GET | List all loans |
| `/api/v1/alerts` | GET | List active alerts |
| `/api/v1/alerts/{id}/resolve` | POST | Mark alert as resolved |
| `/api/v1/onboard` | POST | Onboard new borrower |
| `/api/v1/send-sms` | POST | Send consent SMS |

## 🧪 Testing

### Backend Tests
```bash
# Install test dependencies
pip install pytest

# Run tests
pytest api/
pytest ml_engine/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
Lendrisk/
├── api/                    # FastAPI backend
│   ├── main.py            # Main API endpoints
│   ├── database.py        # Database configuration
│   ├── models.py          # SQLAlchemy models
│   └── openbanking.py     # Open Banking service (simulated)
├── ml_engine/             # Machine Learning components
│   ├── model.py           # Risk scoring model
│   ├── features.py        # Feature engineering
│   ├── explainability.py  # LLM integration
│   └── monitoring.py      # Drift detection
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── docs/                  # Documentation
├── .env                   # Environment configuration
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔍 How It Works

### 1. Borrower Onboarding
1. Loan officer enters borrower details and loan amount
2. System sends SMS with bank connection link (Mono/Okra)
3. Borrower connects bank account
4. System fetches 90-day transaction history
5. ML engine generates behavioral features
6. Risk score is calculated (0-100)
7. LLM generates human-readable explanation
8. Loan is created in system

### 2. Risk Scoring
The ML model analyzes:
- **Income Regularity**: Standard deviation of income intervals
- **Survival Rate**: Days with sufficient balance
- **Betting Ratio**: Percentage spent on gambling
- **Debt-to-Income**: Loan repayment patterns
- **Cash Withdrawal**: Cash-heavy behavior indicators

### 3. Active Monitoring
Post-approval, the system continuously monitors:
- Income drops (>20% decrease)
- Betting activity spikes (>250% increase)
- Liquidity deterioration (survival rate <50% of historical)
- Spending pattern anomalies

## 🛡️ Security

- API keys stored in `.env` (never commit this file)
- CORS configured for frontend communication
- Input validation on all endpoints
- SQL injection protection via SQLAlchemy ORM
- Environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Mono/Okra**: Open banking infrastructure for African markets
- **OpenAI**: LLM capabilities for explainable AI
- **Twilio**: SMS notification service
- **FastAPI**: Modern Python web framework
- **React**: Frontend UI library

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/Sammione/Lendrisk/issues
- Email: support@lendrisk.com

## 🗺️ Roadmap

- [ ] PostgreSQL migration support
- [ ] Docker containerization
- [ ] Real Mono/Okra API integration
- [ ] Multi-user authentication system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Automated reporting
- [ ] Credit bureau integration

---

**Built with ❤️ for African micro-lending institutions**
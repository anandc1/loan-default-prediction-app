# Loan Default Risk Predictor

A full-stack machine learning application that predicts loan default risk using financial data. Built with React frontend, FastAPI backend, and scikit-learn ML model.

## 🚀 Live Demo

- **Frontend Application**: https://prediction-app-lzuu8er9.devinapps.com/
- **Backend API**: https://app-xcblilfh.fly.dev/

## 📋 Features

- **Real-time ML Predictions**: Logistic Regression model predicts loan default probability
- **Risk Assessment**: Categorizes risk as Low, Medium, or High with confidence scores
- **Professional UI**: Clean, responsive React interface with Tailwind CSS
- **RESTful API**: FastAPI backend with automatic documentation
- **Financial Insights**: Provides actionable recommendations based on risk level

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons

### Backend
- **FastAPI** (Python)
- **scikit-learn** for machine learning
- **pandas** & **numpy** for data processing
- **Pydantic** for data validation

### Deployment
- **Frontend**: Devin Apps
- **Backend**: Fly.io

## 🧠 Machine Learning Model

The application uses a **Logistic Regression** model trained on synthetic loan data with features including:

- Age and employment history
- Income and debt-to-income ratio
- Credit score and previous defaults
- Loan amount and term
- Home ownership status
- Savings account balance

The model provides:
- **Default Probability**: Percentage likelihood of default
- **Risk Level**: Low (<30%), Medium (30-60%), High (>60%)
- **Confidence Score**: Model certainty in the prediction

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- Python 3.12+
- Poetry (for Python dependency management)

### Backend Setup

```bash
cd prediction-backend
poetry install
poetry run fastapi dev app/main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd prediction-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## 📡 API Endpoints

- `GET /` - API information and available endpoints
- `GET /health` - Health check with model status
- `GET /model-info` - ML model details and features
- `POST /predict` - Loan default prediction endpoint
- `POST /retrain` - Retrain the ML model

### Prediction Request Example

```json
{
  "age": 35,
  "income": 75000,
  "loan_amount": 25000,
  "credit_score": 720,
  "employment_years": 8.5,
  "debt_to_income_ratio": 0.30,
  "loan_term_months": 36,
  "home_ownership": 1,
  "loan_purpose": 0,
  "previous_defaults": 0,
  "credit_inquiries_6m": 1,
  "savings_account_balance": 15000
}
```

### Prediction Response Example

```json
{
  "default_probability": 0.123,
  "risk_level": "Low",
  "confidence_score": 0.856
}
```

## 🚀 Deployment

### Backend Deployment (Fly.io)

```bash
cd prediction-backend
# Deploy using Devin's deploy command or fly.io CLI
```

### Frontend Deployment

```bash
cd prediction-frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🎯 Use Cases

Perfect for demonstrating:
- **Financial Technology** applications
- **Machine Learning** in production
- **Full-stack development** skills
- **Risk Assessment** systems
- **Startup/Fintech** portfolio projects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built by [@anandc1](https://github.com/anandc1) with assistance from Devin AI.

**Devin Session**: https://app.devin.ai/sessions/dfa8b4b68a4140ffac723b44a8519185

---

*This application demonstrates production-ready ML deployment with modern web technologies, perfect for showcasing to startup CEOs and technical recruiters.*

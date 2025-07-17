import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface FormData {
  age: string;
  income: string;
  loan_amount: string;
  credit_score: string;
  employment_years: string;
  debt_to_income_ratio: string;
  loan_term_months: string;
  home_ownership: string;
  loan_purpose: string;
  previous_defaults: string;
  credit_inquiries_6m: string;
  savings_account_balance: string;
}

interface PredictionResult {
  default_probability: number;
  risk_level: string;
  confidence_score: number;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    income: '',
    loan_amount: '',
    credit_score: '',
    employment_years: '',
    debt_to_income_ratio: '',
    loan_term_months: '',
    home_ownership: '',
    loan_purpose: '',
    previous_defaults: '',
    credit_inquiries_6m: '',
    savings_account_balance: ''
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://app-xcblilfh.fly.dev/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          income: parseFloat(formData.income),
          loan_amount: parseFloat(formData.loan_amount),
          credit_score: parseInt(formData.credit_score),
          employment_years: parseFloat(formData.employment_years),
          debt_to_income_ratio: parseFloat(formData.debt_to_income_ratio),
          loan_term_months: parseInt(formData.loan_term_months),
          home_ownership: parseInt(formData.home_ownership),
          loan_purpose: parseInt(formData.loan_purpose),
          previous_defaults: parseInt(formData.previous_defaults),
          credit_inquiries_6m: parseInt(formData.credit_inquiries_6m),
          savings_account_balance: parseFloat(formData.savings_account_balance)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Medium': return <TrendingUp className="h-5 w-5 text-yellow-600" />;
      case 'High': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Loan Default Risk Predictor</h1>
          <p className="text-lg text-gray-600">AI-powered financial risk assessment for loan applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application Details</CardTitle>
              <CardDescription>Enter the applicant's financial information to assess default risk</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="35"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit_score">Credit Score</Label>
                    <Input
                      id="credit_score"
                      type="number"
                      value={formData.credit_score}
                      onChange={(e) => handleInputChange('credit_score', e.target.value)}
                      placeholder="720"
                      min="300"
                      max="850"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="income">Annual Income ($)</Label>
                    <Input
                      id="income"
                      type="number"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                      placeholder="75000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="loan_amount">Loan Amount ($)</Label>
                    <Input
                      id="loan_amount"
                      type="number"
                      value={formData.loan_amount}
                      onChange={(e) => handleInputChange('loan_amount', e.target.value)}
                      placeholder="25000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employment_years">Employment Years</Label>
                    <Input
                      id="employment_years"
                      type="number"
                      step="0.1"
                      value={formData.employment_years}
                      onChange={(e) => handleInputChange('employment_years', e.target.value)}
                      placeholder="8.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="debt_to_income_ratio">Debt-to-Income Ratio</Label>
                    <Input
                      id="debt_to_income_ratio"
                      type="number"
                      step="0.01"
                      value={formData.debt_to_income_ratio}
                      onChange={(e) => handleInputChange('debt_to_income_ratio', e.target.value)}
                      placeholder="0.30"
                      min="0"
                      max="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loan_term_months">Loan Term (Months)</Label>
                    <Select onValueChange={(value) => handleInputChange('loan_term_months', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="home_ownership">Home Ownership</Label>
                    <Select onValueChange={(value) => handleInputChange('home_ownership', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Rent</SelectItem>
                        <SelectItem value="1">Own</SelectItem>
                        <SelectItem value="2">Mortgage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loan_purpose">Loan Purpose</Label>
                    <Select onValueChange={(value) => handleInputChange('loan_purpose', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Personal</SelectItem>
                        <SelectItem value="1">Business</SelectItem>
                        <SelectItem value="2">Education</SelectItem>
                        <SelectItem value="3">Home</SelectItem>
                        <SelectItem value="4">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="previous_defaults">Previous Defaults</Label>
                    <Input
                      id="previous_defaults"
                      type="number"
                      value={formData.previous_defaults}
                      onChange={(e) => handleInputChange('previous_defaults', e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credit_inquiries_6m">Credit Inquiries (6 months)</Label>
                    <Input
                      id="credit_inquiries_6m"
                      type="number"
                      value={formData.credit_inquiries_6m}
                      onChange={(e) => handleInputChange('credit_inquiries_6m', e.target.value)}
                      placeholder="1"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="savings_account_balance">Savings Balance ($)</Label>
                    <Input
                      id="savings_account_balance"
                      type="number"
                      value={formData.savings_account_balance}
                      onChange={(e) => handleInputChange('savings_account_balance', e.target.value)}
                      placeholder="15000"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Analyzing...' : 'Predict Default Risk'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>AI-powered loan default prediction results</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {prediction && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getRiskIcon(prediction.risk_level)}
                      <span className={`ml-2 text-2xl font-bold ${getRiskColor(prediction.risk_level)}`}>
                        {prediction.risk_level} Risk
                      </span>
                    </div>
                    <p className="text-gray-600">Default Probability: {(prediction.default_probability * 100).toFixed(1)}%</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Risk Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Default Probability:</span>
                        <span className="font-medium">{(prediction.default_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Level:</span>
                        <span className={`font-medium ${getRiskColor(prediction.risk_level)}`}>
                          {prediction.risk_level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Score:</span>
                        <span className="font-medium">{(prediction.confidence_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                    <p className="text-blue-800 text-sm">
                      {prediction.risk_level === 'Low' && 
                        'This applicant shows low default risk. Consider approving the loan with standard terms.'}
                      {prediction.risk_level === 'Medium' && 
                        'This applicant shows moderate default risk. Consider additional verification or adjusted terms.'}
                      {prediction.risk_level === 'High' && 
                        'This applicant shows high default risk. Consider declining or requiring additional collateral.'}
                    </p>
                  </div>
                </div>
              )}

              {!prediction && !error && (
                <div className="text-center text-gray-500 py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter loan application details to get a risk assessment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;

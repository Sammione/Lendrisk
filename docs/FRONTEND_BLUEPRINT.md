# Dashboard UI Blueprint: Lendrisk Intelligence

## Layout Strategy (React + Tailwind)

### 1. Unified Side Navigation
Left sidebar with:
- **Global Pulse**: Overview of the bank's active loan portfolio.
- **Risk Mapping**: Geographical or category-based risk clusters.
- **Borrower List**: Search and filter by score or status.
- **Alert Center (Active Monitoring)**: Red/Orange dot for drift/anomaly alerts.

### 2. Borrower Risk Profile (The "Explainable" Detail View)
The primary layout for detailed analysis of a single applicant.

#### Component Structure:
- **Header Card**: 
    - `BorrowerBadge`: (Name, Photo, Income Source, ID).
    - `RiskScoreDial`: (Semi-circle gauge 0–100, colored Green to Red).
    - `StatusBadge`: (e.g., "Approved", "In Review", "High Alert").
  
- **Trends Grid (Recharts)**:
    - `IncomeStabilityChart`: Bar chart with month-on-month deposits vs spending overlap.
    - `SpendingCategorization`: Pie chart with breakdown (Airtime, Gambling, Food, Cash).
    - `SurvivalTrend`: Line chart showing days until zero balance across last 3–6 months.

- **Intelligence Section**:
    - `LLMInsightsPanel**: Box with human-readable text explaining the score ("Why is it 72 points?").
    - `RiskFactorsTable**: List of positive and negative behavioral indicators.
    - `ActionButtons**: (Approve, Reject, Request More Data, Set Up Watchlist).

- **Monitoring Timeline**:
    - `DriftActivityFeed**: Feed of alerts (e.g., "APR 04: Income dropped by 30% — Warning triggered").

### 3. Suggested React Components
```jsx
// Example Structure
const BorrowerDashboard = () => (
  <div className="flex h-screen bg-slate-900 text-white">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-8">
      <header className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold font-outfit">Borrower Intelligence Profile</h1>
        <div className="text-slate-400">ID: #LEN-091220</div>
      </header>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Stats */}
        <div className="col-span-8 space-y-6">
          <BehavioralCharts data={transactionHistory} />
          <TransactionFeed transactions={recentList} />
        </div>
        
        {/* Right Column: Decisions */}
        <div className="col-span-4 space-y-6">
          <RiskScoreCard score={72} />
          <AIInsightsPanel content={explanationText} />
          <DecisionControls onApprove={handleApprove} />
        </div>
      </div>
    </main>
  </div>
);
```

### 4. Interactive Palette (Rich Aesthetics)
- **Primary Color**: Deep Emerald (`#10b981`) for positive actions.
- **Danger Color**: Crimson (`#ef4444`) for high-risk alerts.
- **Background**: Dark Slate (`#0f172a`) to ensure long-term readability for bank officers.
- **Active Accents**: Indigo (`#6366f1`) for UI highlights.

---
**Design Choice**: We prioritize the **RiskScoreDial** and **AIInsightsPanel** at the top right to enable "First-Second Decision Support".

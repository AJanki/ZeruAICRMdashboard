import { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Initial Data ────────────────────────────────────────────────────────────
const initialWeekly = [
  { period: "W1 Jan", arr: 8, deals: 2, agentScan: 55000, zScore: 300, zaps: 12, ecosystems: 11 },
  { period: "W2 Jan", arr: 12, deals: 3, agentScan: 58000, zScore: 305, zaps: 15, ecosystems: 12 },
  { period: "W3 Jan", arr: 15, deals: 4, agentScan: 62000, zScore: 310, zaps: 17, ecosystems: 13 },
  { period: "W4 Jan", arr: 18, deals: 5, agentScan: 65000, zScore: 315, zaps: 20, ecosystems: 13 },
  { period: "W1 Feb", arr: 22, deals: 6, agentScan: 67000, zScore: 318, zaps: 22, ecosystems: 14 },
  { period: "W2 Feb", arr: 26, deals: 8, agentScan: 68500, zScore: 319, zaps: 25, ecosystems: 15 },
  { period: "W3 Feb", arr: 30, deals: 9, agentScan: 69800, zScore: 320, zaps: 28, ecosystems: 16 },
  { period: "W4 Feb", arr: 34, deals: 11, agentScan: 70243, zScore: 320, zaps: 30, ecosystems: 17 },
];

const initialMonthly = [
  { period: "Oct", arr: 5, deals: 2, agentScan: 12000, zScore: 180, zaps: 5, ecosystems: 2 },
  { period: "Nov", arr: 10, deals: 4, agentScan: 28000, zScore: 220, zaps: 9, ecosystems: 4 },
  { period: "Dec", arr: 18, deals: 7, agentScan: 41000, zScore: 260, zaps: 14, ecosystems: 7 },
  { period: "Jan", arr: 25, deals: 11, agentScan: 55000, zScore: 295, zaps: 20, ecosystems: 11 },
  { period: "Feb", arr: 34, deals: 14, agentScan: 70243, zScore: 320, zaps: 30, ecosystems: 17 },
  { period: "Mar", arr: 42, deals: 17, agentScan: 78500, zScore: 338, zaps: 36, ecosystems: 19 },
];

const initialQuarterly = [
  { period: "Q1 2024", arr: 8, deals: 3, agentScan: 5000, zScore: 120, zaps: 3, ecosystems: 2 },
  { period: "Q2 2024", arr: 14, deals: 6, agentScan: 18000, zScore: 200, zaps: 8, ecosystems: 5 },
  { period: "Q3 2024", arr: 22, deals: 9, agentScan: 35000, zScore: 260, zaps: 15, ecosystems: 9 },
  { period: "Q4 2024", arr: 32, deals: 13, agentScan: 55000, zScore: 300, zaps: 24, ecosystems: 14 },
  { period: "Q1 2025", arr: 45, deals: 18, agentScan: 78500, zScore: 340, zaps: 38, ecosystems: 20 },
];

const initialPipeline = [
  { id: 1,  name: "Imua",          product: "zScore",    valueProp: "Filtration of airdrops",          stage: "Proposal Sent",  lastTouch: "31 Jan", status: "Dates Awaited",  coMarketing: "No",  order: "",                 payment: "",                value: 75000 },
  { id: 2,  name: "Paradex",       product: "zScore",    valueProp: "Filtration of airdrops",          stage: "Proposal Sent",  lastTouch: "23 Dec", status: "Dates Awaited",  coMarketing: "No",  order: "",                 payment: "",                value: 15000 },
  { id: 3,  name: "Citrea",        product: "zScore",    valueProp: "Filtration of airdrops",          stage: "Proposal Sent",  lastTouch: "2 Mar",  status: "Dates Awaited",  coMarketing: "No",  order: "",                 payment: "Advance Received",value: 3500  },
  { id: 4,  name: "Gaib",          product: "zScore",    valueProp: "Filtration of airdrops",          stage: "Proposal Sent",  lastTouch: "5 Dec",  status: "Interested",     coMarketing: "Yes", order: "Order Confirmed",  payment: "Payment Received",value: 9584  },
  { id: 5,  name: "Hydrex",        product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "6 Feb",  status: "Not Interested", coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 6,  name: "Sai/Nibiru",    product: "Zaps",      valueProp: "Grow user base",                  stage: "Proposal Sent",  lastTouch: "18 Feb", status: "Dates Awaited",  coMarketing: "No",  order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 7,  name: "Ostium",        product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "2 Mar",  status: "Not Interested", coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 8,  name: "Alien Base",    product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 9,  name: "Folks Finance", product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "4 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 10, name: "Upscale",       product: "zScore",    valueProp: "Filtration of wallets/airdrops",  stage: "Proposal Sent",  lastTouch: "28 Jan", status: "Negotiation",    coMarketing: "Yes", order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 11, name: "Xybit",         product: "zScore",    valueProp: "Filtration of wallets/airdrops",  stage: "In Discussion",  lastTouch: "23 Dec", status: "Not Interested", coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 12, name: "EQR",           product: "zScore",    valueProp: "Filtration of wallets/airdrops",  stage: "In Discussion",  lastTouch: "",       status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 13, name: "Celo",          product: "All",       valueProp: "All",                             stage: "Proposal Sent",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 14, name: "Monad",         product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 15, name: "Push",          product: "All",       valueProp: "All",                             stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 16, name: "Base",          product: "AgentScan", valueProp: "Agents",                          stage: "In Discussion",  lastTouch: "25 Feb", status: "Interested",     coMarketing: "Yes", order: "NA",               payment: "",                value: 0     },
  { id: 17, name: "BNB",           product: "All",       valueProp: "All",                             stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 18, name: "Spiral Stake",  product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 19, name: "Yap.Market",    product: "zScore",    valueProp: "",                                stage: "Proposal Sent",  lastTouch: "",       status: "Dates Awaited",  coMarketing: "",    order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 20, name: "Unloo",         product: "zScore",    valueProp: "Filtration of wallets/airdrops",  stage: "Proposal Sent",  lastTouch: "17 Feb", status: "Negotiation",    coMarketing: "Yes", order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 21, name: "Pulse Trader",  product: "zScore",    valueProp: "",                                stage: "Proposal Sent",  lastTouch: "",       status: "Dates Awaited",  coMarketing: "",    order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 22, name: "Javin",         product: "zScore",    valueProp: "Filtration of wallets/airdrops",  stage: "In Discussion",  lastTouch: "11 Dec", status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 23, name: "Stormbit",      product: "All",       valueProp: "All",                             stage: "In Discussion",  lastTouch: "3 Mar",  status: "Interested",     coMarketing: "No",  order: "NA",               payment: "",                value: 0     },
  { id: 24, name: "Katana",        product: "Zaps",      valueProp: "Grow user base",                  stage: "In Discussion",  lastTouch: "9 Jan",  status: "Not Interested", coMarketing: "NA",  order: "NA",               payment: "",                value: 0     },
  { id: 25, name: "Polygon",       product: "All",       valueProp: "All",                             stage: "In Discussion",  lastTouch: "20 Feb", status: "Interested",     coMarketing: "NA",  order: "NA",               payment: "",                value: 0     },
  { id: 26, name: "Pancakeswap",   product: "zScore",    valueProp: "",                                stage: "Proposal Sent",  lastTouch: "",       status: "Dates Awaited",  coMarketing: "",    order: "Order Confirmed",  payment: "",                value: 0     },
  { id: 27, name: "Arbitrum",      product: "All",       valueProp: "",                                stage: "Proposal Sent",  lastTouch: "",       status: "Dates Awaited",  coMarketing: "",    order: "",                 payment: "",                value: 0     },
  { id: 28, name: "Solana",        product: "All",       valueProp: "",                                stage: "Identified",     lastTouch: "",       status: "",               coMarketing: "",    order: "",                 payment: "",                value: 0     },
];

const STAGES = ["Identified", "Outreach", "In Discussion", "Proposal Sent", "Active", "Closed Won"];
const PRODUCTS = ["AgentScan", "zScore", "Zaps", "Zapperboards"];
const ECOSYSTEMS = ["Base", "Arbitrum", "Celo", "MegaETH", "Solana", "Casper", "Other"];
const VIEWS = ["Weekly", "Monthly", "Quarterly"];
const TABS = ["Overview", "Scouting", "Pipeline", "Product Adoption", "Ecosystems", "Data Entry"];
const SCOUT_STAGES = ["Identified", "Researching", "Outreach Sent", "Response Received", "Qualified", "Converted"];
const SCOUT_STAGE_COLORS = { "Identified": "#334155", "Researching": "#1e40af", "Outreach Sent": "#b45309", "Response Received": "#7c3aed", "Qualified": "#065f46", "Converted": "#00FFCC" };

const initialScouting = [
  { id: 101, name: "dYdX",       category: "DeFi / DEX",     product: "zScore",    source: "Twitter",   scoutedOn: "1 Mar",  stage: "Researching",       notes: "High airdrop volume, good fit" },
  { id: 102, name: "Drift",      category: "DeFi / Perps",   product: "Zaps",      source: "Telegram",  scoutedOn: "2 Mar",  stage: "Outreach Sent",     notes: "Active community, needs user growth" },
  { id: 103, name: "Hyperliquid",category: "DeFi / Perps",   product: "zScore",    source: "Research",  scoutedOn: "3 Mar",  stage: "Identified",        notes: "Growing TVL, potential airdrop" },
  { id: 104, name: "Zora",       category: "NFT / Creator",  product: "AgentScan", source: "Discord",   scoutedOn: "5 Mar",  stage: "Response Received", notes: "Interested in agent indexing" },
  { id: 105, name: "Frax",       category: "DeFi / Stables", product: "zScore",    source: "Research",  scoutedOn: "6 Mar",  stage: "Qualified",         notes: "Strong wallet base, ready to pitch" },
];

const STAGE_COLORS = {
  "Identified": "#334155", "Outreach": "#1e40af", "In Discussion": "#b45309",
  "Proposal Sent": "#7c3aed", "Active": "#065f46", "Closed Won": "#00FFCC"
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}k` : n;
const fmtArr = (n) => `$${n}k`;

const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#060F1A", border: "1px solid rgba(0,255,204,0.25)", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 12 }}>
      <div style={{ color: "#00FFCC", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: "#acd4c8", marginBottom: 2 }}>
          <span style={{ color: p.color || "#00FFCC" }}>■ </span>{p.name}: <b style={{ color: "#fff" }}>{typeof p.value === "number" && p.value > 999 ? fmt(p.value) : p.value}</b>
        </div>
      ))}
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: 22, ...style
  }}>{children}</div>
);

const CardTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2f0ec", letterSpacing: "0.02em" }}>{title}</div>
    {sub && <div style={{ fontSize: 11, color: "rgba(204,232,224,0.38)", fontFamily: "monospace", marginTop: 2 }}>{sub}</div>}
  </div>
);

const Input = ({ value, onChange, type = "text", placeholder, style = {} }) => (
  <input
    value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
    style={{
      background: "rgba(0,255,204,0.05)", border: "1px solid rgba(0,255,204,0.18)",
      borderRadius: 7, padding: "8px 12px", color: "#e2f0ec", fontSize: 12,
      fontFamily: "monospace", outline: "none", width: "100%", boxSizing: "border-box", ...style
    }}
  />
);

const Select = ({ value, onChange, options, style = {} }) => (
  <select
    value={value} onChange={e => onChange(e.target.value)}
    style={{
      background: "#060F1A", border: "1px solid rgba(0,255,204,0.18)",
      borderRadius: 7, padding: "8px 12px", color: "#e2f0ec", fontSize: 12,
      fontFamily: "monospace", outline: "none", width: "100%", boxSizing: "border-box", cursor: "pointer", ...style
    }}
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Btn = ({ onClick, children, variant = "primary", style = {} }) => (
  <button onClick={onClick} style={{
    padding: "8px 18px", borderRadius: 7, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
    background: variant === "primary" ? "rgba(0,255,204,0.15)" : "rgba(255,255,255,0.06)",
    color: variant === "primary" ? "#00FFCC" : "rgba(204,232,224,0.6)",
    border: variant === "primary" ? "1px solid rgba(0,255,204,0.3)" : "1px solid rgba(255,255,255,0.08)",
    ...style
  }}>{children}</button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ZeruBDDashboard() {
  const [tab, setTab] = useState("Overview");
  const [view, setView] = useState("Monthly");
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [weekly, setWeekly] = useState(initialWeekly);
  const [monthly, setMonthly] = useState(initialMonthly);
  const [quarterly, setQuarterly] = useState(initialQuarterly);
  const [editingDeal, setEditingDeal] = useState(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: "", stage: "Identified", value: "", product: "zScore", valueProp: "", lastTouch: "", status: "", coMarketing: "", order: "", payment: "" });
  const [newDataRow, setNewDataRow] = useState({ period: "", arr: "", deals: "", agentScan: "", zScore: "", zaps: "", ecosystems: "" });
  const [editingRowIdx, setEditingRowIdx] = useState(null);
  const [scouting, setScouting] = useState(initialScouting);
  const [editingScout, setEditingScout] = useState(null);
  const [showAddScout, setShowAddScout] = useState(false);
  const [newScout, setNewScout] = useState({ name: "", category: "", product: "zScore", source: "", scoutedOn: "", stage: "Identified", notes: "" });

  const dataMap = { Weekly: weekly, Monthly: monthly, Quarterly: quarterly };
  const setDataMap = { Weekly: setWeekly, Monthly: setMonthly, Quarterly: setQuarterly };
  const activeData = dataMap[view];

  const latest = activeData[activeData.length - 1] || {};
  const prev = activeData[activeData.length - 2] || {};
  const delta = (key) => prev[key] ? ((latest[key] - prev[key]) / prev[key] * 100).toFixed(1) : "—";

  const kpis = [
    { label: "ARR", value: fmtArr(latest.arr || 0), delta: `${delta("arr")}%`, sub: "Annual Recurring Revenue" },
    { label: "Active Deals", value: pipeline.filter(d => d.stage !== "Identified").length, delta: `${pipeline.length} total`, sub: "Pipeline deals" },
    { label: "AgentScan", value: fmt(latest.agentScan || 0), delta: `${delta("agentScan")}%`, sub: "AI agents indexed" },
    { label: "zScore", value: `${latest.zScore || 0}M`, delta: `${delta("zScore")}%`, sub: "Wallets scored" },
    { label: "Zaps Deployed", value: latest.zaps || 0, delta: `${delta("zaps")}%`, sub: "Behavioral intelligence" },
    { label: "Ecosystems", value: latest.ecosystems || 0, delta: `${delta("ecosystems")}%`, sub: "Active integrations" },
  ];

  const stageCount = STAGES.reduce((a, s) => ({ ...a, [s]: pipeline.filter(d => d.stage === s).length }), {});
  const stageData = STAGES.map(s => ({ stage: s, count: stageCount[s] || 0 }));

  const ecoData = ECOSYSTEMS.map(e => ({
    ecosystem: e,
    deals: pipeline.filter(d => d.ecosystem === e).length,
    value: pipeline.filter(d => d.ecosystem === e).reduce((a, d) => a + Number(d.value), 0),
  })).filter(e => e.deals > 0);

  const productData = PRODUCTS.map(p => ({
    product: p,
    deals: pipeline.filter(d => d.product === p).length,
  }));

  const addDeal = () => {
    if (!newDeal.name) return;
    setPipeline(prev => [...prev, { ...newDeal, id: Date.now(), value: Number(newDeal.value) || 0 }]);
    setNewDeal({ name: "", stage: "Identified", value: "", product: "zScore", ecosystem: "Other", date: "" });
    setShowAddDeal(false);
  };

  const updateDeal = (id, field, val) => {
    setPipeline(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  const deleteDeal = (id) => setPipeline(prev => prev.filter(d => d.id !== id));

  const addScout = () => {
    if (!newScout.name) return;
    setScouting(prev => [...prev, { ...newScout, id: Date.now() }]);
    setNewScout({ name: "", category: "", product: "zScore", source: "", scoutedOn: "", stage: "Identified", notes: "" });
    setShowAddScout(false);
  };
  const updateScout = (id, field, val) => setScouting(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  const deleteScout = (id) => setScouting(prev => prev.filter(s => s.id !== id));
  const convertToPipeline = (scout) => {
    setPipeline(prev => [...prev, {
      id: Date.now(), name: scout.name, product: scout.product,
      valueProp: "", stage: "Outreach", lastTouch: scout.scoutedOn,
      status: "Interested", coMarketing: "", order: "", payment: "", value: 0
    }]);
    setScouting(prev => prev.map(s => s.id === scout.id ? { ...s, stage: "Converted" } : s));
    setTab("Pipeline");
  };

  const addDataRow = () => {
    if (!newDataRow.period) return;
    const row = { ...newDataRow };
    Object.keys(row).forEach(k => { if (k !== "period") row[k] = Number(row[k]) || 0; });
    setDataMap[view](prev => [...prev, row]);
    setNewDataRow({ period: "", arr: "", deals: "", agentScan: "", zScore: "", zaps: "", ecosystems: "" });
  };

  const updateDataRow = (idx, field, val) => {
    setDataMap[view](prev => prev.map((r, i) => i === idx ? { ...r, [field]: field === "period" ? val : Number(val) || 0 } : r));
  };

  const deleteDataRow = (idx) => {
    setDataMap[view](prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#030D16", color: "#cce8e0",
      fontFamily: "'Syne', 'Helvetica Neue', sans-serif",
      position: "relative", overflowX: "hidden",
    }}>
      {/* BG Grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,255,204,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,204,0.06) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -150, left: -150, width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,100,255,0.04) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #00FFCC 0%, #004d3a 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16, color: "#030D16", letterSpacing: "-0.05em",
            }}>Z</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>ZeruAI <span style={{ color: "#00FFCC" }}>BD</span></div>
              <div style={{ fontSize: 11, color: "rgba(204,232,224,0.38)", fontFamily: "monospace" }}>Business Growth Tracker</div>
            </div>
          </div>

          {/* View Toggle */}
          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
            {VIEWS.map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                background: view === v ? "rgba(0,255,204,0.15)" : "transparent",
                color: view === v ? "#00FFCC" : "rgba(204,232,224,0.35)",
                border: view === v ? "1px solid rgba(0,255,204,0.25)" : "1px solid transparent",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "16px 16px 14px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(0,255,204,${0.25 + i*0.05}), transparent)` }} />
              <div style={{ fontSize: 10, color: "rgba(204,232,224,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 4 }}>{k.value}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "#00FFCC", fontFamily: "monospace" }}>{k.delta}</span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(204,232,224,0.28)", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.06)", width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600,
              background: tab === t ? "rgba(0,255,204,0.14)" : "transparent",
              color: tab === t ? "#00FFCC" : "rgba(204,232,224,0.38)",
              border: tab === t ? "1px solid rgba(0,255,204,0.22)" : "1px solid transparent",
            }}>{t}</button>
          ))}
        </div>

        {/* ════════════════ OVERVIEW ════════════════ */}
        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <CardTitle title="ARR Growth" sub={`${view} — $k`} />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="arrG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFCC" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#00FFCC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}k`} />
                  <Tooltip content={<Tooltip_ />} />
                  <Area type="monotone" dataKey="arr" name="ARR ($k)" stroke="#00FFCC" strokeWidth={2.5} fill="url(#arrG)" dot={{ fill: "#00FFCC", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="Pipeline Deal Count" sub={`${view} — closed + active`} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activeData} barSize={22}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Bar dataKey="deals" name="Deals" fill="rgba(0,255,204,0.55)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="AgentScan + Zaps Growth" sub="Product adoption over time" />
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activeData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Line yAxisId="left" type="monotone" dataKey="agentScan" name="AgentScan" stroke="#00FFCC" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="zaps" name="Zaps" stroke="#38bdf8" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="Ecosystem Integrations" sub="Active integrations over time" />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="ecoG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Area type="monotone" dataKey="ecosystems" name="Ecosystems" stroke="#38bdf8" strokeWidth={2.5} fill="url(#ecoG)" dot={{ fill: "#38bdf8", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ════════════════ SCOUTING ════════════════ */}
        {tab === "Scouting" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
              {SCOUT_STAGES.map((s, i) => (
                <div key={s} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${Object.values(SCOUT_STAGE_COLORS)[i]}88, transparent)` }} />
                  <div style={{ fontSize: 9, color: "rgba(204,232,224,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", marginBottom: 6 }}>{s}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{scouting.filter(x => x.stage === s).length}</div>
                </div>
              ))}
            </div>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <CardTitle title="Scouting & Sourcing Pipeline" sub={`${scouting.length} prospects tracked · ${scouting.filter(s => s.stage === "Converted").length} converted to deals`} />
                <Btn onClick={() => setShowAddScout(!showAddScout)}>+ Add Prospect</Btn>
              </div>

              {showAddScout && (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 16, padding: 14, background: "rgba(0,255,204,0.04)", borderRadius: 9, border: "1px solid rgba(0,255,204,0.12)" }}>
                  <Input value={newScout.name} onChange={v => setNewScout(p => ({ ...p, name: v }))} placeholder="Project name" />
                  <Input value={newScout.category} onChange={v => setNewScout(p => ({ ...p, category: v }))} placeholder="Category (e.g. DeFi)" />
                  <Select value={newScout.product} onChange={v => setNewScout(p => ({ ...p, product: v }))} options={[...PRODUCTS, "All"]} />
                  <Input value={newScout.source} onChange={v => setNewScout(p => ({ ...p, source: v }))} placeholder="Source (e.g. Twitter)" />
                  <Input value={newScout.scoutedOn} onChange={v => setNewScout(p => ({ ...p, scoutedOn: v }))} placeholder="Date (e.g. 12 Mar)" />
                  <Select value={newScout.stage} onChange={v => setNewScout(p => ({ ...p, stage: v }))} options={SCOUT_STAGES} />
                  <Btn onClick={addScout}>Save</Btn>
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 900 }}>
                  <thead>
                    <tr>
                      {["#", "Project", "Category", "Product", "Source", "Scouted On", "Stage", "Notes", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(204,232,224,0.38)", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scouting.map((s, idx) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: s.stage === "Converted" ? 0.45 : 1 }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,204,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.28)", fontFamily: "monospace", fontSize: 11 }}>{idx + 1}</td>
                        <td style={{ padding: "9px 10px" }}>
                          {editingScout === s.id ? <Input value={s.name} onChange={v => updateScout(s.id, "name", v)} />
                            : <span style={{ color: "#e2f0ec", fontWeight: 700, whiteSpace: "nowrap" }}>{s.name}</span>}
                        </td>
                        <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.5)", fontSize: 11 }}>
                          {editingScout === s.id ? <Input value={s.category} onChange={v => updateScout(s.id, "category", v)} /> : s.category}
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          {editingScout === s.id ? <Select value={s.product} onChange={v => updateScout(s.id, "product", v)} options={[...PRODUCTS, "All"]} />
                            : <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.15)", color: "#00FFCC", fontFamily: "monospace" }}>{s.product}</span>}
                        </td>
                        <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.45)", fontFamily: "monospace", fontSize: 11 }}>
                          {editingScout === s.id ? <Input value={s.source} onChange={v => updateScout(s.id, "source", v)} /> : s.source}
                        </td>
                        <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.45)", fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                          {editingScout === s.id ? <Input value={s.scoutedOn} onChange={v => updateScout(s.id, "scoutedOn", v)} /> : s.scoutedOn}
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          {editingScout === s.id ? <Select value={s.stage} onChange={v => updateScout(s.id, "stage", v)} options={SCOUT_STAGES} />
                            : <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10, fontFamily: "monospace", background: `${SCOUT_STAGE_COLORS[s.stage]}33`, color: "#e2f0ec", border: `1px solid ${SCOUT_STAGE_COLORS[s.stage]}66`, whiteSpace: "nowrap" }}>{s.stage}</span>}
                        </td>
                        <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.45)", fontSize: 11, maxWidth: 180 }}>
                          {editingScout === s.id ? <Input value={s.notes} onChange={v => updateScout(s.id, "notes", v)} /> : s.notes}
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          <div style={{ display: "flex", gap: 5, flexWrap: "nowrap" }}>
                            {s.stage !== "Converted" && (
                              <button onClick={() => convertToPipeline(s)}
                                style={{ background: "rgba(0,255,204,0.12)", border: "1px solid rgba(0,255,204,0.3)", borderRadius: 5, color: "#00FFCC", fontSize: 10, cursor: "pointer", padding: "3px 8px", whiteSpace: "nowrap" }}>
                                → Pipeline
                              </button>
                            )}
                            {s.stage === "Converted" && (
                              <span style={{ fontSize: 10, color: "#00FFCC", fontFamily: "monospace", padding: "3px 8px" }}>✓ Converted</span>
                            )}
                            <button onClick={() => setEditingScout(editingScout === s.id ? null : s.id)}
                              style={{ background: "none", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 5, color: "#00FFCC", fontSize: 10, cursor: "pointer", padding: "3px 7px" }}>
                              {editingScout === s.id ? "Done" : "Edit"}
                            </button>
                            <button onClick={() => deleteScout(s.id)}
                              style={{ background: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 5, color: "rgba(255,100,100,0.7)", fontSize: 10, cursor: "pointer", padding: "3px 7px" }}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════ PIPELINE ════════════════ */}
        {tab === "Pipeline" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Card>
                <CardTitle title="Pipeline by Stage" sub="Deal count per stage" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stageData} layout="vertical" barSize={16}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="stage" type="category" tick={{ fill: "rgba(204,232,224,0.55)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={<Tooltip_ />} />
                    <Bar dataKey="count" name="Deals" radius={[0, 5, 5, 0]}>
                      {stageData.map((e, i) => (
                        <rect key={i} fill={Object.values(STAGE_COLORS)[i] || "#00FFCC"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <CardTitle title="Pipeline Value by Stage ($k)" sub="Estimated deal values" />
                {STAGES.map(s => {
                  const deals = pipeline.filter(d => d.stage === s);
                  const total = deals.reduce((a, d) => a + Number(d.value), 0);
                  if (!deals.length) return null;
                  return (
                    <div key={s} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "rgba(204,232,224,0.65)", fontFamily: "monospace" }}>{s}</span>
                        <span style={{ fontSize: 11, color: "#00FFCC", fontFamily: "monospace" }}>${total}k · {deals.length} deal{deals.length > 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (total / 500) * 100)}%`, background: STAGE_COLORS[s] || "#00FFCC", borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Deal Table */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <CardTitle title="Deal Tracker" sub={`${pipeline.length} deals in pipeline`} />
                <Btn onClick={() => setShowAddDeal(!showAddDeal)}>+ Add Deal</Btn>
              </div>

              {showAddDeal && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr) auto", gap: 8, marginBottom: 16, padding: 14, background: "rgba(0,255,204,0.04)", borderRadius: 9, border: "1px solid rgba(0,255,204,0.12)" }}>
                  <Input value={newDeal.name} onChange={v => setNewDeal(p => ({ ...p, name: v }))} placeholder="Project name" />
                  <Select value={newDeal.product} onChange={v => setNewDeal(p => ({ ...p, product: v }))} options={[...PRODUCTS, "All"]} />
                  <Select value={newDeal.stage} onChange={v => setNewDeal(p => ({ ...p, stage: v }))} options={STAGES} />
                  <Input value={newDeal.lastTouch} onChange={v => setNewDeal(p => ({ ...p, lastTouch: v }))} placeholder="Last touch (e.g. 3 Mar)" />
                  <Input value={newDeal.status} onChange={v => setNewDeal(p => ({ ...p, status: v }))} placeholder="Status" />
                  <Input value={newDeal.value} onChange={v => setNewDeal(p => ({ ...p, value: v }))} type="number" placeholder="Deal value ($)" />
                  <Btn onClick={addDeal}>Save</Btn>
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 1100 }}>
                  <thead>
                    <tr>
                      {["#", "Project", "Product", "Value Prop", "Stage", "Last Touch", "Status", "Co-Mktg", "Order", "Payment", "Deal Value", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(204,232,224,0.38)", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pipeline.map((d, idx) => {
                      const statusColor = d.status === "Interested" ? "#00FFCC" : d.status === "Not Interested" ? "#f87171" : d.status === "Negotiation" ? "#fbbf24" : "rgba(204,232,224,0.45)";
                      return (
                        <tr key={d.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,204,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.28)", fontFamily: "monospace", fontSize: 11 }}>{idx + 1}</td>
                          <td style={{ padding: "9px 10px" }}>
                            {editingDeal === d.id ? <Input value={d.name} onChange={v => updateDeal(d.id, "name", v)} />
                              : <span style={{ color: "#e2f0ec", fontWeight: 700, whiteSpace: "nowrap" }}>{d.name}</span>}
                          </td>
                          <td style={{ padding: "9px 10px" }}>
                            {editingDeal === d.id ? <Select value={d.product} onChange={v => updateDeal(d.id, "product", v)} options={[...PRODUCTS, "All"]} />
                              : <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.15)", color: "#00FFCC", fontFamily: "monospace", whiteSpace: "nowrap" }}>{d.product}</span>}
                          </td>
                          <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.5)", fontSize: 11, maxWidth: 130 }}>
                            {editingDeal === d.id ? <Input value={d.valueProp || ""} onChange={v => updateDeal(d.id, "valueProp", v)} />
                              : d.valueProp}
                          </td>
                          <td style={{ padding: "9px 10px" }}>
                            {editingDeal === d.id ? <Select value={d.stage} onChange={v => updateDeal(d.id, "stage", v)} options={STAGES} />
                              : <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10, fontFamily: "monospace", background: `${STAGE_COLORS[d.stage]}33`, color: "#e2f0ec", border: `1px solid ${STAGE_COLORS[d.stage]}66`, whiteSpace: "nowrap" }}>{d.stage}</span>}
                          </td>
                          <td style={{ padding: "9px 10px", color: "rgba(204,232,224,0.45)", fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                            {editingDeal === d.id ? <Input value={d.lastTouch || ""} onChange={v => updateDeal(d.id, "lastTouch", v)} /> : d.lastTouch}
                          </td>
                          <td style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
                            {editingDeal === d.id ? <Input value={d.status || ""} onChange={v => updateDeal(d.id, "status", v)} />
                              : <span style={{ fontSize: 11, color: statusColor, fontFamily: "monospace" }}>{d.status}</span>}
                          </td>
                          <td style={{ padding: "9px 10px", textAlign: "center" }}>
                            {editingDeal === d.id ? <Input value={d.coMarketing || ""} onChange={v => updateDeal(d.id, "coMarketing", v)} />
                              : <span style={{ fontSize: 11, color: d.coMarketing === "Yes" ? "#00FFCC" : "rgba(204,232,224,0.28)", fontFamily: "monospace" }}>{d.coMarketing}</span>}
                          </td>
                          <td style={{ padding: "9px 10px", fontSize: 11, whiteSpace: "nowrap", color: d.order === "Order Confirmed" ? "#86efac" : "rgba(204,232,224,0.38)", fontFamily: "monospace" }}>
                            {editingDeal === d.id ? <Input value={d.order || ""} onChange={v => updateDeal(d.id, "order", v)} /> : d.order}
                          </td>
                          <td style={{ padding: "9px 10px", fontSize: 11, whiteSpace: "nowrap", color: d.payment === "Payment Received" ? "#00FFCC" : d.payment === "Advance Received" ? "#fbbf24" : "rgba(204,232,224,0.38)", fontFamily: "monospace" }}>
                            {editingDeal === d.id ? <Input value={d.payment || ""} onChange={v => updateDeal(d.id, "payment", v)} /> : d.payment}
                          </td>
                          <td style={{ padding: "9px 10px", color: "#00FFCC", fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>
                            {editingDeal === d.id ? <Input value={d.value} onChange={v => updateDeal(d.id, "value", v)} type="number" />
                              : d.value > 0 ? `$${Number(d.value).toLocaleString()}` : "—"}
                          </td>
                          <td style={{ padding: "9px 10px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => setEditingDeal(editingDeal === d.id ? null : d.id)}
                                style={{ background: "none", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 5, color: "#00FFCC", fontSize: 11, cursor: "pointer", padding: "3px 8px" }}>
                                {editingDeal === d.id ? "Done" : "Edit"}
                              </button>
                              <button onClick={() => deleteDeal(d.id)}
                                style={{ background: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 5, color: "rgba(255,100,100,0.7)", fontSize: 11, cursor: "pointer", padding: "3px 8px" }}>
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════ PRODUCT ADOPTION ════════════════ */}
        {tab === "Product Adoption" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <CardTitle title="AgentScan — AI Agent Registry" sub="Agents indexed on Base" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="agG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFCC" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00FFCC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                  <Tooltip content={<Tooltip_ />} />
                  <Area type="monotone" dataKey="agentScan" name="Agents" stroke="#00FFCC" strokeWidth={2.5} fill="url(#agG)" dot={{ fill: "#00FFCC", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="zScore — Wallet Scoring" sub="Ethereum wallets scored (M)" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="zsG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                  <Tooltip content={<Tooltip_ />} />
                  <Area type="monotone" dataKey="zScore" name="zScore (M wallets)" stroke="#a78bfa" strokeWidth={2.5} fill="url(#zsG)" dot={{ fill: "#a78bfa", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="Zaps Deployed" sub="Behavioral intelligence framework instances" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activeData} barSize={24}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Bar dataKey="zaps" name="Zaps" fill="rgba(56,189,248,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="Deals by Product" sub="Pipeline distribution across products" />
              {productData.map((p, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#e2f0ec", fontWeight: 600 }}>{p.product}</span>
                    <span style={{ fontSize: 12, color: "#00FFCC", fontFamily: "monospace" }}>{p.deals} deal{p.deals !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${(p.deals / pipeline.length) * 100}%`, background: ["rgba(0,255,204,0.7)", "rgba(167,139,250,0.7)", "rgba(56,189,248,0.7)", "rgba(251,191,36,0.7)"][i], borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ════════════════ ECOSYSTEMS ════════════════ */}
        {tab === "Ecosystems" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <CardTitle title="Active Integrations Over Time" sub={`${view} view`} />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="ecoG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Area type="monotone" dataKey="ecosystems" name="Ecosystems" stroke="#38bdf8" strokeWidth={2.5} fill="url(#ecoG2)" dot={{ fill: "#38bdf8", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle title="Deals by Ecosystem" sub="Pipeline value and count" />
              {ecoData.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#00FFCC" }}>
                      {e.ecosystem.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e2f0ec" }}>{e.ecosystem}</div>
                      <div style={{ fontSize: 10, color: "rgba(204,232,224,0.38)", fontFamily: "monospace" }}>{e.deals} deal{e.deals !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#00FFCC", fontFamily: "monospace" }}>${e.value}k</div>
                    <div style={{ fontSize: 10, color: "rgba(204,232,224,0.38)" }}>pipeline value</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card style={{ gridColumn: "1 / -1" }}>
              <CardTitle title="Ecosystem Pipeline Breakdown" sub="Deals count by ecosystem" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ecoData} barSize={36}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="ecosystem" tick={{ fill: "rgba(204,232,224,0.45)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(204,232,224,0.35)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip_ />} />
                  <Bar dataKey="deals" name="Deals" fill="rgba(56,189,248,0.6)" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="value" name="Value ($k)" fill="rgba(0,255,204,0.5)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ════════════════ DATA ENTRY ════════════════ */}
        {tab === "Data Entry" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <CardTitle title={`Edit ${view} Data`} sub="Add or update periods manually" />
              </div>

              {/* Add Row Form */}
              <div style={{ padding: 14, background: "rgba(0,255,204,0.04)", borderRadius: 9, border: "1px solid rgba(0,255,204,0.1)", marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#00FFCC", fontFamily: "monospace", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Add New Period</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr auto", gap: 8 }}>
                  <Input value={newDataRow.period} onChange={v => setNewDataRow(p => ({ ...p, period: v }))} placeholder="Period (e.g. Apr)" />
                  <Input value={newDataRow.arr} onChange={v => setNewDataRow(p => ({ ...p, arr: v }))} type="number" placeholder="ARR ($k)" />
                  <Input value={newDataRow.deals} onChange={v => setNewDataRow(p => ({ ...p, deals: v }))} type="number" placeholder="Deals" />
                  <Input value={newDataRow.agentScan} onChange={v => setNewDataRow(p => ({ ...p, agentScan: v }))} type="number" placeholder="AgentScan" />
                  <Input value={newDataRow.zScore} onChange={v => setNewDataRow(p => ({ ...p, zScore: v }))} type="number" placeholder="zScore (M)" />
                  <Input value={newDataRow.zaps} onChange={v => setNewDataRow(p => ({ ...p, zaps: v }))} type="number" placeholder="Zaps" />
                  <Input value={newDataRow.ecosystems} onChange={v => setNewDataRow(p => ({ ...p, ecosystems: v }))} type="number" placeholder="Ecosystems" />
                  <Btn onClick={addDataRow}>Add</Btn>
                </div>
              </div>

              {/* Data Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Period", "ARR ($k)", "Deals", "AgentScan", "zScore (M)", "Zaps", "Ecosystems", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "rgba(204,232,224,0.38)", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,204,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {["period", "arr", "deals", "agentScan", "zScore", "zaps", "ecosystems"].map(field => (
                          <td key={field} style={{ padding: "10px 10px" }}>
                            {editingRowIdx === idx
                              ? <Input value={row[field]} onChange={v => updateDataRow(idx, field, v)} type={field === "period" ? "text" : "number"} />
                              : <span style={{ color: field === "period" ? "#e2f0ec" : "#00FFCC", fontFamily: "monospace" }}>
                                  {field === "agentScan" ? fmt(row[field]) : field === "arr" ? `$${row[field]}k` : row[field]}
                                </span>
                            }
                          </td>
                        ))}
                        <td style={{ padding: "10px 10px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setEditingRowIdx(editingRowIdx === idx ? null : idx)}
                              style={{ background: "none", border: "1px solid rgba(0,255,204,0.2)", borderRadius: 5, color: "#00FFCC", fontSize: 11, cursor: "pointer", padding: "3px 8px" }}>
                              {editingRowIdx === idx ? "Done" : "Edit"}
                            </button>
                            <button onClick={() => deleteDataRow(idx)}
                              style={{ background: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 5, color: "rgba(255,100,100,0.7)", fontSize: 11, cursor: "pointer", padding: "3px 8px" }}>
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 28, textAlign: "center", fontSize: 10, color: "rgba(204,232,224,0.15)", fontFamily: "monospace", letterSpacing: "0.08em" }}>
          ZERUAI · BEHAVIORAL INTELLIGENCE INFRASTRUCTURE · BASE BLOCKCHAIN
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Layout, 
  Settings, 
  Share2, 
  Database, 
  ChevronRight, 
  Terminal, 
  Code2, 
  MessageSquare,
  Activity,
  Layers,
  Component,
  Zap,
  Download
} from 'lucide-react';
import { Mermaid } from './components/Mermaid';
import { architectureDoc, prompts, contracts } from './content/data';
import { cn } from './lib/utils';

// Icons mapping for categories
const ICON_MAP: Record<string, React.ReactNode> = {
  'Doc': <FileText className="w-5 h-5" />,
  'Design': <Layout className="w-5 h-5" />,
  'Structure': <Layers className="w-5 h-5" />,
  'Prompt': <Terminal className="w-5 h-5" />,
  'API': <Zap className="w-5 h-5" />,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('HighLevel');
  const [mainTab, setMainTab] = useState('Architecture');

  const navItems = [
    { name: 'HighLevel', label: 'High-Level Design' },
    { name: 'LowLevel', label: 'Low-Level Design' },
    { name: 'Structure', label: 'Project Structure' },
    { name: 'Contracts', label: 'API Contracts' },
    { name: 'InProcess', label: 'In-Process (MediatR)' },
    { name: 'OutProcess', label: 'Out-Process (Bus)' },
  ];

  const diagrams = {
    HighLevel: `
graph TD
    Client[Client UI/Terminal] --> API[API Gateway / Host App]
    subgraph "Modular Monolith"
        API --> Sales[Sales Module]
        API --> Inv[Inventory Module]
        API --> Cat[Catalog Module]
        API --> Cust[Customer Module]
        
        Sales -.->|MediatR Events| Inv
        Inv -.->|MediatR Events| Sales
    end
    Sales --> DB[(Tenant DB - Postgres)]
    Inv --> DB
    Cat --> DB
    `,
    LowLevel: `
classDiagram
    class SalesModule {
        +CreateTransaction()
        +ApplyDiscount()
    }
    class IInventoryIntegration {
        +UpdateStock(productId, qty)
    }
    SalesModule --> IInventoryIntegration : "Depends on"
    IInventoryIntegration <|-- InventoryModuleAdapter
    InventoryModuleAdapter ..> MediatR : "Publishes StockChangedEvent"
    `,
    InProcess: `
sequenceDiagram
    participant S as Sales Module
    participant M as MediatR
    participant I as Inventory Module
    S->>M: Publish PaymentCompletedEvent
    M->>I: Handle PaymentCompletedNotification
    I->>I: Update Physical Stock
    I-->>S: Acknowledge (Async)
    `,
    OutProcess: `
sequenceDiagram
    participant App as POS Monolith
    participant MB as Message Bus (RabbitMQ/Service Bus)
    participant RP as Reporting Service (Microservice)
    App->>App: Save Transaction to DB
    App->>MB: Publish OrderCreatedIntegrationEvent
    MB->>RP: Consume Event
    RP->>RP: Update Dashboard Stats
    `
  };

  const solutionStructure = `
RetailPOS.root
├── src/
│   ├── Core/                  # Shared Kernel, Base Entities, Domain Events
│   ├── Modules/
│   │   ├── Sales/
│   │   │   ├── Domain/       # Entities, Aggregates, Logic
│   │   │   ├── Application/  # Commands, Queries, Handlers
│   │   │   ├── Infrastructure/# DB Access, Repositories
│   │   │   └── API/          # Controllers/Endpoints
│   │   ├── Inventory/
│   │   ├── Catalog/
│   │   └── Customers/
│   └── Host/                 # Entry point, DI configuration, Auth
├── tests/
│   ├── UnitTests/
│   └── IntegrationTests/
└── infrastructure/           # Docker, Terraform, CI/CD scripts
`;

  const visioCsv = `ShapeID,Name,Type,Description,ConnectorTargets
M-001,SalesModule,Process,Handles POS Transactions,M-002;M-003
M-002,InventoryModule,Process,Stock Control,M-003
M-003,CatalogModule,Process,Product Metadata,
INT-001,MediatR,Bus,In-Process Messenger,M-001;M-002;M-003
DB-001,TenantDB,Database,PostgreSQL Multi-tenant,M-001;M-002;M-003`;

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(`${msg} copied to clipboard!`);
  };

  return (
    <div className="h-screen flex flex-col bg-bg text-text-main overflow-hidden">
      {/* Header */}
      <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Retail POS | Modular Monolith Architect</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => copyToClipboard(visioCsv, 'Visio Manifest')} className="btn">
            <Download className="w-4 h-4" />
            Export Visio Manifest
          </button>
          <button onClick={() => copyToClipboard(architectureDoc, 'PowerPoint Outline')} className="btn">
            <FileText className="w-4 h-4" />
            PowerPoint Outline
          </button>
          <button onClick={() => alert('Generating solution structure...')} className="btn btn-primary">
            <Zap className="w-4 h-4 fill-current" />
            Generate .NET Solution
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] bg-sidebar text-white shadow-2xl p-5 shrink-0 flex flex-col gap-8 z-40 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Project Explorer</h3>
            <div className="space-y-1">
              {navItems.slice(0, 4).map((item) => (
                <div
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn("nav-item", activeTab === item.name && "active")}
                >
                  <div className="nav-dot" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Flow Diagrams</h3>
            <div className="space-y-1">
              {navItems.slice(4).map((item) => (
                <div
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn("nav-item", activeTab === item.name && "active")}
                >
                  <div className="nav-dot" />
                  {item.label}
                </div>
              ))}
              <div
                onClick={() => setMainTab(mainTab === 'Architecture' ? 'Prompts' : 'Architecture')}
                className={cn("nav-item", mainTab === 'Prompts' && "active")}
              >
                <div className="nav-dot" />
                SDLC Prompt Library
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Modules</span>
                <span className="text-accent font-bold">04</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Status</span>
                <span className="text-success font-bold uppercase">Ready</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] p-5 gap-5 overflow-hidden translate-z-0">
          {/* Main Display Canvas */}
          <section className="canvas-container relative group">
            <div className="canvas-header">
              <span className="font-bold text-sm flex items-center gap-2">
                {activeTab.replace(/([A-Z])/g, ' $1').trim()}
                {mainTab === 'Prompts' && " - SDLC Prompts"}
              </span>
              <span className="status-pill">Cloud Agnostic</span>
            </div>
            
            <div className="flex-1 overflow-auto bg-white relative">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {mainTab === 'Architecture' ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="h-full flex flex-col"
                  >
                    {activeTab === 'Structure' ? (
                      <div className="p-8 h-full">
                        <div className="code-block h-full overflow-auto whitespace-pre font-mono p-6 border-slate-200">
                          {solutionStructure}
                        </div>
                      </div>
                    ) : activeTab === 'Contracts' ? (
                      <div className="p-8 grid grid-cols-1 gap-6 overflow-auto">
                        {contracts.map(c => (
                          <div key={c.module} className="space-y-3">
                            <h5 className="text-xs font-bold text-accent uppercase tracking-widest">{c.module} API Contract</h5>
                            <div className="code-block whitespace-pre text-slate-600 border-indigo-100">
                              {c.contract.trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-visible">
                        <Mermaid id={activeTab} chart={diagrams[activeTab as keyof typeof diagrams] || ''} />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="prompts"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 space-y-4 overflow-auto"
                  >
                    {prompts.map((p) => (
                      <div key={p.phase} className="p-5 rounded-xl border border-border bg-gray-50/50 hover:border-accent transition-colors group/p">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{p.phase}</span>
                          <button 
                            onClick={() => copyToClipboard(p.prompt, 'Prompt')}
                            className="p-1.5 rounded-md hover:bg-white text-slate-400 opacity-0 group-hover/p:opacity-100 transition-opacity border border-transparent hover:border-border"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{p.prompt}"</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <footer className="p-3 bg-slate-50 border-t border-border flex justify-between items-center text-[10px] font-medium text-text-muted">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-success" />
                Diagram rendered from Connector Matrix CSV
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-border flex items-center gap-1">
                4 Modules | Multi-tenant Enabled
              </span>
            </footer>
          </section>

          {/* Right Panel */}
          <section className="panel-container">
            <div className="panel-tab flex items-center gap-2">
              <Layout className="w-3 h-3" />
              Solution Manifest
            </div>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-accent rounded-full" />
                    Project Layout (.NET 8)
                  </h4>
                  <div className="code-block bg-slate-50 text-[10px] leading-relaxed">
                    src/<br/>
                    &nbsp;&nbsp;Shared.Kernel/<br/>
                    &nbsp;&nbsp;Modules/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Catalog/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Domain/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Application/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Infrastructure/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PublicApi/<br/>
                    &nbsp;&nbsp;Pos.Host/
                  </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-violet-500 rounded-full" />
                    Visio Connector Matrix
                  </h4>
                  <div className="space-y-px border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 bg-slate-50 border-b border-border p-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Source</span>
                      <span>Target</span>
                    </div>
                    {[
                      ['Sales.App', 'Catalog.API'],
                      ['Sales.Domain', 'Shared.Bus'],
                      ['Tenancy.Mid', 'Auth.Context']
                    ].map(([src, tgt], i) => (
                      <div key={i} className="grid grid-cols-2 p-2 border-b last:border-0 border-border text-[11px]">
                        <span className="text-slate-500 font-mono">{src}</span>
                        <span className="text-slate-700 font-semibold">{tgt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Settings className="w-3 h-3" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Tenancy Strategy</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Discriminator column on shared DB for low-tier; Isolated schemas for Enterprise tier.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ArchitectureExplorerIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m11 17 2 2 4-4" />
      <path d="m3 17 2 2 4-4" />
      <path d="m13 6 2 2 4-4" />
      <path d="M5 6 7 8l4-4" />
    </svg>
  );
}

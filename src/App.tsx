import { useState, useEffect, type FormEvent } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Wrench, 
  LayoutDashboard, 
  FileText, 
  LogOut,
  ChevronRight,
  Plus,
  Receipt,
  Bell,
  Info,
  X,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "units", label: "Apartments", icon: Building2, indent: true },
    { id: "tenants", label: "Residents", icon: Users },
    { id: "payments", label: "Ledger", icon: CreditCard },
    { id: "expenses", label: "Outlays", icon: Receipt },
    { id: "maintenance", label: "Service Desk", icon: Wrench },
    { id: "leases", label: "Agreements", icon: FileText },
    { id: "reports", label: "Insights", icon: LayoutDashboard },
  ];

  return (
    <div className="w-72 h-screen bg-slate-950 text-slate-400 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-900">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-500/20 shadow-2xl">
          <Building2 className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-white font-display text-xl font-bold tracking-tight">Estates<span className="text-indigo-400">Pro</span></h1>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Management</p>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
              activeTab === item.id 
                ? "bg-white text-slate-950 font-bold shadow-xl" 
                : "hover:bg-slate-900 hover:text-slate-200",
              (item as any).indent && "ml-4 w-[calc(100%-1rem)]"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-2xl z-[-1]"
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id ? "text-indigo-600" : "text-slate-600 group-hover:text-slate-300"
            )} />
            <span className="text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto text-indigo-200" />}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white text-sm font-bold truncate">Julian Hayford</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase">Super Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs font-bold ring-1 ring-slate-700/50">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(setNotifications);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="flex justify-between items-center mb-12 relative">
          <div>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2 block">System Management</span>
            <h2 className="text-4xl font-display font-bold text-slate-950 capitalize flex items-center gap-3">
              {activeTab}
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-soft">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live System</span>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 text-slate-400 hover:text-indigo-600 transition-all bg-white rounded-2xl shadow-soft border border-slate-100 relative group active:scale-95"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-premium border border-slate-100 z-50 p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-display font-bold text-slate-950 text-lg">Alerts & Status</h4>
                      <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {notifications.map((n) => (
                        <div key={n.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer group">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                            n.type === "alert" ? "bg-rose-50 text-rose-500" : "bg-indigo-50 text-indigo-500"
                          )}>
                            {n.type === "alert" ? <Bell className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-slate-900">{n.title}</p>
                              <span className="text-[10px] font-bold text-slate-400">{n.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
                      Clear All Notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setActiveTab("maintenance")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-premium hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold text-sm hover:shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Action
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "properties" && <PropertiesView />}
            {activeTab === "units" && <UnitsView />}
            {activeTab === "tenants" && <TenantsView />}
            {activeTab === "payments" && <PaymentsView />}
            {activeTab === "expenses" && <ExpensesView />}
            {activeTab === "maintenance" && <MaintenanceView />}
            {activeTab === "leases" && <LeasesView />}
            {activeTab === "reports" && <ReportsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- View Components ---

function DashboardView() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
    </div>
  );

  const stats = [
    { label: "Total Asset Yield", value: `GH₵${data.summary.totalRevenue.toLocaleString()}`, change: "+12.5%", icon: CreditCard, color: "text-indigo-600 bg-indigo-50" },
    { label: "Operational Outlay", value: `GH₵${data.summary.totalExpenses.toLocaleString()}`, change: "-3.2%", icon: Receipt, color: "text-rose-600 bg-rose-50" },
    { label: "Asset Occupancy", value: `${Math.round((data.summary.occupiedApartments / data.summary.totalApartments) * 100)}%`, change: "Optimal", icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Service", value: data.summary.maintenanceRequests, change: "Active", icon: Wrench, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-premium transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon className="w-24 h-24 rotate-12" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className={cn("p-4 rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                stat.change.startsWith("+") || stat.change === "Optimal" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em] mb-1">{stat.label}</h3>
            <p className="text-3xl font-display font-bold text-slate-950 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] shadow-soft border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-950">Performance Indices</h3>
              <p className="text-xs text-slate-400 font-medium">Revenue vs Expenditure Analysis</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_10px_rgb(79,70,229,0.3)]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yield</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cost</span>
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrends}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}}
                  tickFormatter={(value) => `₵${value/1000}k`}
                />
                <Tooltip 
                  cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                  labelStyle={{ fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}
                  formatter={(value: any) => [`GH₵${value.toLocaleString()}`, 'Yield']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#CBD5E1" 
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  fill="transparent" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-indigo-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-premium">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-display font-bold mb-2">Portfolio Health</h3>
              <p className="text-indigo-300 text-xs">Real-time asset performance metrics</p>
            </div>
            
            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Global Occupancy</span>
                  <span className="text-2xl font-bold">94.2%</span>
                </div>
                <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94.2%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-indigo-400 rounded-full shadow-[0_0_10px_rgb(129,140,248,0.5)]" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Revenue Target</span>
                  <span className="text-2xl font-bold">88%</span>
                </div>
                <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgb(52,211,153,0.5)]" 
                  />
                </div>
              </div>

              <div className="pt-8">
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Highest Yielding</p>
                    <p className="text-sm font-bold">Penthouse Suites (Property A)</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-10 py-4 bg-white text-indigo-950 font-bold rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group shadow-xl">
              Generate Detailed Insights
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-display font-bold text-slate-950">Recent Ledger Activity</h3>
            <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-6">
            {data.recentPayments.map((payment: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold group-hover:scale-110 transition-transform">
                    {payment.tenantId}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">Resident {payment.tenantId}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold text-slate-950 leading-none mb-1">+GH₵{payment.amount.toLocaleString()}</p>
                  <span className={cn(
                    "text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                    payment.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {payment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-display font-bold text-slate-950">Service Desk Queue</h3>
            <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-700">Open Tickets</button>
          </div>
          <div className="space-y-6">
            {data.maintenanceSummary.map((m: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
              >
                <div className={cn(
                  "w-1.5 h-12 rounded-full",
                  m.priority === "high" ? "bg-rose-500 shadow-[0_0_10px_rgb(244,63,94,0.3)]" : "bg-amber-500 shadow-[0_0_10px_rgb(245,158,11,0.3)]"
                )} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{m.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">{m.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded-lg">Processing</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-950 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all shadow-xl">
            Go to Service Desk
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return (
     <div className="flex flex-col items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synthesizing Analytics...</p>
     </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-slate-100 group hover:shadow-premium transition-all duration-500">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-2xl font-display font-bold text-slate-950 uppercase tracking-tight">Occupancy Archetype</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time asset utilization by property cluster</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Activity className="w-6 h-6" />
             </div>
          </div>
          <div className="space-y-8">
            {data.occupancyByProperty.map((item: any, i: number) => (
              <div key={i} className="group/item">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{item.name}</span>
                  <span className={cn(
                     "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                     item.occupancy > 90 ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  )}>{item.occupancy}% Load</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.occupancy}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className={cn(
                      "h-full rounded-full transition-all shadow-sm",
                      item.occupancy > 90 ? "bg-emerald-400 shadow-emerald-200" : "bg-indigo-400 shadow-indigo-200"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
           <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-premium relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-indigo-600/30 blur-3xl rounded-full" />
              <div className="relative z-10">
                 <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Financial Equilibrium</p>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Net Cash Yield</p>
                       <p className="text-3xl font-display font-bold">₵20,300</p>
                    </div>
                    <div>
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Asset Rent</p>
                       <p className="text-3xl font-display font-bold">₵1,180</p>
                    </div>
                 </div>
                 <div className="mt-12 flex gap-4">
                    <button className="flex-1 py-4 bg-white text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-[0.98] shadow-xl">
                       Full Audit
                    </button>
                    <button className="px-6 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all">
                       <FileText className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-indigo-300 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors duration-500">
                 <LayoutDashboard className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Proprietary Insights</h4>
              <p className="text-slate-400 text-xs mt-2 max-w-[240px]">Configure algorithmic filters and automated monthly summaries for your portfolio.</p>
              <button className="mt-8 px-8 py-3 bg-slate-50 text-slate-600 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                 Configure Hub
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function PropertiesView() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [units, setUnits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", units: 0 });
  const [unitFormData, setUnitFormData] = useState({ number: "", type: "1BR", rent: 0 });

  const fetchProperties = () => {
    fetch("/api/properties").then(res => res.json()).then(setProperties);
  };

  const fetchUnits = () => {
    if (selectedProperty) {
      fetch(`/api/units?propertyId=${selectedProperty.id}`)
        .then(res => res.json())
        .then(setUnits);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setShowAddForm(false);
      setFormData({ name: "", address: "", units: 0 });
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUnit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    try {
      await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...unitFormData, propertyId: selectedProperty.id })
      });
      setShowAddUnitForm(false);
      setUnitFormData({ number: "", type: "1BR", rent: 0 });
      fetchUnits();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [selectedProperty]);

  if (selectedProperty) {
    return (
       <div className="space-y-10 pb-20">
          <button 
            onClick={() => setSelectedProperty(null)}
            className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold transition-all text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
            Back to Asset Portfolio
          </button>
          
          <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden">
             <div className="h-64 relative">
                <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                   <h3 className="text-4xl font-display font-bold">{selectedProperty.name}</h3>
                   <p className="text-slate-200 font-medium flex items-center gap-2 mt-2">
                     <Activity className="w-4 h-4 text-emerald-400" />
                     {selectedProperty.address}
                   </p>
                </div>
             </div>

             <div className="p-12">
                <div className="flex flex-wrap gap-12 mb-16">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Inventory</p>
                      <p className="text-2xl font-display font-bold text-slate-900">{selectedProperty.units} Units</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Asset Valuation</p>
                      <p className="text-2xl font-display font-bold text-slate-900">GH₵{ (selectedProperty.units * 1200 * 12).toLocaleString() }</p>
                   </div>
                   <div className="ml-auto flex gap-4">
                      <button className="px-6 py-3 bg-slate-950 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-xl">Manage Docs</button>
                      <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200">Asset Audit</button>
                   </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-lg font-display font-bold text-slate-950 uppercase tracking-tight">Apartment Directory</h4>
                   <button 
                      onClick={() => setShowAddUnitForm(!showAddUnitForm)}
                      className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                   >
                      <Plus className="w-4 h-4" /> Register New Unit
                   </button>
                </div>

                <AnimatePresence>
                  {showAddUnitForm && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 mb-10"
                    >
                      <form onSubmit={handleAddUnit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Unit Identifier</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. 101"
                            value={unitFormData.number}
                            onChange={(e) => setUnitFormData({...unitFormData, number: e.target.value})}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none font-bold focus:ring-2 focus:ring-indigo-100" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Configuration</label>
                          <select 
                            value={unitFormData.type}
                            onChange={(e) => setUnitFormData({...unitFormData, type: e.target.value})}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" 
                          >
                            <option value="Studio">Studio</option>
                            <option value="1BR">1 Bedroom</option>
                            <option value="2BR">2 Bedroom</option>
                            <option value="3BR">3 Bedroom</option>
                            <option value="Penthouse">Luxury Penthouse</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Target Rent (₵)</label>
                          <input 
                            type="number" 
                            required
                            value={unitFormData.rent}
                            onChange={(e) => setUnitFormData({...unitFormData, rent: Number(e.target.value)})}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-indigo-600" 
                          />
                        </div>
                        <div className="flex items-end">
                          <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                            Commit Registry
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {units.map((unit: any, i: number) => (
                      <motion.div 
                        key={unit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium hover:border-indigo-100 hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-display font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase">
                               {unit.number}
                            </div>
                            <span className={cn(
                              "text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                              unit.status === "occupied" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                            )}>
                              {unit.status}
                            </span>
                         </div>
                         <h4 className="font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{unit.type} Configuration</h4>
                         <p className="text-xs text-slate-400 font-medium mt-1">Monthly Asset Yield</p>
                         <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-lg font-bold text-slate-950">GH₵{unit.rent}</p>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </motion.div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
           <h3 className="text-2xl font-display font-bold text-slate-950">Global Portfolio</h3>
           <p className="text-sm text-slate-400 font-medium">Manage and audit your high-yield properties</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-950 text-white px-8 py-3 rounded-[1.5rem] text-sm font-bold hover:shadow-premium transition-all flex items-center gap-3 active:scale-95 shadow-xl"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? "Dismiss Form" : "Acquire New Asset"}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-10 overflow-hidden"
          >
            <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Asset Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 font-bold" 
                  placeholder="e.g. Skyline Towers" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Geographical Location</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 font-bold" 
                  placeholder="e.g. Accra, Cantonments" 
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all hover:shadow-indigo-500/20 active:scale-95">
                  Confirm Acquisition
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {properties.map((p: any, i: number) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[3rem] shadow-soft border border-slate-100 overflow-hidden group hover:shadow-premium hover:scale-[1.01] transition-all duration-500"
          >
            <div className="h-64 relative overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-bold text-indigo-700 shadow-xl border border-white/50">
                {p.units} APARTMENTS
              </div>
              <div className="absolute bottom-6 left-6">
                 <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                   <span className="text-xs font-bold uppercase tracking-widest leading-none">Grade A Asset</span>
                 </div>
              </div>
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-2xl font-display font-bold text-slate-950">{p.name}</h4>
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl text-amber-600 border border-amber-100">
                  <span className="text-xs font-bold leading-none">★ {p.rating}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 font-medium mb-10 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-400" />
                 {p.address}
              </p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-8 mt-auto">
                <div className="flex gap-8">
                   <div className="text-left">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.1em] mb-1">Occupancy</p>
                      <div className="flex items-end gap-2">
                        <p className="text-xl font-display font-bold text-slate-950">92%</p>
                        <span className="text-[10px] font-bold text-emerald-500 mb-1 leading-none">↑ 2%</span>
                      </div>
                   </div>
                   <div className="text-left">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.1em] mb-1">Available</p>
                      <p className="text-xl font-display font-bold text-slate-950">{Math.floor(p.units * 0.08)} Units</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedProperty(p)}
                  className="bg-slate-50 text-slate-950 p-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-500/30 group"
                >
                  <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UnitsView() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(data => {
        setUnits(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
      <div className="p-10 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Global Apartment Directory</h3>
          <p className="text-xs text-slate-400 font-medium">Enterprise-wide audit of all registered configurations</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
              {units.length} Total Units
           </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-50/50">
              <th className="py-5 px-10">Asset ID</th>
              <th className="py-5">Property Complex</th>
              <th className="py-5">Configuration</th>
              <th className="py-5 text-right">Yield (₵)</th>
              <th className="py-5 px-10 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {units.map((u: any, i: number) => (
              <motion.tr 
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-slate-50/80 transition-colors group cursor-default"
              >
                <td className="py-6 px-10">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {u.number}
                   </div>
                </td>
                <td className="py-6">
                   <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{u.propertyName}</span>
                </td>
                <td className="py-6">
                   <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{u.type}</span>
                </td>
                <td className="py-6 text-right">
                   <span className="text-sm font-display font-bold text-slate-950">₵{u.rent.toLocaleString()}</span>
                </td>
                <td className="py-6 px-10 text-right">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                    u.status === "occupied" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  )}>
                    {u.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TenantsView() {
  const [tenants, setTenants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const fetchTenants = () => {
    fetch("/api/tenants").then(res => res.json()).then(setTenants);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setShowAddForm(false);
      setFormData({ name: "", email: "", phone: "" });
      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-display font-bold text-slate-950 uppercase tracking-tight">Resident Directory</h3>
          <p className="text-sm text-slate-400 font-medium">Manage and audit site-wide residency data</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-950 text-white px-8 py-3 rounded-[1.5rem] text-sm font-bold hover:shadow-premium transition-all flex items-center gap-3 active:scale-95 shadow-xl"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? "Dismiss Form" : "Onboard Resident"}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-10 overflow-hidden mb-10"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Legal Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 font-bold" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 font-bold" 
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 font-bold" 
                  placeholder="+233..." 
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all hover:shadow-indigo-500/20 active:scale-95">
                  Confirm Registration
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tenants.map((tenant: any, i: number) => (
          <motion.div 
            key={tenant.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-premium hover:border-indigo-100 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50 group-hover:bg-indigo-500 transition-colors duration-500" />
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-display font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-500 border border-transparent group-hover:border-indigo-200">
              {tenant.name.charAt(0)}
            </div>
            <h4 className="text-xl font-display font-bold text-slate-900 mb-1">{tenant.name}</h4>
            <div className="flex items-center gap-2 mb-6">
               <span className="text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">Verified Resident</span>
            </div>
            
            <div className="w-full space-y-4 pt-6 border-t border-slate-50">
               <div className="flex items-center justify-center gap-3 text-slate-500 overflow-hidden">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                     <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold truncate transition-colors group-hover:text-slate-900">{tenant.email}</span>
               </div>
               <div className="flex items-center justify-center gap-3 text-slate-500">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                     <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold transition-colors group-hover:text-slate-900">{tenant.phone}</span>
               </div>
            </div>

            <div className="w-full mt-6 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
               <span>Unit {tenant.unitId || "Pending"}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <button className="w-full mt-8 py-3 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-500/20">
               View Profile
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/payments").then(res => res.json()).then(setPayments);
  }, []);

  return (
    <div className="space-y-10 pb-20">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-premium relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
             <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 blur-3xl rounded-full" />
             <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Total Aggregate Yield</p>
             <h4 className="text-4xl font-display font-bold mt-1 tracking-tight">₵24,500</h4>
             <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest leading-none">Healthy Flow</span>
                <span className="text-indigo-200 text-xs font-bold">↑ 12.4%</span>
             </div>
          </div>
          
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft group hover:shadow-premium transition-all duration-500">
             <div className="flex justify-between items-start mb-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Pending Receivables</p>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform duration-500">
                   <Activity className="w-6 h-6" />
                </div>
             </div>
             <h4 className="text-4xl font-display font-bold text-slate-900 tracking-tight">₵1,500</h4>
             <div className="w-full bg-slate-50 h-2.5 rounded-full mt-8 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "45%" }}
                   className="bg-amber-400 h-full rounded-full shadow-[0_0_15px_rgb(245,158,11,0.4)]" 
                />
             </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft group hover:shadow-premium transition-all duration-500">
             <div className="flex justify-between items-start mb-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Operational Outlay</p>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 group-hover:scale-110 transition-transform duration-500">
                   <TrendingUp className="w-6 h-6" />
                </div>
             </div>
             <h4 className="text-4xl font-display font-bold text-slate-900 tracking-tight">₵4,200</h4>
             <div className="w-full bg-slate-50 h-2.5 rounded-full mt-8 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "65%" }}
                   className="bg-rose-400 h-full rounded-full shadow-[0_0_15px_rgb(244,63,94,0.4)]" 
                />
             </div>
          </div>
       </div>

       <div className="bg-white rounded-[3rem] shadow-soft border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
             <div>
                <h3 className="text-xl font-display font-bold text-slate-950 uppercase tracking-tight">Transaction Ledger</h3>
                <p className="text-xs text-slate-400 font-medium">Verified financial history and audit trail</p>
             </div>
             <button className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-slate-200 shadow-sm">Audit Download</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-50/50">
                      <th className="py-6 px-10">Entity Trace</th>
                      <th className="py-6">Asset Date</th>
                      <th className="py-6">Channel</th>
                      <th className="py-6 text-right">Value (₵)</th>
                      <th className="py-6 px-10 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {payments.map((p: any, i: number) => (
                      <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                         <td className="py-6 px-10">
                            <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-tighter group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                               #{p.id.toUpperCase()}
                            </span>
                         </td>
                         <td className="py-6 text-xs text-slate-500 font-bold uppercase tracking-tight">
                            {p.date}
                         </td>
                         <td className="py-6">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.method}</span>
                         </td>
                         <td className="py-6 text-right">
                            <span className="text-sm font-display font-bold text-slate-950 block">₵{p.amount.toLocaleString()}</span>
                         </td>
                         <td className="py-6 px-10 text-right">
                           <span className={cn(
                             "px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border inline-block min-w-[80px] text-center",
                             p.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                           )}>
                             {p.status}
                           </span>
                         </td>
                      </motion.tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

function ExpensesView() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("/api/expenses").then(res => res.json()).then(setExpenses);
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-white rounded-[3rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Opex Audit Tracking</h3>
            <p className="text-xs text-slate-400 font-medium">Overview of maintenance and operational outlays</p>
          </div>
          <button className="bg-rose-600 text-white px-8 py-3 rounded-[1.5rem] text-sm font-bold hover:shadow-premium transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-rose-200">
            <Receipt className="w-5 h-5" /> Log Operational Outlay
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="py-6 px-10">Asset Date</th>
                <th className="py-6">Classification</th>
                <th className="py-6">Entity Descriptor</th>
                <th className="py-6 text-right px-10">Outlay (₵)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((e: any, i: number) => (
                <motion.tr 
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 transition-colors group cursor-default"
                >
                  <td className="py-6 px-10 text-xs text-slate-500 font-bold uppercase tracking-tight">{e.date}</td>
                  <td className="py-6">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.1em] group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-6 text-sm font-bold text-slate-900 tracking-tight">{e.description}</td>
                  <td className="py-6 text-sm font-display font-bold text-rose-600 text-right px-10 tracking-tight">₵{e.amount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MaintenanceView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    unitId: "",
    priority: "low",
    description: ""
  });

  const fetchRequests = () => {
    fetch("/api/maintenance").then(res => res.json()).then(setRequests);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.unitId) return;
    
    setLoading(true);
    try {
      await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormData({ title: "", unitId: "", priority: "low", description: "" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-20">
       <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-end mb-4">
             <div>
                <h3 className="text-2xl font-display font-bold text-slate-950 uppercase tracking-tight">Active Service Queue</h3>
                <p className="text-sm text-slate-400 font-medium">Mission-critical asset maintenance tickets</p>
             </div>
             <span className="bg-rose-50 text-rose-600 font-bold px-4 py-1.5 rounded-2xl text-[10px] border border-rose-100 uppercase tracking-widest">{requests.length} Processing</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((r: any, i: number) => (
              <motion.div 
                key={r.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft relative group hover:shadow-premium hover:border-indigo-100 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center rounded-bl-[2.5rem] group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Activity className="w-5 h-5" />
                </div>

                <div className="mb-8">
                   <span className={cn(
                     "px-3 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] border",
                     r.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_10px_rgb(244,63,94,0.2)]' : 'bg-amber-50 text-amber-600 border-amber-100'
                   )}>
                     {r.priority} Priority
                   </span>
                </div>

                <h4 className="text-xl font-display font-bold text-slate-950 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{r.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-8">{r.description}</p>
                
                <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apt {r.unitId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                   <button className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 uppercase tracking-[0.1em]">Assign Vendor</button>
                   <button className="flex-1 py-3 bg-slate-950 text-white text-[10px] font-bold rounded-2xl hover:bg-slate-900 group-hover:block transition-all uppercase tracking-[0.1em]">Resolve</button>
                </div>
              </motion.div>
            ))}
          </div>
       </div>

       <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium sticky top-12">
             <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-slate-950 tracking-tight">Deployment Request</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Initiate on-site maintenance protocols</p>
             </div>
             <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Service Descriptor</label>
                   <input 
                     type="text" 
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none font-bold placeholder:font-medium placeholder:text-slate-300" 
                     placeholder="e.g. Critical AC Malfunction" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Asset Unit</label>
                      <select 
                        value={formData.unitId}
                        onChange={(e) => setFormData({...formData, unitId: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold appearance-none cursor-pointer"
                       >
                         <option value="">Select Asset</option>
                         <option value="101">Unit 101</option>
                         <option value="102">Unit 102</option>
                         <option value="2001">Unit 2001</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Priority Tier</label>
                      <select 
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold appearance-none cursor-pointer"
                       >
                         <option value="low">Low Impact</option>
                         <option value="medium">Standard</option>
                         <option value="high">High Priority</option>
                         <option value="urgent">Critical/Urgent</option>
                      </select>
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Contextual Brief</label>
                   <textarea 
                     rows={4} 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none resize-none font-bold placeholder:font-medium placeholder:text-slate-300" 
                     placeholder="Specify the operational anomaly..."
                   ></textarea>
                </div>
                <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-slate-900 disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                 >
                   {loading ? "Transmitting..." : "Authorize Service Order"} 
                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
          </div>
       </div>
    </div>
  );
}

function LeasesView() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: "",
    unitId: "",
    startDate: "",
    endDate: "",
    rent: ""
  });

  const fetchData = async () => {
    const [leasesRes, tenantsRes, unitsRes] = await Promise.all([
      fetch("/api/leases"),
      fetch("/api/tenants"),
      fetch("/api/units")
    ]);
    const [leasesData, tenantsData, unitsData] = await Promise.all([
      leasesRes.json(),
      tenantsRes.json(),
      unitsRes.json()
    ]);
    setLeases(leasesData);
    setTenants(tenantsData);
    setUnits(unitsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setShowAddForm(false);
      setFormData({
        tenantId: "",
        unitId: "",
        startDate: "",
        endDate: "",
        rent: ""
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const vacantUnits = units.filter((u: any) => u.status === "vacant");

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-display font-bold text-slate-950 uppercase tracking-tight">Contractual Lifecycle</h3>
          <p className="text-sm text-slate-400 font-medium">Manage active lease instruments and register fresh agreements</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-950 text-white px-8 py-3 rounded-[1.5rem] text-sm font-bold hover:shadow-premium transition-all flex items-center gap-3 active:scale-95 shadow-xl"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? "Dismiss Form" : "Execute New Instrument"}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 p-10 overflow-hidden mb-10"
          >
            <h4 className="text-lg font-display font-bold text-slate-950 mb-8 uppercase tracking-wide">Agreement Formalization</h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Counterparty (Resident)</label>
                <select 
                  required
                  value={formData.tenantId}
                  onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="">Assign Legal Entity</option>
                  {tenants.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Target Asset</label>
                <select 
                  required
                  value={formData.unitId}
                  onChange={(e) => {
                    const unit = units.find((u: any) => u.id === e.target.value) as any;
                    setFormData({...formData, unitId: e.target.value, rent: unit?.rent || ""});
                  }}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select Vacant Portfolio</option>
                  {vacantUnits.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.propertyName} - Unit {u.number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Commencement Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold focus:ring-4 focus:ring-indigo-50" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Termination Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold focus:ring-4 focus:ring-indigo-50" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Agreed Monthly Yield (₵)</label>
                <input 
                  type="number" 
                  required
                  value={formData.rent}
                  onChange={(e) => setFormData({...formData, rent: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold text-indigo-600 focus:ring-4 focus:ring-indigo-50" 
                />
              </div>
              <div className="lg:col-span-3 flex justify-end">
                <button type="submit" className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                  Authorize & Finalize Instrument
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
           <h3 className="text-xl font-display font-bold text-slate-950 uppercase tracking-tight">Active Legal Obligations</h3>
           <p className="text-xs text-slate-400 font-medium mt-1">Audit of current contractual instruments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="py-6 px-10">Instrument ID</th>
                <th className="py-6">Counterparty</th>
                <th className="py-6">Target Asset</th>
                <th className="py-6">Validity Span</th>
                <th className="py-6 text-right">Yield (₵)</th>
                <th className="py-6 px-10 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leases.map((l: any, i: number) => {
                const tenant = tenants.find((t: any) => t.id === l.tenantId) as any;
                const unit = units.find((u: any) => u.id === l.unitId) as any;
                return (
                  <motion.tr 
                    key={l.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-6 px-10">
                       <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-tighter">#{l.id}</span>
                    </td>
                    <td className="py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                             {tenant?.name.charAt(0) || "U"}
                          </div>
                          <span className="text-sm font-bold text-slate-900 leading-tight">{tenant?.name || "Unidentified"}</span>
                       </div>
                    </td>
                    <td className="py-6 font-bold text-indigo-600 text-xs uppercase tracking-tighter">
                      {unit ? `Unit ${unit.number} / ${unit.propertyName}` : "Unknown Asset"}
                    </td>
                    <td className="py-6">
                       <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                          <span>{l.startDate}</span>
                          <span className="text-slate-300">→</span>
                          <span>{l.endDate}</span>
                       </div>
                    </td>
                    <td className="py-6 text-right">
                       <span className="text-sm font-display font-bold text-slate-950">₵{l.rent.toLocaleString()}</span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-indigo-100">
                        {l.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

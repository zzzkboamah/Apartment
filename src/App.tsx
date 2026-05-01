import { useState, useEffect } from "react";
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
  Plus
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "tenants", label: "Tenants", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "leases", label: "Leases", icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Building2 className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">LuxeStay</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize italic">
              {activeTab}
            </h2>
            <p className="text-slate-500 text-sm">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full shadow-sm border border-slate-100">
              <Plus className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full shadow-sm border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "properties" && <PropertiesView />}
            {activeTab === "tenants" && <TenantsView />}
            {activeTab === "payments" && <PaymentsView />}
            {activeTab === "maintenance" && <MaintenanceView />}
            {activeTab === "leases" && <LeasesView />}
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

  if (!data) return <div className="animate-pulse flex space-x-4">Loading...</div>;

  const stats = [
    { label: "Total Revenue", value: `$${data.summary.totalRevenue.toLocaleString()}`, change: "+12.5%", icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
    { label: "Occupied Units", value: data.summary.occupiedUnits, change: `${Math.round((data.summary.occupiedUnits / data.summary.totalUnits) * 100)}%`, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Vacant Units", value: data.summary.vacantUnits, change: "Critical", icon: Building2, color: "bg-amber-50 text-amber-600" },
    { label: "Maintenance", value: data.summary.maintenanceRequests, change: "Pending", icon: Wrench, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.change.startsWith("+") ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueTrends}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Recent Payments
            <span className="text-xs font-normal text-slate-400">Past 30 days</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs font-medium uppercase tracking-wider border-bottom border-slate-100">
                  <th className="pb-4 font-semibold">Tenant</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentPayments.map((payment: any, i: number) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {payment.tenantId}
                        </div>
                        <span className="text-sm font-medium text-slate-700">Tenant {payment.tenantId}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-500">{payment.date}</td>
                    <td className="py-4 text-sm font-bold text-slate-900">${payment.amount}</td>
                    <td className="py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        payment.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Maintenance Overview</h3>
          <div className="space-y-6">
            {data.maintenanceSummary.map((m: any, i: number) => (
              <div key={i} className="flex gap-4 group">
                <div className={cn(
                  "w-2 rounded-full",
                  m.priority === "high" ? "bg-rose-500" : "bg-amber-500"
                )} />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{m.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-medium text-slate-400">{m.date}</span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{m.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
            View All Requests
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertiesView() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("/api/properties").then(res => res.json()).then(setProperties);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Manage Properties</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {properties.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:ring-2 hover:ring-indigo-100 transition-all">
            <div className="h-48 relative overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-indigo-700">
                {p.units} Units
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-slate-900">{p.name}</h4>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-0.5 rounded text-yellow-700">
                  <span className="text-xs font-bold">★ {p.rating}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6">{p.address}</p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex gap-4">
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Occupancy</p>
                      <p className="text-sm font-bold text-slate-800">85%</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">In-Progress</p>
                      <p className="text-sm font-bold text-slate-800">2 Units</p>
                   </div>
                </div>
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View Units <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TenantsView() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    fetch("/api/tenants").then(res => res.json()).then(setTenants);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-slate-900">Tenant Directory</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search name, unit, or email..." 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4">Name</th>
              <th className="pb-4">Unit</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Phone</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tenants.map((t: any) => (
              <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-bold text-slate-800 text-sm">{t.name}</td>
                <td className="py-4 text-xs font-bold text-indigo-600 uppercase">{t.unitId}</td>
                <td className="py-4 text-xs text-slate-500">{t.email}</td>
                <td className="py-4 text-xs text-slate-500">{t.phone}</td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900">Edit</button>
                    <button className="text-[10px] font-bold text-rose-400 hover:text-rose-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
             <p className="text-indigo-100 text-xs font-bold uppercase">Total Income</p>
             <h4 className="text-3xl font-bold mt-1">$24,500</h4>
             <p className="text-indigo-200 text-[10px] mt-4 flex items-center gap-1">
                <span>↑ 8.2%</span> compared to last month
             </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Outstanding</p>
             <h4 className="text-3xl font-bold mt-1 text-slate-900">$1,500</h4>
             <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]" />
             </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Expenses</p>
             <h4 className="text-3xl font-bold mt-1 text-slate-900">$4,200</h4>
             <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-rose-500 h-full w-[20%]" />
             </div>
          </div>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
            <button className="text-indigo-600 text-xs font-bold border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4">Transaction ID</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-xs font-bold text-slate-800">{p.id.toUpperCase()}</td>
                    <td className="py-4 text-xs text-slate-500">{p.date}</td>
                    <td className="py-4 text-xs text-slate-500">{p.method}</td>
                    <td className="py-4 text-xs font-bold text-slate-900">${p.amount}</td>
                    <td className="py-4 font-bold">
                       <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] uppercase",
                          p.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                       )}>
                          {p.status}
                       </span>
                    </td>
                  </tr>
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

  useEffect(() => {
    fetch("/api/maintenance").then(res => res.json()).then(setRequests);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-900">Active Requests</h3>
             <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-[10px]">{requests.length} Alert</span>
          </div>
          {requests.map((r: any) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group">
               <div className="absolute top-5 right-5">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    r.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  )}>
                    {r.priority}
                  </span>
               </div>
               <h4 className="font-bold text-slate-800">{r.title}</h4>
               <p className="text-xs text-slate-500 mt-1">{r.description}</p>
               <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r.unitId}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r.date}</span>
                  </div>
               </div>
               <div className="mt-4 flex gap-2 invisible group-hover:visible transition-all">
                  <button className="flex-1 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg hover:bg-indigo-100">Assign Vendor</button>
                  <button className="flex-1 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-100">Mark Completed</button>
               </div>
            </div>
          ))}
       </div>

       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl self-start sticky top-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Create Service Order</h3>
          <form className="space-y-4">
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Title</label>
                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="e.g. Broken AC in Unit 102" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Unit</label>
                   <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                      <option>Select Unit</option>
                      <option>101</option>
                      <option>102</option>
                      <option>2001</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Priority</label>
                   <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                   </select>
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Description</label>
                <textarea rows={4} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none" placeholder="Provide detailed information about the issue..."></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                Submit Request <ChevronRight className="w-5 h-5" />
             </button>
          </form>
       </div>
    </div>
  );
}

function LeasesView() {
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    fetch("/api/leases").then(res => res.json()).then(setLeases);
  }, []);

  if (leases.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-dashed border-slate-200">
         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="text-slate-400 w-8 h-8" />
         </div>
         <h3 className="text-lg font-bold text-slate-800">Lease Management</h3>
         <p className="text-slate-500 text-sm mt-1 max-w-sm text-center">Manage legal agreements, lease renewals, and document storage from this module.</p>
         <button className="mt-8 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            Upload Master Lease Template
         </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 font-primary">Active Leases</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4">Lease ID</th>
              <th className="pb-4">Unit</th>
              <th className="pb-4">Start Date</th>
              <th className="pb-4">End Date</th>
              <th className="pb-4">Rent</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leases.map((l: any) => (
              <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 text-xs font-bold text-slate-800 uppercase tracking-tighter">{l.id}</td>
                <td className="py-4 text-xs font-bold text-indigo-600 uppercase tracking-tighter">{l.unitId}</td>
                <td className="py-4 text-xs text-slate-500">{l.startDate}</td>
                <td className="py-4 text-xs text-slate-500">{l.endDate}</td>
                <td className="py-4 text-xs font-bold text-slate-900">${l.rent}</td>
                <td className="py-4">
                   <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase">
                      {l.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

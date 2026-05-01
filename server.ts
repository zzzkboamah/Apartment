import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for the application
  const db = {
    properties: [
      { id: "1", name: "Green Valley Apartments", address: "123 Green St, Cityville", units: 12, rating: 4.5, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400" },
      { id: "2", name: "Skyline Towers", address: "456 Sky Ave, Metro City", units: 25, rating: 4.8, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400" }
    ],
    units: [
      { id: "u1", propertyId: "1", number: "101", type: "2BR", rent: 1200, status: "occupied", tenantId: "t1" },
      { id: "u2", propertyId: "1", number: "102", type: "1BR", rent: 850, status: "vacant" },
      { id: "u3", propertyId: "2", number: "2001", type: "Studio", rent: 1500, status: "occupied", tenantId: "t2" }
    ],
    tenants: [
      { id: "t1", name: "Alice Johnson", email: "alice@example.com", phone: "555-0101", unitId: "u1" },
      { id: "t2", name: "Bob Smith", email: "bob@example.com", phone: "555-0102", unitId: "u3" }
    ],
    leases: [
      { id: "l1", tenantId: "t1", unitId: "u1", startDate: "2024-01-01", endDate: "2025-01-01", rent: 1200, status: "active" },
      { id: "l2", tenantId: "t2", unitId: "u3", startDate: "2023-06-01", endDate: "2024-06-01", rent: 1500, status: "active" }
    ],
    payments: [
      { id: "p1", tenantId: "t1", amount: 1200, date: "2024-04-01", status: "paid", method: "Bank Transfer" },
      { id: "p2", tenantId: "t2", amount: 1500, date: "2024-04-01", status: "pending", method: "Credit Card" }
    ],
    maintenance: [
      { id: "m1", unitId: "u1", title: "Leaky Faucet", description: "Kitchen faucet dripping constantly.", status: "pending", priority: "low", date: "2024-04-28" }
    ]
  };

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    const totalUnits = db.units.length;
    const occupiedUnits = db.units.filter(u => u.status === "occupied").length;
    const vacantUnits = totalUnits - occupiedUnits;
    const totalRevenue = db.payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const pendingDues = db.payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

    const revenueTrends = [
      { month: "Jan", income: 18500, expenses: 4200 },
      { month: "Feb", income: 21000, expenses: 4800 },
      { month: "Mar", income: 19800, expenses: 5100 },
      { month: "Apr", income: 24500, expenses: 4200 }
    ];

    res.json({
      summary: {
        totalProperties: db.properties.length,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        totalRevenue,
        pendingDues,
        maintenanceRequests: db.maintenance.filter(m => m.status === "pending").length
      },
      recentPayments: db.payments.slice(-5).reverse(),
      maintenanceSummary: db.maintenance.slice(-5).reverse(),
      revenueTrends
    });
  });

  app.get("/api/properties", (req, res) => res.json(db.properties));
  app.get("/api/units", (req, res) => {
    const propertyId = req.query.propertyId as string;
    if (propertyId) {
      return res.json(db.units.filter(u => u.propertyId === propertyId));
    }
    res.json(db.units);
  });
  app.get("/api/tenants", (req, res) => res.json(db.tenants));
  app.get("/api/leases", (req, res) => res.json(db.leases));
  app.get("/api/payments", (req, res) => res.json(db.payments));
  app.get("/api/maintenance", (req, res) => res.json(db.maintenance));

  // POST routes for adding new data (basic implementations)
  app.post("/api/maintenance", (req, res) => {
    const newRequest = {
      id: "m" + (db.maintenance.length + 1),
      ...req.body,
      date: new Date().toISOString().split("T")[0]
    };
    db.maintenance.push(newRequest);
    res.json(newRequest);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

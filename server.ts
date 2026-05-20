import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "./src/initialData.js";
import { Product, Category, Friend, Order, ContactMessage } from "./src/types.js";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const FRIENDS_FILE = path.join(DATA_DIR, "friends.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

// Helper to ensure data directory and files exist with initial content
async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Already exists
  }

  // Helper init function
  const initFile = async (filePath: string, defaultData: any) => {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
    }
  };

  await initFile(PRODUCTS_FILE, INITIAL_PRODUCTS);
  await initFile(CATEGORIES_FILE, INITIAL_CATEGORIES);
  await initFile(FRIENDS_FILE, [
    {
      id: "f1",
      name: "Juan Pérez",
      whatsapp: "1123456789",
      email: "juan@perez.com",
      points: 120,
      isMayorista: false,
      address: "Calle de la Pesca 123",
      city: "Itá Ibaté",
      provincia: "Corrientes",
      cp: "3480",
      createdAt: new Date("2026-05-18T10:00:00Z").toISOString()
    },
    {
      id: "f2",
      name: "Carlos Corrientes",
      whatsapp: "5493781463440",
      email: "carlos@corrientes.com",
      points: 580,
      isMayorista: true,
      address: "Av Costanera s/n",
      city: "Paso de la Patria",
      provincia: "Corrientes",
      cp: "3409",
      createdAt: new Date("2026-05-19T14:30:00Z").toISOString()
    }
  ]);
  await initFile(ORDERS_FILE, [
    {
      id: "PP-8902",
      customerName: "Alejandro Corrientes",
      customerWhatsapp: "5493791234567",
      customerEmail: "informatecorrientes@gmail.com",
      shippingAddress: "Ruta Nacional 12, Km 1180",
      shippingCity: "Itá Ibaté",
      shippingProvincia: "corrientes",
      shippingCp: "3480",
      shippingNotes: "Dejar en el Puesto de pesca.",
      items: [
        {
          productId: "p8",
          productName: "Laguna Professional Series Edition 2024",
          quantity: 1,
          price: 185000,
          selectedModel: "7.1:1 (Derecho)"
        },
        {
          productId: "p10",
          productName: "Kit Señuelos Doradillo",
          quantity: 2,
          price: 45000
        }
      ],
      subtotal: 275000,
      shippingPrice: 0,
      total: 275000,
      status: "En Tránsito",
      createdAt: new Date("2026-05-20T08:00:00Z").toISOString()
    },
    {
      id: "PP-8841",
      customerName: "Alejandro Corrientes",
      customerWhatsapp: "+54 9 379 1234567",
      customerEmail: "informatecorrientes@gmail.com",
      shippingAddress: "Av. San Martín 1110",
      shippingCity: "Itá Ibaté",
      shippingProvincia: "corrientes",
      shippingCp: "3480",
      items: [
        {
          productId: "p1",
          productName: "Reel Rotativo Shimano Curado DC",
          quantity: 1,
          price: 195000,
          selectedModel: "Manija Derecha"
        },
        {
          productId: "p3",
          productName: "Caña Baitcasting Marine Sports 2.10m",
          quantity: 1,
          price: 98500
        },
        {
          productId: "p5",
          productName: "Mustad UltraPoint",
          quantity: 1,
          price: 2500
        }
      ],
      subtotal: 296000,
      shippingPrice: 0,
      total: 296000,
      status: "Entregado",
      createdAt: new Date("2026-05-15T09:15:00Z").toISOString()
    },
    {
      id: "PP-8710",
      customerName: "Alejandro Corrientes",
      customerWhatsapp: "+54 9 379 1234567",
      customerEmail: "informatecorrientes@gmail.com",
      shippingAddress: "Ruta Nacional 12, Km 1180",
      shippingCity: "Itá Ibaté",
      shippingProvincia: "corrientes",
      shippingCp: "3480",
      items: [
        {
          productId: "p9",
          productName: "Bolso Estanco Waterdog 40L",
          quantity: 1,
          price: 85000,
          selectedModel: "Verde Oliva"
        }
      ],
      subtotal: 85000,
      shippingPrice: 0,
      total: 85000,
      status: "Entregado",
      createdAt: new Date("2026-05-02T16:45:00Z").toISOString()
    }
  ]);
  await initFile(MESSAGES_FILE, [
    {
      id: "m1",
      name: "Juan Pérez",
      email: "juan@perez.com",
      subject: "Consulta sobre caña de pescar",
      message: "Hola amigos de Pirá Pará! Tienen stock de la caña para baitcasting Marine Sports 2.10m? Gracias!",
      createdAt: new Date("2026-05-19T11:00:00Z").toISOString()
    }
  ]);
}

async function startServer() {
  await ensureDataFiles();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper read/write DB functions
  const readData = async (filePath: string) => {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  };

  const writeData = async (filePath: string, data: any) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  };

  // API Endpoints: Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await readData(PRODUCTS_FILE);
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const products: Product[] = await readData(PRODUCTS_FILE);
      const newProduct: Product = req.body;

      if (!newProduct.id) {
        newProduct.id = "p_" + Date.now();
      }

      const index = products.findIndex((p) => p.id === newProduct.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...newProduct };
      } else {
        products.push(newProduct);
      }

      await writeData(PRODUCTS_FILE, products);
      res.json({ success: true, product: newProduct });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const products: Product[] = await readData(PRODUCTS_FILE);
      const filtered = products.filter((p) => p.id !== req.params.id);
      await writeData(PRODUCTS_FILE, filtered);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoints: Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await readData(CATEGORIES_FILE);
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categories: Category[] = await readData(CATEGORIES_FILE);
      const newCat: Category = req.body;

      if (!newCat.id) {
        newCat.id = "c_" + Date.now();
      }

      const index = categories.findIndex((c) => c.id === newCat.id);
      if (index !== -1) {
        categories[index] = newCat;
      } else {
        categories.push(newCat);
      }

      await writeData(CATEGORIES_FILE, categories);
      res.json({ success: true, category: newCat });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const categories: Category[] = await readData(CATEGORIES_FILE);
      const filtered = categories.filter((c) => c.id !== req.params.id);
      await writeData(CATEGORIES_FILE, filtered);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoints: Cofradía Friends
  app.get("/api/friends", async (req, res) => {
    try {
      const friends = await readData(FRIENDS_FILE);
      res.json(friends);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/friends", async (req, res) => {
    try {
      const friends: Friend[] = await readData(FRIENDS_FILE);
      const { name, whatsapp, email, address, city, provincia, cp } = req.body;

      if (!name || !whatsapp) {
        return res.status(400).json({ error: "Nombre y WhatsApp son obligatorios" });
      }

      // Format clean numbers for duplicate check
      const cleanInput = whatsapp.replace(/[^0-9]/g, '');
      const duplicateIndex = friends.findIndex((f) => {
        const cleanF = f.whatsapp.replace(/[^0-9]/g, '');
        return cleanF === cleanInput || cleanF.endsWith(cleanInput) || cleanInput.endsWith(cleanF);
      });

      if (duplicateIndex !== -1) {
        return res.json({ success: true, message: "Ya estás registrado como amigo!", friend: friends[duplicateIndex] });
      }

      const newFriend: Friend = {
        id: "f_" + Date.now(),
        name,
        whatsapp,
        email: email || "",
        address: address || "",
        city: city || "",
        provincia: provincia || "",
        cp: cp || "",
        points: 150, // Nice 150 points sign up loyalty bonus!
        isMayorista: false,
        createdAt: new Date().toISOString()
      };

      friends.push(newFriend);
      await writeData(FRIENDS_FILE, friends);
      res.json({ success: true, friend: newFriend });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/friends/login", async (req, res) => {
    try {
      const friends: Friend[] = await readData(FRIENDS_FILE);
      const { whatsapp } = req.body; // Can be a cell phone number or an email
      if (!whatsapp) {
        return res.status(400).json({ error: "Se requiere celular o email" });
      }

      const inputStr = whatsapp.trim();
      let friend: Friend | undefined = undefined;

      if (inputStr.includes("@")) {
        // Email login match
        friend = friends.find((f) => f.email && f.email.trim().toLowerCase() === inputStr.toLowerCase());
      } else {
        // Cellphone WhatsApp login match
        const cleanInput = inputStr.replace(/[^0-9]/g, '');
        if (cleanInput) {
          friend = friends.find((f) => {
            const cleanF = f.whatsapp.replace(/[^0-9]/g, '');
            return cleanF === cleanInput || cleanF.endsWith(cleanInput) || cleanInput.endsWith(cleanF);
          });
        }
      }

      if (!friend) {
        return res.status(404).json({ 
          error: "¡Hola! No registramos este contacto de Cofradía.", 
          notFound: true, 
          input: inputStr 
        });
      }

      // Automatically tag specific admin email or administrative field
      if (friend.email && friend.email.trim().toLowerCase() === "informatecorrientes@gmail.com") {
        friend.isAdmin = true;
      }

      res.json({ success: true, friend });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/friends/update", async (req, res) => {
    try {
      const friends: Friend[] = await readData(FRIENDS_FILE);
      const updatedFriend: Friend = req.body;

      if (!updatedFriend.id) {
        return res.status(400).json({ error: "Falta ID del miembro" });
      }

      const index = friends.findIndex((f) => f.id === updatedFriend.id);
      if (index === -1) {
        return res.status(404).json({ error: "Miembro no encontrado" });
      }

      // Merge and protect fields (don't let edit client alter points or isMayorista unless specified by admin)
      friends[index] = {
        ...friends[index],
        name: updatedFriend.name || friends[index].name,
        whatsapp: updatedFriend.whatsapp || friends[index].whatsapp,
        email: updatedFriend.email ?? friends[index].email,
        address: updatedFriend.address ?? friends[index].address,
        city: updatedFriend.city ?? friends[index].city,
        provincia: updatedFriend.provincia ?? friends[index].provincia,
        cp: updatedFriend.cp ?? friends[index].cp,
      };

      await writeData(FRIENDS_FILE, friends);
      res.json({ success: true, friend: friends[index] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/friends/:id/admin-update", async (req, res) => {
    try {
      const friends: Friend[] = await readData(FRIENDS_FILE);
      const { points, isMayorista, isAdmin } = req.body;

      const index = friends.findIndex((f) => f.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Miembro no encontrado" });
      }

      if (points !== undefined) friends[index].points = Number(points);
      if (isMayorista !== undefined) friends[index].isMayorista = Boolean(isMayorista);
      if (isAdmin !== undefined) friends[index].isAdmin = Boolean(isAdmin);

      await writeData(FRIENDS_FILE, friends);
      res.json({ success: true, friend: friends[index] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/bulk-price", async (req, res) => {
    try {
      const products: Product[] = await readData(PRODUCTS_FILE);
      const { category, provider, percentChange, operator } = req.body;

      if (!percentChange || isNaN(Number(percentChange))) {
        return res.status(400).json({ error: "Porcentaje de cambio inválido" });
      }

      const factor = 1 + (Number(percentChange) / 100);
      let count = 0;

      const updatedProducts = products.map((p) => {
        const matchesCategory = !category || category === "all" || p.category === category;
        const matchesProvider = !provider || 
                                p.name.toLowerCase().includes(provider.toLowerCase()) || 
                                p.description.toLowerCase().includes(provider.toLowerCase());

        if (matchesCategory && matchesProvider) {
          count++;
          let newPrice = p.price;
          if (operator === "multiply") {
            newPrice = Math.round(p.price * factor);
          } else if (operator === "add") {
            newPrice = Math.round(p.price + Number(percentChange));
          }
          
          return {
            ...p,
            price: newPrice,
            originalPrice: p.price
          };
        }
        return p;
      });

      await writeData(PRODUCTS_FILE, updatedProducts);
      res.json({ success: true, count, message: `Se actualizaron los precios de ${count} productos correctamente.` });
    } catch (err: any) {
      res.status(550).json({ error: err.message });
    }
  });

  app.delete("/api/friends/:id", async (req, res) => {
    try {
      const friends: Friend[] = await readData(FRIENDS_FILE);
      const filtered = friends.filter((f) => f.id !== req.params.id);
      await writeData(FRIENDS_FILE, filtered);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoints: Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await readData(ORDERS_FILE);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orders: Order[] = await readData(ORDERS_FILE);
      const checkoutData = req.body;

      const orderId = "PP-" + (Math.floor(1000 + Math.random() * 9000));
      const newOrder: Order = {
        id: orderId,
        customerName: checkoutData.customerName,
        customerWhatsapp: checkoutData.customerWhatsapp,
        customerEmail: checkoutData.customerEmail,
        shippingAddress: checkoutData.shippingAddress,
        shippingCity: checkoutData.shippingCity,
        shippingProvincia: checkoutData.shippingProvincia,
        shippingCp: checkoutData.shippingCp,
        shippingNotes: checkoutData.shippingNotes || "",
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        shippingPrice: checkoutData.shippingPrice || 0,
        total: checkoutData.total,
        status: "Pendiente",
        createdAt: new Date().toISOString()
      };

      orders.unshift(newOrder); // New orders at the top
      await writeData(ORDERS_FILE, orders);

      // Loyalty points logic: search for a friend with a matching Whatsapp and award points
      try {
        const friends: Friend[] = await readData(FRIENDS_FILE);
        const shopperPhone = newOrder.customerWhatsapp.replace(/[^0-9]/g, '');
        const friendIdx = friends.findIndex((f) => {
          const cleanF = f.whatsapp.replace(/[^0-9]/g, '');
          return cleanF === shopperPhone || cleanF.endsWith(shopperPhone) || shopperPhone.endsWith(cleanF);
        });

        if (friendIdx !== -1) {
          const ptsEarned = Math.max(10, Math.floor(newOrder.total / 1000));
          const currentPts = friends[friendIdx].points || 0;
          friends[friendIdx].points = currentPts + ptsEarned;
          await writeData(FRIENDS_FILE, friends);
          console.log(`Cofradía Pirá Pará: Usuario ${friends[friendIdx].name} obtuvo +${ptsEarned} puntos.`);
        }
      } catch (ptsErr) {
        console.error("No se pudo acreditar puntos: ", ptsErr);
      }

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const orders: Order[] = await readData(ORDERS_FILE);
      const { status } = req.body;

      const index = orders.findIndex((o) => o.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      orders[index].status = status;
      await writeData(ORDERS_FILE, orders);
      res.json({ success: true, order: orders[index] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const orders: Order[] = await readData(ORDERS_FILE);
      const filtered = orders.filter((o) => o.id !== req.params.id);
      await writeData(ORDERS_FILE, filtered);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoints: Contact Messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await readData(MESSAGES_FILE);
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messages: ContactMessage[] = await readData(MESSAGES_FILE);
      const { name, email, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Nombre, Email y Mensaje son requeridos" });
      }

      const newMessage: ContactMessage = {
        id: "m_" + Date.now(),
        name,
        email,
        subject: subject || "Sin Asunto",
        message,
        createdAt: new Date().toISOString()
      };

      messages.push(newMessage);
      await writeData(MESSAGES_FILE, messages);
      res.json({ success: true, message: newMessage });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const messages: ContactMessage[] = await readData(MESSAGES_FILE);
      const filtered = messages.filter((m) => m.id !== req.params.id);
      await writeData(MESSAGES_FILE, filtered);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoint to download complete system backup
  app.get("/api/admin/backup", async (req, res) => {
    try {
      const [products, categories, friends, orders, messages] = await Promise.all([
        readData(PRODUCTS_FILE),
        readData(CATEGORIES_FILE),
        readData(FRIENDS_FILE),
        readData(ORDERS_FILE),
        readData(MESSAGES_FILE)
      ]);

      const backupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        products,
        categories,
        friends,
        orders,
        messages
      };

      res.setHeader("Content-Disposition", `attachment; filename=pirapara_backup_${Date.now()}.json`);
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(backupData, null, 2));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Endpoint to restore system data from backup
  app.post("/api/admin/restore", express.json({ limit: "20mb" }), async (req, res) => {
    try {
      const { products, categories, friends, orders, messages } = req.body;
      
      const writePromises: Promise<any>[] = [];
      if (products) writePromises.push(writeData(PRODUCTS_FILE, products));
      if (categories) writePromises.push(writeData(CATEGORIES_FILE, categories));
      if (friends) writePromises.push(writeData(FRIENDS_FILE, friends));
      if (orders) writePromises.push(writeData(ORDERS_FILE, orders));
      if (messages) writePromises.push(writeData(MESSAGES_FILE, messages));

      await Promise.all(writePromises);
      res.json({ success: true, message: "Sistema restaurado exitosamente desde el JSON" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Integration context
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
    console.log(`Pirá Pará listening on port ${PORT}`);
  });
}

startServer();

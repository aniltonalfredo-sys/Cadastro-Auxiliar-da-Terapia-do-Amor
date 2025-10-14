import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auxiliarRoutes from "./routes/auxiliar.routes";

dotenv.config();
const app = express();

// app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use(
  cors({
    // origin: ["http://localhost:3000"], // porta do teu frontend (Vite/React)
    origin: "*", // porta do teu frontend (Vite/React)
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auxiliares", auxiliarRoutes);

// expressListRoutes(utilizadorRoutes, { prefix: "/api/utilizador", forceUnixPathStyle: true });


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
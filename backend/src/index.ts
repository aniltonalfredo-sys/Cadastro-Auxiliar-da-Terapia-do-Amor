import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auxiliarRoutes from "./routes/auxiliar.routes";
import authRoutes from "./routes/auth.routes"
import activityRoutes from "./routes/activity.routes"

import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

dotenv.config();
const app = express();

async function testDatabaseConnection() {
  console.log('🔍 Testando conexão com o banco...');
  
  const dbUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL:', dbUrl ? dbUrl.replace(/:([^:]*)@/, ':****@') : 'Não definida');

  try {
    // Teste com mysql2 primeiro
    const connection = await mysql.createConnection({
      host: 'www.tdoa-auxiliares.ao',
      user: 'tdoaauxi_tdoa',
      password: 'S-5^;nAvx.A^)L60', // Tente ambas as versões
      database: 'tdoaauxi_tdoa',
      port: 3306
    });
    
    console.log('✅ Conexão MySQL2 bem-sucedida!');
    await connection.end();
    
    // Teste com Prisma
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Conexão Prisma bem-sucedida!');
    await prisma.$disconnect();
    
  } catch (error: any) {
    console.error('❌ Erro de conexão:', error.message);
    console.error('Código do erro:', error.code);
  }
}

testDatabaseConnection().then(() => {
  // Inicie seu servidor aqui
  console.log('Servidor pronto para conexões.');
});

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
app.use("/api/auth", authRoutes)
app.use("/api/activity", activityRoutes)
// expressListRoutes(utilizadorRoutes, { prefix: "/api/utilizador", forceUnixPathStyle: true });


const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
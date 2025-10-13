import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed da base de dados...");

  const mockAuxiliares = [
    {
      nome: "Maria Silva Santos",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      igreja: "Igreja Central",
      regiao: "Centro",
      estadoCivil: "Solteiro(a)",
      telefone: "+244 923 456 789",
      obreiro: true,
      batizado: true,
      dataCadastro: new Date("2024-01-15"),
      enderecoResidencial: {
        tipo: "Residencial",
        provincia: "Luanda",
        municipio: "Luanda",
        bairro: "Maculusso",
        rua: "Rua das Flores",
        numeroCasa: "123",
        pontoReferencia: "Próximo ao Mercado Central",
      },
      enderecoIgreja: {
        tipo: "Igreja",
        provincia: "Luanda",
        municipio: "Luanda",
        bairro: "Maianga",
        rua: "Av. 4 de Fevereiro",
        numeroCasa: "1000",
        pontoReferencia: "Em frente ao Banco BFA",
      },
    },
    {
      nome: "João Pedro Oliveira",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
      igreja: "Igreja Nova Esperança",
      regiao: "Norte",
      estadoCivil: "Solteiro(a)",
      telefone: "+244 945 678 901",
      obreiro: false,
      batizado: true,
      dataCadastro: new Date("2024-01-20"),
      enderecoResidencial: {
        tipo: "Residencial",
        provincia: "Luanda",
        municipio: "Viana",
        bairro: "Zango",
        rua: "Rua do Progresso",
        numeroCasa: "456",
        pontoReferencia: "Perto da Escola Primária",
      },
      enderecoIgreja: {
        tipo: "Igreja",
        provincia: "Luanda",
        municipio: "Viana",
        bairro: "Zango II",
        rua: "Av. Principal",
        numeroCasa: "2500",
        pontoReferencia: "Ao lado da Farmácia",
      },
    },
    {
      nome: "Ana Paula Costa",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      igreja: "Igreja Fé Viva",
      regiao: "Sul",
      estadoCivil: "Casado(a)",
      telefone: "+244 912 345 678",
      obreiro: true,
      batizado: true,
      dataCadastro: new Date("2024-01-22"),
      enderecoResidencial: {
        tipo: "Residencial",
        provincia: "Benguela",
        municipio: "Benguela",
        bairro: "Praia Morena",
        rua: "Rua da Liberdade",
        numeroCasa: "789",
        pontoReferencia: "Próximo à Praia",
      },
      enderecoIgreja: {
        tipo: "Igreja",
        provincia: "Benguela",
        municipio: "Benguela",
        bairro: "Centro",
        rua: "Av. Norton de Matos",
        numeroCasa: "1500",
        pontoReferencia: "Em frente ao Hospital",
      },
      conjuge: {
        nome: "Roberto Costa",
        telefone: "+244 912 345 679",
        foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
        obreiro: true,
        batizado: true,
      },
    },
    {
      nome: "Beatriz Fernandes Lima",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
      igreja: "Igreja Amor Perfeito",
      regiao: "Oeste",
      estadoCivil: "Divorciado(a)",
      telefone: "+244 956 789 012",
      obreiro: true,
      batizado: true,
      dataCadastro: new Date("2024-01-28"),
      enderecoResidencial: {
        tipo: "Residencial",
        provincia: "Huambo",
        municipio: "Huambo",
        bairro: "Benfica",
        rua: "Av. da Independência",
        numeroCasa: "654",
        pontoReferencia: "Perto do Centro Comercial",
      },
      enderecoIgreja: {
        tipo: "Igreja",
        provincia: "Huambo",
        municipio: "Huambo",
        bairro: "Centro",
        rua: "Rua Dr. António Agostinho Neto",
        numeroCasa: "1200",
        pontoReferencia: "Ao lado da Câmara Municipal",
      },
    },
  ];

  for (const aux of mockAuxiliares) {
    await prisma.auxiliar.create({
      data: {
        nome: aux.nome,
        foto: aux.foto,
        igreja: aux.igreja,
        regiao: aux.regiao,
        estadoCivil: aux.estadoCivil,
        telefone: aux.telefone,
        obreiro: aux.obreiro,
        batizado: aux.batizado,
        dataCadastro: aux.dataCadastro,
        enderecoResidencial: {
          create: aux.enderecoResidencial,
        },
        enderecoIgreja: {
          create: aux.enderecoIgreja,
        },
        conjuge: aux.conjuge
          ? {
              create: aux.conjuge,
            }
          : undefined,
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

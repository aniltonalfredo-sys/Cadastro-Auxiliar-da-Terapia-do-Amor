import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed da base de dados...");

  try {
    // Limpar dados na ordem correta (devido às constraints de foreign key)
    await prisma.auxiliar.deleteMany();
    await prisma.conjuge.deleteMany();
    await prisma.endereco.deleteMany();
    console.log("🗑️ Dados antigos removidos");
  } catch (error) {
    console.log("ℹ️  Tabelas vazias ou não existentes, continuando...");
  }

  const mockAuxiliares = [
    {
      nome: "Maria Silva Santos",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      igreja: "Igreja Central",
      regiao: "Centro",
      estadoCivil: "Solteiro(a)",
      telefone: "+244 923 456 789",
      email: "maria.silva@email.com",
      dataNascimento: new Date("1990-05-15"),
      obreiro: true,
      batizado: true,
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
      email: "joao.oliveira@email.com",
      dataNascimento: new Date("1988-08-22"),
      obreiro: false,
      batizado: true,
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
      email: "ana.costa@email.com",
      dataNascimento: new Date("1992-03-10"),
      obreiro: true,
      batizado: true,
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
      nome: "Carlos Eduardo Souza",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      igreja: "Igreja Luz Divina",
      regiao: "Leste",
      estadoCivil: "Solteiro(a)",
      telefone: "+244 934 567 890",
      email: "carlos.souza@email.com",
      dataNascimento: new Date("1995-11-30"),
      obreiro: false,
      batizado: false,
      enderecoResidencial: {
        tipo: "Residencial",
        provincia: "Huíla",
        municipio: "Lubango",
        bairro: "Comercial",
        rua: "Rua Sá da Bandeira",
        numeroCasa: "321",
        pontoReferencia: "Ao lado do Supermercado",
      },
      enderecoIgreja: {
        tipo: "Igreja",
        provincia: "Huíla",
        municipio: "Lubango",
        bairro: "Lajes",
        rua: "Rua Principal",
        numeroCasa: "800",
        pontoReferencia: "Próximo à Praça",
      },
    },
    {
      nome: "Beatriz Fernandes Lima",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
      igreja: "Igreja Amor Perfeito",
      regiao: "Oeste",
      estadoCivil: "Divorciado(a)",
      telefone: "+244 956 789 012",
      email: "beatriz.lima@email.com",
      dataNascimento: new Date("1985-07-18"),
      obreiro: true,
      batizado: true,
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
    }
  ];

  let createdCount = 0;
  
  for (const aux of mockAuxiliares) {
    try {
      // Criar primeiro os endereços
      const enderecoResidencial = await prisma.endereco.create({
        data: aux.enderecoResidencial
      });

      const enderecoIgreja = await prisma.endereco.create({
        data: aux.enderecoIgreja
      });

      // Criar o auxiliar
      const novoAuxiliar = await prisma.auxiliar.create({
        data: {
          nome: aux.nome,
          foto: aux.foto,
          igreja: aux.igreja,
          regiao: aux.regiao,
          estadoCivil: aux.estadoCivil,
          telefone: aux.telefone,
          email: aux.email,
          dataNascimento: aux.dataNascimento,
          obreiro: aux.obreiro,
          batizado: aux.batizado,
          enderecoResidencialId: enderecoResidencial.id,
          enderecoIgrejaId: enderecoIgreja.id,
        }
      });

      // Criar cônjuge se existir
      if (aux.conjuge) {
        await prisma.conjuge.create({
          data: {
            ...aux.conjuge,
            auxiliar: {
              connect: { id: novoAuxiliar.id }
            }
          }
        });
      }

      createdCount++;
      console.log(`✅ ${aux.nome} criado(a)`);
      
    } catch (error) {
      console.error(`❌ Erro ao criar ${aux.nome}:`, error);
    }
  }

  console.log(`\n🎉 Seed concluído com sucesso!`);
  console.log(`📊 ${createdCount} auxiliares criados`);
  console.log(`🏛️ Igrejas: Central, Nova Esperança, Fé Viva, Luz Divina, Amor Perfeito`);
  console.log(`🗺️ Regiões: Centro, Norte, Sul, Leste, Oeste`);
  console.log(`📍 Províncias: Luanda, Benguela, Huíla, Huambo`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔹 Cria um auxiliar completo com transação atômica
 */

export const criarAuxiliar = async (dados: any) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      // Criar o auxiliar com os relacionamentos aninhados
      const novoAuxiliar = await tx.auxiliar.create({
        data: {
          nome: dados.nome,
          foto: dados.foto || null,
          email: dados.email || null,
          dataNascimento: dados.dataNascimento ? new Date(dados.dataNascimento) : new Date(),
          igreja: dados.igreja,
          regiao: dados.regiao,
          estadoCivil: dados.estadoCivil,
          telefone: dados.telefone,
          obreiro: dados.obreiro === true || dados.obreiro === "true",
          batizado: dados.batizado === true || dados.batizado === "true",
          dataCadastro: dados.dataCadastro ? new Date(dados.dataCadastro) : new Date(),
          
          // Criar endereços aninhados
          enderecoResidencial: dados.enderecoResidencial ? {
            create: {
              tipo: "Residencial",
              provincia: dados.enderecoResidencial.provincia,
              municipio: dados.enderecoResidencial.municipio,
              bairro: dados.enderecoResidencial.bairro,
              rua: dados.enderecoResidencial.rua,
              numeroCasa: dados.enderecoResidencial.numeroCasa,
              pontoReferencia: dados.enderecoResidencial.pontoReferencia,
            }
          } : undefined,
          
          enderecoIgreja: dados.enderecoIgreja ? {
            create: {
              tipo: "Igreja",
              provincia: dados.enderecoIgreja.provincia,
              municipio: dados.enderecoIgreja.municipio,
              bairro: dados.enderecoIgreja.bairro,
              rua: dados.enderecoIgreja.rua,
              numeroCasa: dados.enderecoIgreja.numeroCasa,
              pontoReferencia: dados.enderecoIgreja.pontoReferencia,
            }
          } : undefined,
          
          // Criar cônjuge aninhado
          conjuge: dados.conjuge ? {
            create: {
              nome: dados.conjuge.nome,
              telefone: dados.conjuge.telefone,
              foto: dados.conjuge.foto || null,
              obreiro: dados.conjuge.obreiro === true || dados.conjuge.obreiro === "true",
              batizado: dados.conjuge.batizado === true || dados.conjuge.batizado === "true",
            }
          } : undefined,
        },
        include: {
          enderecoResidencial: true,
          enderecoIgreja: true,
          conjuge: true,
        },
      });

      return novoAuxiliar;
    } catch (error) {
      console.error("Erro ao criar auxiliar:", error);
      throw new Error("Erro ao criar auxiliar, operação revertida.");
    }
  });
};

/**
 * 📋 Lista todos os auxiliares com dados aninhados
 */
export const listarAuxiliares = async () => {
  try {
    return await prisma.auxiliar.findMany({
      orderBy: { dataCadastro: "desc" },
      include: {
        enderecoResidencial: true,
        enderecoIgreja: true,
        conjuge: true,
      },
    });
  } catch (error) {
    console.error("Erro ao listar auxiliares:", error);
    throw new Error("Erro ao listar auxiliares.");
  }
};

/**
 * 🔍 Busca um auxiliar pelo ID
 */
export const buscarAuxiliar = async (id: number) => {
  try {
    const auxiliar = await prisma.auxiliar.findUnique({
      where: { id },
      include: {
        enderecoResidencial: true,
        enderecoIgreja: true,
        conjuge: true,
      },
    });
    if (!auxiliar) throw new Error("Auxiliar não encontrado");
    return auxiliar;
  } catch (error) {
    console.error(`Erro ao buscar auxiliar [${id}]:`, error);
    throw new Error("Erro ao buscar auxiliar.");
  }
};

/**
 * ✏️ Atualiza um auxiliar (com controle transacional)
 */
export const atualizarAuxiliar = async (id: number, dados: any) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const existente = await tx.auxiliar.findUnique({ where: { id } });
      if (!existente) throw new Error("Auxiliar não encontrado");

      // Atualiza os endereços e cônjuge se existirem
      if (existente.enderecoResidencialId && dados.enderecoResidencial) {
        await tx.endereco.update({
          where: { id: existente.enderecoResidencialId },
          data: dados.enderecoResidencial,
        });
      }

      if (existente.enderecoIgrejaId && dados.enderecoIgreja) {
        await tx.endereco.update({
          where: { id: existente.enderecoIgrejaId },
          data: dados.enderecoIgreja,
        });
      }

      if (existente.conjugeId && dados.conjuge) {
        await tx.conjuge.update({
          where: { id: existente.conjugeId },
          data: dados.conjuge,
        });
      }

      // Atualiza o auxiliar principal
      const atualizado = await tx.auxiliar.update({
        where: { id },
        data: {
          nome: dados.nome,
          foto: dados.foto || existente.foto,
          igreja: dados.igreja,
          regiao: dados.regiao,
          estadoCivil: dados.estadoCivil,
          telefone: dados.telefone,
          obreiro: dados.obreiro === true || dados.obreiro === "true",
          batizado: dados.batizado === true || dados.batizado === "true",
        },
        include: {
          enderecoResidencial: true,
          enderecoIgreja: true,
          conjuge: true,
        },
      });

      return atualizado;
    } catch (error) {
      console.error("Erro ao atualizar auxiliar:", error);
      throw new Error("Erro ao atualizar auxiliar, operação revertida.");
    }
  });
};

/**
 * ❌ Elimina um auxiliar e dados associados
 */
export const eliminarAuxiliar = async (id: number) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const auxiliar = await tx.auxiliar.findUnique({
        where: { id },
        include: {
          enderecoResidencial: true,
          enderecoIgreja: true,
          conjuge: true,
        },
      });
      if (!auxiliar) throw new Error("Auxiliar não encontrado");

      // Exclui dependências primeiro
      if (auxiliar.enderecoResidencialId)
        await tx.endereco.delete({ where: { id: auxiliar.enderecoResidencialId } });
      if (auxiliar.enderecoIgrejaId)
        await tx.endereco.delete({ where: { id: auxiliar.enderecoIgrejaId } });
      if (auxiliar.conjugeId)
        await tx.conjuge.delete({ where: { id: auxiliar.conjugeId } });

      // Exclui o auxiliar principal
      await tx.auxiliar.delete({ where: { id } });

      return { message: "Auxiliar e dados relacionados eliminados com sucesso." };
    } catch (error) {
      console.error("Erro ao eliminar auxiliar:", error);
      throw new Error("Erro ao eliminar auxiliar, operação revertida.");
    }
  });
};


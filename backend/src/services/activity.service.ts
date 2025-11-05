// services/activityService.ts
import { PrismaClient } from '@prisma/client';
import { CreateActivityData, ActivityResponse } from '../types/activity';

const prisma = new PrismaClient();

export class ActivityService {
  async createActivity(data: CreateActivityData): Promise<ActivityResponse> {
    try {
      const { name, date, location, description, participantIds } = data;

      // console.log('🎯 Criando actividade com auxiliares');
      // console.log('📦 Dados recebidos:', data);

      // Converter participantIds para números
      const participantIdsNumber = participantIds.map(id => {
        const num = typeof id === 'string' ? parseInt(id, 10) : id;
        if (isNaN(num)) {
          throw new Error(`ID de auxiliar inválido: ${id}`);
        }
        return num;
      });

      // console.log('🔢 IDs de auxiliares convertidos:', participantIdsNumber);

      // Verificar se todos os AUXILIARES existem
      const auxiliares = await prisma.auxiliar.findMany({
        where: {
          id: {
            in: participantIdsNumber
          }
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          foto: true,
          igreja: true,
          regiao: true,
          obreiro: true,
          batizado: true,
        }
      });

      console.log('👥 Auxiliares encontrados:', auxiliares);

      if (auxiliares.length !== participantIdsNumber.length) {
        const foundIds = auxiliares.map(aux => aux.id);
        const missingIds = participantIdsNumber.filter(id => !foundIds.includes(id));
        throw new Error(`Os seguintes auxiliares não foram encontrados: ${missingIds.join(', ')}`);
      }

      // Criar a actividade
      const activity = await prisma.activity.create({
        data: {
          name,
          date: new Date(date),
          location,
          description,
          participants: {
            create: participantIdsNumber.map(auxiliarId => ({
              auxiliarId: auxiliarId // ← Relação com Auxiliar
            }))
          }
        },
        include: {
          participants: {
            include: {
              auxiliar: {
                select: {
                  id: true,
                  nome: true,
                  email: true,
                  telefone: true,
                  foto: true,
                  igreja: true,
                  regiao: true,
                  obreiro: true,
                  batizado: true,
                }
              }
            }
          }
        }
      });

      console.log('✅ Actividade criada com sucesso:', activity.id);
      return this.formatActivityResponse(activity);

    } catch (error) {
      console.error('💥 Erro ao criar actividade:', error);
      throw error;
    }
  }

  async getAllActivities(): Promise<ActivityResponse[]> {
    const activities = await prisma.activity.findMany({
      include: {
        participants: {
          include: {
            auxiliar: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                foto: true,
                igreja: true,
                regiao: true,
                obreiro: true,
                batizado: true,
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return activities.map(activity => this.formatActivityResponse(activity));
  }

  async getActivityById(id: string): Promise<ActivityResponse | null> {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            auxiliar: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                foto: true,
                igreja: true,
                regiao: true,
                obreiro: true,
                batizado: true,
              }
            }
          }
        }
      }
    });

    return activity ? this.formatActivityResponse(activity) : null;
  }

  async updateActivity(id: string, data: Partial<CreateActivityData>): Promise<ActivityResponse> {
    const { participantIds, ...activityData } = data;

    // Se houver participantIds, atualizar os participantes
    if (participantIds) {
      // Converter para números
      const participantIdsNumber = participantIds.map(id => 
        typeof id === 'string' ? parseInt(id, 10) : id
      );

      // Primeiro, remover todos os participantes atuais
      await prisma.activityParticipant.deleteMany({
        where: { activityId: id }
      });

      // Depois, adicionar os novos participantes
      if (participantIdsNumber.length > 0) {
        await prisma.activityParticipant.createMany({
          data: participantIdsNumber.map(auxiliarId => ({
            activityId: id,
            auxiliarId: auxiliarId
          }))
        });
      }
    }

    // Atualizar os dados da actividade
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        ...activityData,
        ...(activityData.date && { date: new Date(activityData.date) })
      },
      include: {
        participants: {
          include: {
            auxiliar: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                foto: true,
                igreja: true,
                regiao: true,
                obreiro: true,
                batizado: true,
              }
            }
          }
        }
      }
    });

    return this.formatActivityResponse(activity);
  }

  async deleteActivity(id: string): Promise<void> {
    await prisma.activity.delete({
      where: { id }
    });
  }

  private formatActivityResponse(activity: any): ActivityResponse {
    return {
      id: activity.id,
      name: activity.name,
      date: activity.date.toISOString(),
      location: activity.location || undefined,
      description: activity.description || undefined,
      participants: activity.participants.map((ap: any) => ({
        id: ap.auxiliar.id.toString(),
        nome: ap.auxiliar.nome,
        email: ap.auxiliar.email || undefined,
        telefone: ap.auxiliar.telefone,
        foto: ap.auxiliar.foto || undefined,
        igreja: ap.auxiliar.igreja,
        regiao: ap.auxiliar.regiao,
        obreiro: ap.auxiliar.obreiro,
        batizado: ap.auxiliar.batizado,
      })),
      participantIds: activity.participants.map((ap: any) => ap.auxiliar.id.toString()),
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString()
    };
  }
}

export default new ActivityService();
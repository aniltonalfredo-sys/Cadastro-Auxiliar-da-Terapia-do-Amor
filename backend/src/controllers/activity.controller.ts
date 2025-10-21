// controllers/activityController.ts
import { Request, Response } from 'express';
import activityService from '../services/activity.service';
import { CreateActivityData } from '../types/activity';

export class ActivityController {
  
  async createActivity(req: Request, res: Response) {
    try {
      const activityData: CreateActivityData = req.body;
      
      const activity = await activityService.createActivity(activityData);
      
      res.status(201).json({
        success: true,
        data: activity,
        message: 'Atividade criada com sucesso!'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar atividade'
      });
    }
  }

  async getActivities(req: Request, res: Response) {
    try {
      const activities = await activityService.getAllActivities();
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar atividades'
      });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const activity = await activityService.getActivityById(id);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar atividade'
      });
    }
  }

  async updateActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const activity = await activityService.updateActivity(id, updateData);
      
      res.json({
        success: true,
        data: activity,
        message: 'Atividade atualizada com sucesso!'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar atividade'
      });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await activityService.deleteActivity(id);
      
      res.json({
        success: true,
        message: 'Atividade excluída com sucesso!'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir atividade'
      });
    }
  }
}

export default new ActivityController();
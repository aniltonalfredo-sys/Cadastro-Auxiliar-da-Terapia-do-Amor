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
        message: 'Actividade criada com sucesso!'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar actividade'
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
        message: error.message || 'Erro ao buscar actividades'
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
          message: 'Actividade não encontrada'
        });
      }
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar actividade'
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
        message: 'Actividade atualizada com sucesso!'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar actividade'
      });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await activityService.deleteActivity(id);
      
      res.json({
        success: true,
        message: 'Actividade excluída com sucesso!'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir actividade'
      });
    }
  }
}

export default new ActivityController();
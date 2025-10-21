// routes/activityRoutes.ts
import { Router } from 'express';
import activityController from '../controllers/activity.controller';

const router = Router();


// Rotas para actividades
router.post('/', activityController.createActivity);
router.get('/', activityController.getActivities);
router.get('/:id', activityController.getActivity);
router.put('/:id', activityController.updateActivity);
// router.delete('/activities/:id', activityController.deleteActivity);

export default router;
import express from 'express';
import {
  aliasTopTours,
  getAllTours,
  getMOnthlyPlan,
  getTour,
  checkBody,
  checkID,
  createTour,
  updateTour,
  deleteTour,
  getTourStats
} from './../controllers/tourController1.js';

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
const router = express.Router();

// this is a middleware
// router.param('id', tourController.checkID);
// this is a middleware as well
/*
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
  */

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMOnthlyPlan);
router
  .route('/')
  .get(getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;

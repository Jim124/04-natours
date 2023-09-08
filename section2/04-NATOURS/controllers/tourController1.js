import fs from 'fs';
import dirName from './../dirName.js';
import Tour from './../models/tourModel.js';
import ApiFeature from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';

const filelUrl = `${dirName}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(filelUrl));

// class TourController {
//   aliasTopTours(req, res, next) {
//     req.query.limit = '5';
//     req.query.sort = '-ratingsAverage,price';
//     req.query.fields = 'name,price,ratings,summary,difficulty';
//     next();
//   }

//   async getAllTours(req, res) {
//     try {
//       const features = new ApiFeature(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limit()
//         .paginate();
//       const tours = await features.query;
//       // const tours =  Tour.find()
//       //   .where('duration')
//       //   .equals(5)
//       //   .where('difficulty')
//       //   .equals('easy');
//       // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });
//       //SEND RESPONSE
//       res.status(200).json({
//         status: 'success',
//         result: tours.length,
//         data: {
//           tours
//         }
//       });
//     } catch (error) {
//       res.status(404).json({
//         status: 'fail',
//         message: error.message
//       });
//     }
//   }

//   async createTour(req, res) {
//     try {
//       //const newTour = new Tour({});
//       //newTour.save();
//       const newTour = await Tour.create(req.body);
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }

//   async getTour(req, res) {
//     try {
//       const tour = await Tour.findById(req.params.id);
//       //Tour.findOne({_id:req.params.id});
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }

//   async updateTour(req, res) {
//     try {
//       const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//       });
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }

//   async deleteTour(req, res) {
//     try {
//       await Tour.findByIdAndDelete(req.params.id);
//       res.status(204).json({
//         status: 'success',
//         data: null
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }

//   checkID(req, res, next, val) {
//     console.log(`Tour id is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Invalid Id'
//       });
//     }
//     next();
//   }

//   checkBody(req, res, next) {
//     if (!req.body.name || !req.body.price) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Missing name or price...'
//       });
//     }
//     next();
//   }

//   async getTourStats(req, res) {
//     try {
//       const stats = await Tour.aggregate([
//         { $match: { ratingSAverage: { $gte: 4.5 } } },
//         {
//           $group: {
//             // _id: '$ratingSAverage',
//             _id: { $toUpper: '$difficulty' },
//             numtours: { $sum: 1 },
//             numRatings: { $sum: '$ratingsQuantity' },
//             avgrating: { $avg: '$ratingSAverage' },
//             avgPrice: { $avg: '$price' },
//             minPrice: { $min: '$price' },
//             maxPrice: { $max: '$price' }
//           }
//         },
//         {
//           $sort: { avgPrice: 1 }
//         }
//         // {
//         //   $match: { _id: { $ne: 'EASY' } }
//         // }
//       ]);
//       res.status(200).json({
//         status: 'success',
//         data: {
//           stats
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }

//   async getMOnthlyPlan(req, res) {
//     try {
//       const year = req.params.year * 1;
//       const plan = await Tour.aggregate([
//         { $unwind: '$startDates' },
//         {
//           $match: {
//             startDates: {
//               $gte: new Date(`${year}-01-01`),
//               $lte: new Date(`${year}-12-31`)
//             }
//           }
//         },
//         {
//           $group: {
//             _id: { $month: '$startDates' },
//             numTourStarts: { $sum: 1 },
//             tours: { $push: '$name' }
//           }
//         },
//         {
//           $addFields: { month: '$_id' }
//         },
//         {
//           $project: {
//             _id: 0
//           }
//         },
//         {
//           $sort: { numTourStarts: -1 }
//         },
//         { $limit: 12 }
//       ]);
//       res.status(200).json({
//         status: 'success',
//         data: {
//           plan
//         }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'fail',
//         message: error
//       });
//     }
//   }
// }

//getAllTours
export const getAllTours = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const tours = await features.query;
  // const tours =  Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
  // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours
    }
  });
});

//createTour
export const createTour = catchAsync(async (req, res, next) => {
  //const newTour = new Tour({});
  //newTour.save();
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

//GetTourById
export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({_id:req.params.id});
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//UpdateTourById
export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//DeleteTourById
export const deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

//CheckId
export const checkID = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  next();
};

//CheckBody middleware
export const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing name or price!'
    });
  }
  next();
};

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fileds = 'name,price,ratings,summary,difficulty';
  next();
};

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingSAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: '$ratingSAverage',
        _id: { $toUpper: '$difficulty' },
        numtours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgrating: { $avg: '$ratingSAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

export const getMOnthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    { $limit: 12 }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// const instance = new TourController();
// export default instance;

import fs from 'fs';
import dirName from './../dirName.js';
import Tour from './../models/tourModel.js';
import ApiFeature from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';

const filelUrl = `${dirName}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(filelUrl));

class TourController {
  aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratings,summary,difficulty';
    next();
  }

  async getAllTours(req, res) {
    try {
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
    } catch (error) {
      res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  async createTour(req, res) {
    try {
      //const newTour = new Tour({});
      //newTour.save();
      const newTour = await Tour.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }

  async getTour(req, res) {
    try {
      const tour = await Tour.findById(req.params.id);
      //Tour.findOne({_id:req.params.id});
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }

  async updateTour(req, res) {
    try {
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
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }

  async deleteTour(req, res) {
    try {
      await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }

  checkID(req, res, next, val) {
    console.log(`Tour id is ${val}`);
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid Id'
      });
    }
    next();
  }

  checkBody(req, res, next) {
    if (!req.body.name || !req.body.price) {
      return res.status(401).json({
        status: 'fail',
        message: 'Missing name or price...'
      });
    }
    next();
  }

  async getTourStats(req, res) {
    try {
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
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }

  async getMOnthlyPlan(req, res) {
    try {
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
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error
      });
    }
  }
}

//getAllTours
export const getAllTours = async (req, res) => {
  try {
    //BUILd QUERY
    //1a) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //3) fields Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exit');
    }

    //EXECUTE QUERY
    const tours = await query;
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

//createTour
export const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  //   const newTour = Object.assign({ id: newId }, req.body);
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(filelUrl, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        data: newTour
      }
    });
  });
};

//GetTourById
export const getTour = (req, res) => {
  //   console.log(req.params);
  // req.params.id value is a string
  //   const id = req.params.id * 1;
  const id = Number(req.params.id);
  //   const tour = tours.at(id);
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

//UpdateTourById
export const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update a tour....>'
    }
  });
};

//DeleteTourById
export const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

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

const instance = new TourController();
export default instance;

import mongoose from 'mongoose';
import dotNev from 'dotenv';
import fs from 'fs';
import Tour from '../../models/tourModel.js';
dotNev.config({ path: './../../config.env' });
//Remote mongodb address
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL;

// const DB =
//   'mongodb+srv://pingandu590:jTKM9obaDbabxYXE@cluster0.dwafxoz.mongodb.net/natours?retryWrites=true&w=majority';
await mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const importData = async () => {
  const data = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'));
  try {
    await Tour.create(data);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}

class UserController {
  getAllUsers(req, res) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined.',
    });
  }

  createUser(req, res) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined.',
    });
  }

  getUser(req, res) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined.',
    });
  }

  updateUser(req, res) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined.',
    });
  }

  deleteUser(req, res) {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined.',
    });
  }
}

export const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const instance = new UserController();

export default instance;

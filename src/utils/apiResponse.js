exports.successResponse = (res, statusCode = 200, data = []) => {
  let response = { status: statusCode, success: true };

  if (data && Object.keys(data).length) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

exports.errorResponse = (res, statusCode = 400, error = {}) => {
  let response = { status: statusCode, success: false };

  if (error && Object.keys(error).length) {
    if (!error.code) {
      error.code = (error.title || '').replace(' ', '-').toLowerCase();
    }
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

exports.serverErrorResponse = (res, statusCode = 500) => {
  const response = {
    status: statusCode,
    success: false,
    error: { code: 'server-error', title: 'Something went wrong' },
  };

  return res.status(statusCode).json(response);
};

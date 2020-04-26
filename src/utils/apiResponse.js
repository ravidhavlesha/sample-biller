const successResponse = (res, statusCode = 200, data = []) => {
  let response = { status: statusCode, success: true };

  if (data && Object.keys(data).length) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 400, error = {}) => {
  let response = { status: statusCode, success: false };

  if (error && Object.keys(error).length) {
    if (!error.code) {
      error.code = (error.title || '').replace(' ', '-').toLowerCase();
    }
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

const serverErrorResponse = (res, statusCode = 500) => {
  const response = {
    status: statusCode,
    success: false,
    error: { code: 'server-error', title: 'Something went wrong' },
  };

  return res.status(statusCode).json(response);
};

const dataNotFoundResponse = (res, model) => {
  return errorResponse(res, 404, {
    code: `${model.toLowerCase()}-not-found`,
    title: `${model} not found`,
    traceID: '',
    description: `The requested ${model.toLowerCase()} was not found in the biller system.`,
    param: '',
    docURL: '',
  });
};

module.exports = { successResponse, errorResponse, dataNotFoundResponse, serverErrorResponse };

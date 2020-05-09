const successResponse = (res, statusCode = 200, data = []) => {
  const response = { status: statusCode, success: true };

  if (data && Object.keys(data).length) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 400, error = {}) => {
  const response = { status: statusCode, success: false };

  response.error = error && Object.keys(error).length ? error : null;

  return res.status(statusCode).json(response);
};

const serverErrorResponse = (res, statusCode = 500) => {
  const response = {
    status: statusCode,
    success: false,
    error: {
      code: 'server-error',
      title: 'Something went wrong',
      description: 'There is some issue with the billder system.',
    },
  };

  return res.status(statusCode).json(response);
};

const badRequestResponse = (res, desc = null) => errorResponse(res, 400, {
  code: 'bad-request',
  title: 'Bad request',
  description: desc || 'The requested payload is invalid.',
});

const dataNotFoundResponse = (res, model) => errorResponse(res, 404, {
  code: `${model.toLowerCase()}-not-found`,
  title: `${model} not found`,
  description: `The requested ${model.toLowerCase()} was not found in the biller system.`,
});

module.exports = {
  successResponse,
  errorResponse,
  badRequestResponse,
  dataNotFoundResponse,
  serverErrorResponse,
};

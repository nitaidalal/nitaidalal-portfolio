export const successResponse = (res, statusCode = 200, message = "Success", data = null) => {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode = 500, message = "Something went wrong!") => {
    res.status(statusCode).json({
      success: false,
      message,
    });
}
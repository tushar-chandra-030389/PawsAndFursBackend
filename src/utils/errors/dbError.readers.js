export default (error) => {
  if (error.name !== 'MongoServerError') {
    return false;
  }

  return error.message;
};

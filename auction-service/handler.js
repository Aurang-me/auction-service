exports.hello = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "serverless with console! Your function executed successfully!",
    }),
  };
};

exports.hello2 = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "This is the 2nd function! Your function executed successfully!",
    }),
  };
};
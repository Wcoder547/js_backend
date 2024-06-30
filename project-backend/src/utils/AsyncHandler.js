const AsyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(
      requestHandler(req, res, next).catch((error) => next(error))
    );
  };
};
export { AsyncHandler };

// const AsyncHandler = () => {};
// const AsyncHandler = (fn)=>()=>{};
// const AsyncHandler =(fn) => async ()=>{}

// const AsyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

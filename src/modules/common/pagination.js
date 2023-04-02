const mongoose = require("mongoose");
exports.pagination = (model) => {
  return async (req, res, next) => {
    try {
      const user_id = req.userData._id;
      const role = req.userData.role;
      let {limit,skip} = req.query;
      limit = limit?parseInt(req.query.limit): 100;
      const offset =skip?parseInt(req.query.skip):0;
      
      let filter = user_id && model.collection.collectionName  == 'todos' && role !=='admin' ?{user_id:{$ne: user_id}}:{};
      const modelCollection = await model.find(filter).skip(offset).limit(limit);
      const modelCollectionCount = await model.count(filter);
      const totalPages = Math.ceil(modelCollectionCount / limit);
      const currentPage = Math.ceil(offset/limit);

      res.paginatedData = {
          pageLimit: limit,
          total: modelCollectionCount,
          page: currentPage +1,
          pages: totalPages,
          data : modelCollection,
        };
      next();
    } catch (e) {
      console.log("Error", e);
      res.status(500).send({
        data: null,
      });
    }
  };
};



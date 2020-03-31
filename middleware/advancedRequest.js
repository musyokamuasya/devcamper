const advancedResults = (model, populate) => async(req, res, next) =>{
         let query;

    // Make a copy of the query
    const reqQuery = {...req.query};
    // Remove fields from query
    const removeFields = ['select', 'sort', 'limit', 'page'];

    // Loop over removeFields  and detele from query
    removeFields.forEach(param => delete reqQuery[param]);
    // Create query
    let queryStr = JSON.stringify(reqQuery);
    
    // Create logical operators ie gte, lt, lte, etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sorting the fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
        console.log(sortBy);
    }
    else{
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10)|| 1;
    const limit = parseInt(req.query.limit, 10)|| 1;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate query
    if (populate) {
        query= query.populate(populate);
    }


    // Executing query
        const results = await query;

        // Pagination
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit:limit
            };
        }

        if (startIndex > 0) {
            pagination.prev ={
                page: page - 1,
                limit:limit
            };
        }

        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results
        };
        next();
};
module.exports = advancedResults;
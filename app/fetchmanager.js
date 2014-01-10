module.exports = function(model) {
    return {
        getmods: function(req, res) {
            var limit = req.param('limit');
            var skip = req.param('skip');
            var sort = req.param('sort');
            var category = req.param('category') || 'all';
            var findMods = function(category_id) {
                var query = model.Mod.find(null);
                if (category_id) query.where('category_id', category_id);
                query.limit(limit).skip(skip).sort(sort).select('name summary category_id creation_date _id slug');
                query.exec(function(err, doc) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.send(doc);
                    }
                });
            }
            if (category !== 'all') {
                var query = model.Category.findOne({
                    'slug': category
                });
                query.exec(function(err, doc) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(doc);
                        findMods(doc.id);
                    }
                });
            }
            else findMods();

        },
        info: function(req, res) {
            var slug = req.param('slug');


            var query = model.Mod.findOne({
                'slug': slug
            }).populate('category_id').populate('author', 'username _id');
            query.exec(function(err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    res.send(doc);
                }
            });

        }
    }
}
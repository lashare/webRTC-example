
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'sender' });
};

exports.receiver = function(req, res){
  res.render('receiver', { title: 'receiver' });
};


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'server' });
};

exports.sender = function(req, res){
  res.render('sender', { title: 'sender' });
};

exports.receiver = function(req, res){
  res.render('receiver', { title: 'receiver' });
};

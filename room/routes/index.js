
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'chat-room' });
};

exports.chat = function(req, res){
  res.render('chat', { title: 'chat-room' });
};

exports.demo = function(req, res){
  res.render('demo', { title: 'demo-room' });
};

var app = express()
  require('./core/passport')(passport)
  app.use(express.static('public'))
  app.set('view engine','ejs')
  app.use(morgan('tiny'))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(fileUpload());
  
  app.use(session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(require('express-flash')());
  
  app.use('/app',require('./routes/app')())
  app.use('/',require('./routes/main')(passport))
  
  app.listen(config.port, config.listen)
  
  module.exports.isAuthenticated = function (req, res, next) {
      if (req.isAuthenticated()) {
          req.flash('authenticated', true)
          return next();
      
      res.redirect('/login');
  }
  
  module.exports.ping = function (req, res) {
      exec('ping -c 2 ' + req.body.address, function (err, stdout, stderr) {
          output = stdout + stderr
          res.render('app/ping', {
              output: output
          })
      })
  }
  
  module.exports.userSearch = function (req, res) {
      var query = "SELECT name,id FROM Users WHERE login='" + req.body.login + "'";
      db.sequelize.query(query, {
          model: db.User,
          logging: true
      }).then(user => {
          if (user.length) {
              var output = {
                  user: {
                      name: user[0].name,
                      id: user[0].id
                  
              
              res.render('app/usersearch', {
                  output: output
              })
          } else {
              req.flash('warning', 'User not found')
              res.render('app/usersearch', {
                  output: null
              })
          
      }).catch(err => {
          req.flash('danger', 'Internal Error')
          res.render('app/usersearch', {
              output: null
          })
      })
  }
  
  module.exports.resetpasswd = function (req, res) {
      if (req.query.login) {
          db.User.find({
              where: {
                  'login': req.query.login
              
          }).then(user => {
              if (user) {
                  if (req.query.token == md5(req.query.login)) {
                      res.render('resetpassword', {
                          login: req.query.login,
                          token: req.query.token
                     })
                 } else {
                     req.flash('danger', "Invalid reset token")
                     res.redirect('/forgotpassword')
                 
             } else {
                 req.flash('danger', "Invalid login username")
                 res.redirect('/forgotpassword')
             
         })
     } else {
         req.flash('danger', "invalid username")
         res.redirect('/forgotpassword')
     
 }
 
 module.exports.importBulkProducts =  function(req, res) {
     if (req.files.products && req.files.products.mimetype=='text/xml'){
         var products = libxmljs.parseXmlString(req.files.products.data.toString('utf8'), {noent:true,noblanks:true})
         products.root().childNodes().forEach( product => {
             var newProduct = new db.Product()
             newProduct.name = product.childNodes()[0].text()
             newProduct.code = product.childNodes()[1].text()
             newProduct.tags = product.childNodes()[2].text()
             newProduct.description = product.childNodes()[3].text()
             newProduct.save()
         })
         res.redirect('/app/products')
     }else{
         res.render('app/bulkproducts',{messages:{danger:'Invalid file'},legacy:false})
     
 }

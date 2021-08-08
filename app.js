import express from 'express';
import pkg from 'jsonwebtoken';

const { verify, sign } = pkg;

const PORT = 5000;

const app = express();

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
}

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {  
  verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const user = {
    id: 1, 
    username: 'thiago',
    email: 'thiago@gmail.com'
  }

  sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    });
  });
});






app.listen(PORT, () => console.log('Server started on port ' + PORT));
let userlogin;
let username;
let userpassword;

const setup = () => {
  username = document.getElementById('username');
  userlogin = document.getElementById('userlogin');
  userpassword = document.getElementById('userpassword');
  document.getElementById('register').addEventListener('click', register);
}
window.addEventListener('DOMContentLoaded', setup);

const register =  async () => {
  const userData = {
                     name: username.value,
                     login : userlogin.value,
                     password : userpassword.value,
                   };
  const body = JSON.stringify(userData);
  const requestOptions = {
                         method :'POST',
                         headers : { "Content-Type": "application/json" },
                         body : body
                       };
  const response = await fetch(`/access/register`, requestOptions);
  if (response.ok) {
    const createdUser = await response.json();
    console.log(`user registered : ${JSON.stringify(createdUser)}`);
    alert('Bienvenue sur ShareSphere ! Nous sommes ravis de vous avoir parmi nous. Veuillez vous connecter pour accéder à toutes les fonctionnalités.');
    window.location.href = '/access/login';
  }
  else {
    const error = await response.json();
    console.log(`erreur : ${error.message}`);
    document.getElementById('problem').textContent = `erreur : ${error.message}`;
  }
}

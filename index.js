const users = JSON.parse(localStorage.getItem('users')) || [];
const user = JSON.parse(localStorage.getItem('loggedUser')) || undefined;

const formsWrapper = document.getElementsByClassName('forms')[0];

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const homePage = document.getElementById('home');

onload = () => {
    if (user) {
        showHomePage();
    }

    M.Sidenav.init(document.querySelectorAll('.sidenav'), null);
};

togglePassword = () => {
    const passwordField = document.getElementById('password');

    if (passwordField.type === 'password') {
        document.getElementById('password-icon').innerHTML = 'visibility_off';
        passwordField.type = 'text';
    } else {
        document.getElementById('password-icon').innerHTML = 'visibility';
        passwordField.type = 'password';
    }
};

signupTogglePassword = () => {
    const passwordField = document.getElementById('signup-password');

    if (passwordField.type === 'password') {
        document.getElementById('signup-password-icon').innerHTML = 'visibility_off';
        passwordField.type = 'text';
    } else {
        document.getElementById('signup-password-icon').innerHTML = 'visibility';
        passwordField.type = 'password';
    }
};

login = () => {
    const user = users.find(user => user.username === loginForm.username.value && user.password === loginForm.password.value);
    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        showHomePage();
    } else {
        M.toast({ html: 'Usuário e/ou senha incorretos!' });
    }
};

showSignupPage = () => {
    loginForm.classList.add('hide');
    homePage.classList.add('hide');
    
    formsWrapper.classList.remove('hide');
    signupForm.classList.remove('hide');
};

showLoginPage = () => {
    formsWrapper.classList.remove('hide');
    loginForm.classList.remove('hide');

    signupForm.classList.add('hide');
    homePage.classList.add('hide');
};

signup = () => {
    if (users.find(user => user.username === signupForm.username.value)) {
        M.toast({ html: 'Usuário já existente!' });
        return;
    }

    if (signupForm.password.value !== signupForm.confirmPassword.value) {
        M.toast({ html: 'As senhas não coincidem!' });
        return;
    }

    users.push({
        username: signupForm.username.value,
        password: signupForm.password.value
    });

    localStorage.setItem('users', JSON.stringify(users));

    M.toast({ html: 'Cadastrado com sucesso!' });

    showLoginPage();
};

showHomePage = () => {
    formsWrapper.classList.add('hide');
    loginForm.classList.add('hide');
    signupForm.classList.add('hide');

    homePage.classList.remove('hide');
};

logout = () => {
    localStorage.removeItem('loggedUser');

    showLoginPage();
}
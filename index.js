const users = JSON.parse(localStorage.getItem('users')) || [];
const user = JSON.parse(localStorage.getItem('loggedUser')) || undefined;

const formsWrapper = document.getElementsByClassName('forms')[0];
const emptyList = document.getElementById('empty-list');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const homePage = document.getElementById('home');
const clocksList = document.getElementById('clocks');
const clocksModal = document.getElementById('clocks-modal');
const clocksForm = document.getElementById('clocks-form');

onload = () => {
    M.Sidenav.init(document.querySelectorAll('.sidenav'), null);
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), null);
    M.Modal.init(document.querySelectorAll('.modal'), null);

    const previousYear = new Date();
    previousYear.setFullYear(previousYear.getFullYear() - 1);
    M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        i18n: {
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            today: 'Hoje',
            clear: 'Limpar',
            cancel: 'Sair',
            done: 'Confirmar',
            labelMonthNext: 'Próximo mês',
            labelMonthPrev: 'Mês anterior',
            labelMonthSelect: 'Selecione um mês',
            labelYearSelect: 'Selecione um ano',
            selectMonths: true,
            selectYears: 15,
        },
        format: 'dd/mm/yyyy',
        container: 'body',
        minDate: previousYear,
        maxDate: new Date(),
        defaultDate: new Date()
    });

    if (user) {
        showHomePage();
    }
};

function togglePassword() {
    const passwordField = document.getElementById('password');

    if (passwordField.type === 'password') {
        document.getElementById('password-icon').innerHTML = 'visibility_off';
        passwordField.type = 'text';
    } else {
        document.getElementById('password-icon').innerHTML = 'visibility';
        passwordField.type = 'password';
    }
};

function signupTogglePassword() {
    const passwordField = document.getElementById('signup-password');

    if (passwordField.type === 'password') {
        document.getElementById('signup-password-icon').innerHTML = 'visibility_off';
        passwordField.type = 'text';
    } else {
        document.getElementById('signup-password-icon').innerHTML = 'visibility';
        passwordField.type = 'password';
    }
};

function login() {
    const user = users.find(function (user) { return user.username === loginForm.username.value && user.password === loginForm.password.value; });
    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        showHomePage();
    } else {
        M.toast({ html: 'Usuário e/ou senha incorretos!' });
    }
};

function showSignupPage() {
    loginForm.classList.add('hide');
    homePage.classList.add('hide');

    formsWrapper.classList.remove('hide');
    signupForm.classList.remove('hide');
};

function showLoginPage() {
    formsWrapper.classList.remove('hide');
    loginForm.classList.remove('hide');

    signupForm.classList.add('hide');
    homePage.classList.add('hide');
};

function signup() {
    if (users.find(function (user) { return user.username === signupForm.username.value; })) {
        M.toast({ html: 'Usuário já existente!' });
        return;
    }

    if (signupForm.password.value !== signupForm.confirmPassword.value) {
        M.toast({ html: 'As senhas não coincidem!' });
        return;
    }

    users.push({
        username: signupForm.username.value,
        password: signupForm.password.value,
        clocks: []
    });

    localStorage.setItem('users', JSON.stringify(users));

    M.toast({ html: 'Cadastrado com sucesso!' });

    showLoginPage();
};

function showHomePage() {
    formsWrapper.classList.add('hide');
    loginForm.classList.add('hide');
    signupForm.classList.add('hide');

    homePage.classList.remove('hide');

    if (!user || user.clocks.length === 0) {
        emptyList.classList.remove('hide');
    } else {
        emptyList.classList.add('hide');
        clocksList.classList.remove('hide');

        const labels = document.createElement('div');
        labels.classList.add('row');

        const labelDate = document.createElement('span');
        labelDate.classList.add('col', 's4', 'center');
        labelDate.innerText = 'DATAS';
        labels.appendChild(labelDate);

        const labelClockOne = document.createElement('span');
        labelClockOne.classList.add('col', 's2', 'center');
        labelClockOne.innerText = 'E1';
        labels.appendChild(labelClockOne);

        const labelClockTwo = document.createElement('span');
        labelClockTwo.classList.add('col', 's2', 'center');
        labelClockTwo.innerText = 'S1';
        labels.appendChild(labelClockTwo);

        const labelClockThree = document.createElement('span');
        labelClockThree.classList.add('col', 's2', 'center');
        labelClockThree.innerText = 'E2';
        labels.appendChild(labelClockThree);

        const labelClockFour = document.createElement('span');
        labelClockFour.classList.add('col', 's2', 'center');
        labelClockFour.innerText = 'S2';
        labels.appendChild(labelClockFour);

        clocksList.appendChild(labels);

        const clocksCollection = document.createElement('div');
        clocksCollection.classList.add('row');
        user.clocks.forEach(function (clock) {
            const clocksItem = document.createElement('div');
            clocksItem.classList.add('col', 's12');

            const dateItem = document.createElement('div');
            dateItem.classList.add('col', 's4');
            dateItem.innerText = clock.date;

            const clockOneItem = document.createElement('span');
            clockOneItem.classList.add('col', 's2', 'clock-item');
            clockOneItem.innerText = clock.clockOne;

            const clockTwoItem = document.createElement('span');
            clockTwoItem.classList.add('col', 's2', 'clock-item');
            clockTwoItem.innerText = clock.clockTwo;

            const clockThreeItem = document.createElement('span');
            clockThreeItem.classList.add('col', 's2', 'clock-item');
            clockThreeItem.innerText = clock.clockThree;

            const clockFourItem = document.createElement('span');
            clockFourItem.classList.add('col', 's2', 'clock-item');
            clockFourItem.innerText = clock.clockFour;

            const labelWorkedHours = document.createElement('div');
            labelWorkedHours.classList.add('row');

            const valueWorkedHours = document.createElement('b');
            valueWorkedHours.classList.add('col', 's12', 'center');
            valueWorkedHours.innerText = 'Horas trabalhadas: ' + calculateTime(clock.clockOne, clock.clockTwo, clock.clockThree, clock.clockFour);
            labelWorkedHours.appendChild(valueWorkedHours);

            clocksItem.appendChild(dateItem);
            clocksItem.appendChild(clockOneItem);
            clocksItem.appendChild(clockTwoItem);
            clocksItem.appendChild(clockThreeItem);
            clocksItem.appendChild(clockFourItem);
            clocksItem.appendChild(labelWorkedHours);

            clocksCollection.appendChild(clocksItem);
        });
        clocksList.appendChild(clocksCollection);
    }
};

function calculateTime(startOne, endOne, startTwo, endTwo) {
    const startOneDate = new Date();
    startOneDate.setHours(startOne.split(':')[0], startOne.split(':')[1], 0, 0);

    const endOneDate = new Date();
    endOneDate.setHours(endOne.split(':')[0], endOne.split(':')[1], 0, 0);

    const startTwoDate = new Date();
    startTwoDate.setHours(startTwo.split(':')[0], startTwo.split(':')[1], 0, 0);

    const endTwoDate = new Date();
    endTwoDate.setHours(endTwo.split(':')[0], endTwo.split(':')[1], 0, 0);

    const endTwoStartOneHour = endTwoDate.getTime() - startOneDate.getTime();
    const startTwoEndOneHour = startTwoDate.getTime() - endOneDate.getTime();

    let difference = endTwoStartOneHour - startTwoEndOneHour;
    difference = difference / 1000;

    const hourDifference = Math.floor(difference / 3600);
    difference -= hourDifference * 3600;

    const minuteDifference = Math.floor(difference / 60);
    difference -= minuteDifference * 60;

    return formatWithZero(hourDifference) + ':' + formatWithZero(minuteDifference);
};

function formatWithZero(value) {
    return value.toString().length < 2 ? '0' + value : value;
};

function logout() {
    localStorage.removeItem('loggedUser');

    showLoginPage();
};

function clockIn() {
    const date = clocksForm.date.value;
    const clockOne = clocksForm.clockOne.value;
    const clockTwo = clocksForm.clockTwo.value;
    const clockThree = clocksForm.clockThree.value;
    const clockFour = clocksForm.clockFour.value;

    if (!date || !clockOne || !clockTwo || !clockThree || !clockFour) {
        M.toast({ html: 'Preencha o formulário corretamente!' });
        return;
    }

    if (user.clocks) {
        const index = user.clocks.findIndex(function (u) { return u.date === date; });
        user.clocks.splice(index, index >= 0 ? 1 : 0);
    }

    user.clocks.push({ date, clockOne, clockTwo, clockThree, clockFour });
    user.clocks.sort(function (c1, c2) { return new Date(c1.date) - new Date(c2.date); });

    clocksForm.reset();

    M.Modal.getInstance(clocksModal).close();

    updateLocalStorage();

    window.location.reload();
};

function updateLocalStorage() {
    localStorage.setItem('loggedUser', JSON.stringify(user));

    const index = users.findIndex(function (u) { return u.username === user.username; });
    users.splice(index, index >= 0 ? 1 : 0);

    users.push(user);
    users.sort(function (u1, u2) { return u1.username - u2.username; });

    localStorage.setItem('users', JSON.stringify(users));
};
let users = JSON.parse(localStorage.getItem('users')) || [];
const user = JSON.parse(localStorage.getItem('loggedUser')) || undefined;

const formsWrapper = document.getElementsByClassName('forms')[0];
const emptyList = document.getElementById('empty-list');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const homePage = document.getElementById('home');
const searchForm = document.getElementById('search-form');
const clocksList = document.getElementById('clocks');
const clocksModal = document.getElementById('clocks-modal');
const clocksForm = document.getElementById('clocks-form');

/**
 * Ao carregar conteúdo por completo, inicializar componentes do Materialize.css
 */
onload = () => {
    M.Sidenav.init(document.querySelectorAll('.sidenav'), null);
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), null);
    M.FloatingActionButton.init(document.querySelectorAll('.menu-fab-left'), { direction: 'left' });
    M.Modal.init(document.querySelectorAll('.modal'), null);
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), null);

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

    // Se existe o usuário, mostrar tela principal
    if (user) {
        showHomePage(false);
    }
};

/**
 * Método responsável por realizar toggle no campo senha, exibindo ou escondendo a senha
 */
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

/**
 * Método responsável por realizar toggle no campo senha, exibindo ou escondendo a senha
 */
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

/**
 * Método responsável por validar usuário e senha dos usuários cadastros e logar no sistema
 */
function login() {
    const findUser = users.find(function (user) { return user.username === loginForm.username.value && user.password === loginForm.password.value; });
    if (findUser) {
        localStorage.setItem('loggedUser', JSON.stringify(findUser));
        window.location.reload();
    } else {
        M.toast({ html: 'Usuário e/ou senha incorretos!' });
    }
};

/**
 * Método responsável por mostrar a tela de cadastro
 */
function showSignupPage() {
    loginForm.classList.add('hide');
    homePage.classList.add('hide');

    formsWrapper.classList.remove('hide');
    signupForm.classList.remove('hide');
};

/**
 * Método responsável por mostrar a tela de login
 */
function showLoginPage() {
    formsWrapper.classList.remove('hide');
    loginForm.classList.remove('hide');

    signupForm.classList.add('hide');
    homePage.classList.add('hide');
};

/**
 * Método responsável por cadastrar um usuário no vetor users
 */
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

/**
 * Método responsável por mostrar tela principal, realizando a montagem das batidas de ponto na tela,
 * sendo cada card é uma batida de ponto
 */
function showHomePage(isSearching) {
    while (clocksList.firstChild) {
        clocksList.removeChild(clocksList.lastChild);
    }

    formsWrapper.classList.add('hide');
    loginForm.classList.add('hide');
    signupForm.classList.add('hide');

    homePage.classList.remove('hide');

    if (!isSearching && (!user || user.clocks.length === 0)) {
        emptyList.classList.remove('hide');
        searchForm.classList.add('hide');
    } else {
        emptyList.classList.add('hide');

        searchForm.classList.remove('hide');
        clocksList.classList.remove('hide');

        user.clocks.forEach(function (clock) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = '<a class="btn-floating btn-small halfway-fab waves-effect waves-light modal-trigger mr-24" href="#clocks-modal">' +
                '<i class="material-icons">mode_edit</i>' +
                '</a>' +
                '<a class="btn-floating btn-small halfway-fab waves-effect waves-light modal-trigger red" href="#delete-clock-modal">' +
                '<i class="material-icons">delete</i>' +
                '</a>';

            const editFab = document.createElement('a');
            editFab.classList.add('btn-floating', 'btn-small', 'halfway-fab', 'waves-effect', 'waves-light', 'modal-trigger', 'mr-24');
            editFab.setAttribute('href', '#clocks-modal');
            editFab.clock = clock;
            editFab.addEventListener('click', loadClocks);
            editFab.innerHTML = '<i class="material-icons">mode_edit</i>';

            const deleteFab = document.createElement('a');
            deleteFab.classList.add('btn-floating', 'btn-small', 'halfway-fab', 'waves-effect', 'waves-light', 'red');
            deleteFab.clock = clock;
            deleteFab.addEventListener('click', deleteClock);
            deleteFab.innerHTML = '<i class="material-icons">delete</i>';

            card.appendChild(editFab);
            card.appendChild(deleteFab);

            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');

            card.appendChild(cardContent);

            const cardClocks = document.createElement('div');
            cardClocks.classList.add('row', 'mt-3');

            const cardTitle = document.createElement('span');
            cardTitle.classList.add('card-title', 'grey-text', 'text-darken-2');
            cardTitle.innerText = clock.date;

            const clockOneItem = document.createElement('span');
            clockOneItem.classList.add('col', 's3', 'clock-item');
            clockOneItem.innerText = clock.clockOne;

            const clockTwoItem = document.createElement('span');
            clockTwoItem.classList.add('col', 's3', 'clock-item');
            clockTwoItem.innerText = clock.clockTwo;

            const clockThreeItem = document.createElement('span');
            clockThreeItem.classList.add('col', 's3', 'clock-item');
            clockThreeItem.innerText = clock.clockThree;

            const clockFourItem = document.createElement('span');
            clockFourItem.classList.add('col', 's3', 'clock-item');
            clockFourItem.innerText = clock.clockFour;

            const workedHours = document.createElement('b');
            workedHours.classList.add('col', 's12', 'center', 'mt-3');
            workedHours.innerText = 'Horas trabalhadas: ' + calculateTime(clock.clockOne, clock.clockTwo, clock.clockThree, clock.clockFour);

            cardContent.appendChild(cardTitle);

            cardClocks.appendChild(clockOneItem);
            cardClocks.appendChild(clockTwoItem);
            cardClocks.appendChild(clockThreeItem);
            cardClocks.appendChild(clockFourItem);

            cardClocks.appendChild(workedHours);

            cardContent.appendChild(cardClocks);

            clocksList.appendChild(card);
        });
    }
};

/**
 * Método responsável por calcular a diferença de tempo (horas e minutos)
 * a partir da batida de ponto cadastrada pelo usuário e retornar as horas trabalhadas
 */
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

/**
 * Método responsável por formatar as horas/minutos corretamente, com 2 dígitos
 */
function formatWithZero(value) {
    return value.toString().length < 2 ? '0' + value : value;
};

/**
 * Método responsável por realizar o logout do usuário
 */
function logout() {
    localStorage.removeItem('loggedUser');

    window.location.reload();
};

/**
 * Método responsável por filtrar uma data ou algum dos quatro campos de batida
 */
function filterCards() {
    const searchValue = searchForm.search.value;

    const currentUser = users.find(function (u) {
        return user.username === u.username;
    });
    user.clocks = currentUser.clocks;

    const userClocks = user.clocks.filter(function (u) {
        return u.date.toString().includes(searchValue) ||
            u.clockOne.toString().includes(searchValue) ||
            u.clockTwo.toString().includes(searchValue) ||
            u.clockThree.toString().includes(searchValue) ||
            u.clockFour.toString().includes(searchValue);
    });

    if (userClocks) {
        user.clocks = userClocks;
    } else {
        user.clocks = [];
    }

    showHomePage(true);
};

/**
 * Método responsável por carregar no modal os valores que serão editados
 * de acordo com o item clicado no FAB de edição
 */
function loadClocks(event) {
    const clock = event.currentTarget.clock;

    clocksForm.date.disabled = true;
    clocksForm.date.value = clock.date;
    document.getElementById('date-label').classList.add('active');

    clocksForm.clockOne.value = clock.clockOne;
    clocksForm.clockTwo.value = clock.clockTwo;
    clocksForm.clockThree.value = clock.clockThree;
    clocksForm.clockFour.value = clock.clockFour;
};

/**
 * Método responsável por deletar a batida de ponto
 * de acordo com o item clicado no FAB de exclusão
 */
function deleteClock(event) {
    const clock = event.currentTarget.clock;

    if (user.clocks) {
        const index = user.clocks.findIndex(function (u) { return u.date === clock.date; });
        user.clocks.splice(index, index >= 0 ? 1 : 0);
    }

    updateLocalStorage();

    window.location.reload();
};

/**
 * Método responsável por salvar a batida de ponto, ordenando as batidas
 */
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
    user.clocks = user.clocks.sort(function (c1, c2) {
        const dateOneDayMonthYear = c1.date.toString().split('/');
        const dateTwoDayMonthYear = c2.date.toString().split('/');

        return new Date(dateOneDayMonthYear[2], dateOneDayMonthYear[1], dateOneDayMonthYear[0], 0, 0, 0, 0) -
            new Date(dateTwoDayMonthYear[2], dateTwoDayMonthYear[1], dateTwoDayMonthYear[0], 0, 0, 0, 0);
    });

    resetForm();

    M.Modal.getInstance(clocksModal).close();

    updateLocalStorage();

    window.location.reload();
};

/**
 * Método responsável por armazenar no localStorage as batidas de ponto do usuário,
 * bem como os usuários da aplicação
 */
function updateLocalStorage() {
    localStorage.setItem('loggedUser', JSON.stringify(user));

    const index = users.findIndex(function (u) { return u.username === user.username; });
    users.splice(index, index >= 0 ? 1 : 0);

    users.push(user);
    users = users.sort(function (u1, u2) { return u1.username - u2.username; });

    localStorage.setItem('users', JSON.stringify(users));
};

/**
 * Método responsável por resetar o formulário de batidas de ponto
 */
function resetForm() {
    clocksForm.reset();
};

navigator.serviceWorker.register('./timesheet-calculator-sw.js');
const API = "http://localhost:3000";

//in-memory auth info

let username = localStorage.getItem("username");
let _token = localStorage.getItem("token");

if (_token) {
    showAuth();
} else {
    $("#need-auth").show();
}

//show forms if user is authenciated, hides login, shows real data

function showAuth() {
    $("#need-auth").hide();
    $("#has-auth").show();
    $("#username").text(username);

    populateForm();
    populateTo();
    populateUserDropDown();
}


//this function is called when user gets authenticated => stores auth info

function saveAuth(new_username, new_token) {
    username = new_username;
    _token = new_token;

    localStorage.setItem("username", username);
    localStorage.setItem("token", _token);
    showAuth();
}

//handle the register form: register user, save auth, and show real data

$("#register-form").on("submit", async (evt) => {
    evt.preventDefault();

    const username = $("#register-username").val();
    const password = $("#register-password").val();
    const first_name = $("#register-fname").val();
    const last_name = $("#register-lname").val();
    const phone = $("#register-phone").val();

    let res = await $.ajax({
        url: `${API}/auth/register`,
        method: "POST",
        data: JSON.stringify({
            username,
            password,
            first_name,
            last_name,
            phone
        }),
        contentType: "application/json",
        dataType: "json",
    });
    saveAuth(username, res.token);
});


//handle login => save auth & show real data.

$("#login-form").on("submit", async (evt) => {
    evt.preventDefault();

    const username = $("#login-username").val();
    const password = $("#login-password").val();

    let res = await $.post(`${API}/auth/login`, {
        username,
        password
    });
    saveAuth(username, res.token);
});


//get & show messages from user.

async function populateFrom() {
    const $msgsFrom = $("#msgs-from");
    $msgsFrom.empty();

    let res = await $.get(`${API}/users/${username}/to`, {
        _token
    });

    for (let m of res.messages) {
        let text = m.body + " - " + m.from_user.username;
        $msgsTo.append($("<li>", {
            text: text
        }));
    }
}


//get and show messages to user

async function populateTo() {
    const $msgsTo = $("#msgs-to");
    $msgsTo.empty();

    let res = await $.get(`${API}/users/${username}/to`, {
        _token
    });
    for (let m of res.messages) {
        let text = m.body + " - " + m.from_user.username;
        $msgsTo.append($("<li>", {
            text: text
        }));
    }
}


//populate list of users for sent-to

async function populateUserDropDown() {
    $("#newmsg-to").empty();

    let res = await $.get(`${API}/users`, {
        _token
    });

    for (let {
            username
        } of res.users) {
        $("#newmsg-to").append($("<option>", {
            text: username,
            value: username
        }));
    }
}


//handle new messages submission => add, then repopulate lists

$("#new-message-form").on("submit", async (evt) => {
    evt.preventDefault();

    let to_username = $("#newmsgs-to").val();
    let body = $("#newmsg-body").val();

    await $.post(`${API}/messages`, {
        to_username,
        body,
        _token
    });

    populateFrom();
    populateTo();

    $("#newmsg-to").val("");
    $("#newmsg-body").val("");
});


//logout => remove stored username/_token and re-show login

$("#logout").on("click", (evt) => {
    $("#need-auth").show();
    $("#has-auth").hide();

    _token = null;
    username = null;
    localStorage.removeItem("username");
    localStorage.removeItem("token");
});
let token = window.localStorage.getItem("token");

if (token) {
  window.location.pathname = "../index.html";
}

const form = document.querySelector(".js-user-login-form");
const userEmail = document.querySelector(".js-login-email");
const userPassword = document.querySelector(".js-login-password");
const showPassword = document.querySelector(".show-password");
const LOCALHOST = "192.168.1.104";

async function userLogin() {
  try {
    let obj = {
      email: userEmail.value.trim(),
      password: userPassword.value,
    };
    let response = await fetch(`http://${LOCALHOST}:5000/user/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (!response.ok) throw new Error("Invalid post request");
    let data = await response.json();
    console.log(data);
    if (data.token) {
      window.location.pathname = "../index.html";
      window.localStorage.setItem("token", data.token);
    }
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  userLogin();
});

showPassword.addEventListener("mousedown", (e) => {
  userPassword.type = "text";
});

showPassword.addEventListener("mouseup", (e) => {
  userPassword.type = "password";
});

showPassword.addEventListener("mouseleave", (e) => {
  userPassword.type = "password";
});

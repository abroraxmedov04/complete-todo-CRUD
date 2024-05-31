const token = window.localStorage.getItem("token");

if (token) {
  window.location.pathname = "../index.html";
}

const form = document.querySelector(".js-user-register");
const userName = document.querySelector(".js-user-name");
const userPhone = document.querySelector(".js-user-phone-number");
const userEmail = document.querySelector(".js-user-email");
const userPassword = document.querySelector(".js-user-password");
const showPassword = document.querySelector(".show-password");
const LOCALHOST = "192.168.1.104";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  userRegister();
});

async function userRegister() {
  try {
    const obj = {
      user_name: userName.value.trim(),
      phone: userPhone.value.trim(),
      email: userEmail.value.trim(),
      password: userPassword.value,
    };
    let response = await fetch(`http://${LOCALHOST}:5000/user/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    let data = await response.json();
    if (data.token) {
      window.localStorage.setItem("token", data.token);
      window.location.pathname = "./index.html";
    }
  } catch (error) {
    console.log(error);
  }
}

showPassword.addEventListener("mousedown", (e) => {
  userPassword.type = "text";
});

showPassword.addEventListener("mouseup", (e) => {
  userPassword.type = "password";
});

showPassword.addEventListener("mouseleave", (e) => {
  userPassword.type = "password";
});

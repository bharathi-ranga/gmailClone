var Account1 = { id: 1, username: "test1@gmail.com", password: "1111" };
var Account2 = { id: 2, username: "test2@gmail.com", password: "2222" };
var accounts = [Account1, Account2];

var userId = document.getElementById("InputEmail");
var pwd = document.getElementById("InputPassword");
var login = document.getElementById("LoginBtn");
var loginPage = document.querySelector(".login-page");
var error = document.querySelector(".error");
var composeBtn = document.getElementById("composeBtn");
var composeBox = document.querySelector(".compose-email");
var closeMail = document.querySelector("#compose-close");
var minimizeMail = document.querySelector(".minimize-box");
var id = 0;
// var minimizeBtn = document.querySelector("#minBtn");
var temp = 0;
var alldata;
var id1 = 0;

login.addEventListener("click", async function loginFuntion(e) {
  e.preventDefault();

  accounts.forEach((arr) => {
    if (arr.username === userId.value && arr.password === pwd.value) {
      loginPage.style.zIndex = "0";
      loginPage.style.display = "none";
      document.body.style.overflowY = "scroll";
      id = arr.id;
      temp = 1;
    }
  });
  if (temp === 0) error.style.display = "block";
  getPrimaryMails();
});

composeBtn.addEventListener("click", function composeEmail() {
  composeBox.style.display = "unset";
});

closeMail.addEventListener("click", function closeEmail() {
  composeBox.style.display = "none";
});

var toMail = document.getElementById("recepient-mail");
var sub = document.getElementById("subject-mail");
var msg = document.getElementById("emailBody");
var sendBt = document.getElementById("sendEmail");
var mesg = {};
var prime = [];
var sent = [];
var recepId = "";

sendBt.addEventListener("click", async function sendMessage(e) {
  e.preventDefault();
  spin.style.display = "unset";
  recepId = getRecepientId(toMail.value);

  mesg = new SentMsg(toMail.value, sub.value, msg.value);
  console.log(mesg);
  sent.push(mesg);
  //sent = updateSent(mesg);

  let data = {
    from: userId.value,
    to: toMail.value,
    subject: sub.value,
    message: msg.value,
    sentEmail: sent,
  };
  let result = await fetch(
    `https://60c82f8dafc88600179f64cd.mockapi.io/PrimaryMails/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  console.log(result);
  composeBox.style.display = "none";

  let data2 = {
    from: userId.value,
    to: toMail.value,
    subject: sub.value,
    message: msg.value,
    primaryEmail: prime.push(mesg),
  };

  let result2 = await fetch(
    `https://60c82f8dafc88600179f64cd.mockapi.io/PrimaryMails/${recepId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  spin.style.display = "none";
  console.log(result2);
});

function getRecepientId(to) {
  accounts.forEach((arr) => {
    if (arr.username === to) {
      id1 = arr.id;
      console.log(id1);
    }
  });
  return id1;
}

function SentMsg(to, sub, msg) {
  this.to = to;
  this.sub = sub;
  this.msg = msg;
}

var messagesBox = document.querySelector(".main-body");

var response = "";
var primary = document.getElementById("primary");
var s = document.getElementById("sent");
var drt = document.getElementById("draft");
var spin = document.getElementById("spinner");
var flag = 0;

primary.addEventListener("click", () => {
  flag = 0;
  getPrimaryMails();
});
s.addEventListener("click", () => {
  flag = 1;
  getPrimaryMails();
});
drt.addEventListener("click", () => {
  flag = 2;
  getPrimaryMails();
});
async function getPrimaryMails() {
  spin.style.display = "unset";
  await fetch(`https://60c82f8dafc88600179f64cd.mockapi.io/PrimaryMails/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      response = res;
      spin.style.display = "none";
      if (flag == 0) displayPrimary(response.primaryEmail);
      if (flag == 1) displaySent(response.sentEmail);
      if (flag == 2) displayDrafts(response.drafts);
    });
  console.log(response);
}

function displayPrimary(d) {
  if (d.length == 0) {
    let mainmsgDiv = document.createElement("div");
    mainmsgDiv.setAttribute("class", "display-box");
    mainmsgDiv.innerHTML = "No Primary messages avaiable to display";
    messagesBox.append(mainmsgDiv);
  } else {
    d.forEach((arr) => {
      let mainmsgDiv = document.createElement("div");
      mainmsgDiv.setAttribute("class", "display-box");
      mainmsgDiv.innerHTML = arr.msg;
      messagesBox.append(mainmsgDiv);
    });
  }
}

function displaySent(s) {
  console.log("in sent messges");
  messagesBox.innerHTML = "";
  if (s.length == 0) {
    let mainmsgDiv = document.createElement("div");
    mainmsgDiv.setAttribute("class", "display-box");
    mainmsgDiv.innerHTML = "No sent messages to display";
    messagesBox.append(mainmsgDiv);
  } else {
    s.forEach((arr) => {
      let div1 = document.createElement("span");
      div1.innerHTML = "To : " + arr.to + "<br>";
      let mainmsgDiv = document.createElement("div");
      mainmsgDiv.setAttribute("class", "display-box");
      mainmsgDiv.innerHTML = "message :" + arr.msg + "<br>";
      mainmsgDiv.append(div1);
      messagesBox.append(mainmsgDiv);
    });
  }
}

function displayDrafts(dr) {
  messagesBox.innerHTML = "";
  if (dr.length == 0) {
    let mainmsgDiv = document.createElement("div");
    mainmsgDiv.setAttribute("class", "display-box");
    mainmsgDiv.innerHTML = "No Draft messages to display";
    messagesBox.append(mainmsgDiv);
  } else {
    dr.forEach((arr) => {
      let mainmsgDiv = document.createElement("div");
      mainmsgDiv.setAttribute("class", "display-box");
      mainmsgDiv.innerHTML = arr.msg;
      messagesBox.append(mainmsgDiv);
    });
  }
}

async function updateSent(mesg) {
  spin.style.display = "unset";
  await fetch(`https://60c82f8dafc88600179f64cd.mockapi.io/PrimaryMails/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log(res, res.sentEmail);
      sent = res.sentEmail.push(mesg);
      spin.style.display = "none";
    })
    .catch((err) => {
      alert(err);
      spin.style.display = "none";
    });
  return sent;
}

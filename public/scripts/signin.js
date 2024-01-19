let signBool = true;
document.querySelector(".sign").addEventListener("click", function (e) {
	signupOrsignin(this);
});

const singinFrom = document.querySelector(".singin");
const singupFrom = document.querySelector(".singup");
function signupOrsignin(btn) {
	if (signBool) {
		singinFrom.style.display = "none";
    singupFrom.style.display = "block";
    btn.innerHTML = "SignIn"
		signBool = false;
	} else {
		singinFrom.style.display = "block";
    singupFrom.style.display = "none";
    btn.innerHTML = "SignUp"
		signBool = true;
	}
}

const signinForm = document.querySelector(".signin-form");
signinForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = signinForm.elements.email.value;
	const password = signinForm.elements.password.value;
	singinQuery(email, password);
});

function singinQuery(email, password) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("email", email);
	formData.append("password", password);

	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		warningAlert(this.status, result);
	};

	xhttp.open("POST", "/signin");
	xhttp.send(formData);
}

const signupForm = document.querySelector(".singup-form");
signupForm.addEventListener("submit", (e) => {
	e.preventDefault();
  const username = signupForm.elements.username.value;
  const email = signupForm.elements.email.value;
  const password = signupForm.elements.password1.value;
	const password2 = signupForm.elements.password2.value;
	singupQuery(username, email, password, password2 );
});

function singupQuery(username, email, password, password2 ) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

  formData.append("username", username);
  formData.append("email", email);
	formData.append("password", password);
	formData.append("password2", password2);

	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		warningAlert(this.status, result);
	};

	xhttp.open("POST", "/signup");
	xhttp.send(formData);
}

const alerts = document.querySelector(".alerts");
function warningAlert(status, result) {
	let alert = "";
	if (status == 200) {
		alert = `
		<div class="alert alert-success alert-dismissible fade show" role="alert">
		<strong>${result.msg}</strong> Sucessfully.
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`;
		setTimeout(() => {
			window.location.replace("/");
		}, 2000);
	} else {
		let errors = Array.isArray(result) ? result : [result];
		errors.forEach(
			(err) =>
				(alert += `
		<div class="alert alert-warning alert-dismissible fade show" role="alert">
		<strong>Warning</strong> ${err.msg}
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`),
		);
	}
	alerts.innerHTML = alert;
}

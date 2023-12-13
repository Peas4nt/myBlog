// letter counter
const blogText = document.querySelector(".blog-text");
const letCount = document.querySelector("#letter-counter");

// count letters
blogText.addEventListener("input", charCounter);
function charCounter() {
	const charCount = blogText.value.length;
	letCount.innerHTML = charCount;
	// make text red if text lenght = 255
	if (charCount === 255) {
		letCount.className = "text-danger";
	} else {
		letCount.className = "";
	}
}

let image = "";
document.getElementById("imageInput").addEventListener("change", function (e) {
	console.log(e.target.files);
	updateImage(e.target.files[0]);
});

function updateImage(newImage) {
	if (newImage.type.startsWith("image/")) {
		image = newImage;
		showImage();
	}
}

const prevImagesArr = document.querySelectorAll(".preview img");
function showImage() {
	const reader = new FileReader();
	reader.onload = function (e) {
		prevImagesArr.forEach((prevImg) => {
			prevImg.src = e.target.result;
		});
	};
	reader.readAsDataURL(image);
}

const passwordInputsBtn = document.querySelectorAll("#showpass");
passwordInputsBtn.forEach((passInputBtn) => {
	passInputBtn.addEventListener("click", function (e) {
		const password = passInputBtn.parentNode.querySelector(".form-control");
		if (password.type === "password") {
			password.type = "text";
		} else {
			password.type = "password";
		}
	});
});

// Put image
const imageForm = document.querySelector(".image-form");
imageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	imageFormQuery(image);
});

function imageFormQuery(img) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("image", img);

	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		warningAlert(this.status, result);
	};

	xhttp.open("PUT", "/settings/img");
	xhttp.send(formData);
}

// put profile
const profileForm = document.querySelector(".profile-form");
profileForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const username = profileForm.elements.username.value;
	const description = profileForm.elements.description.value;
	profileFormQuery(username, description);
});

function profileFormQuery(username, description) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("username", username);
	formData.append("description", description);

	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		warningAlert(this.status, result);
	};

	xhttp.open("PUT", "/settings/profile");
	xhttp.send(formData);
}

// put Private inforamtion
const privateForm = document.querySelector(".private-form");
privateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = privateForm.elements.firstName.value;
  const lastName = privateForm.elements.lastName.value;
  const email = privateForm.elements.email.value;
  const currentPassword = privateForm.elements.currentPassword.value;
  const newPassword = privateForm.elements.newPassword.value;
  const confirmPassword = privateForm.elements.confirmPassword.value;
  privateFormQuery(firstName, lastName, email, currentPassword, newPassword, confirmPassword)
});

function privateFormQuery(firstName, lastName, email, currentPassword, newPassword, confirmPassword) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("firstName", firstName);
	formData.append("lastName", lastName);
	formData.append("email", email);
	formData.append("currentPassword", currentPassword);
	formData.append("newPassword", newPassword);
	formData.append("confirmPassword", confirmPassword);


	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		warningAlert(this.status, result);
	};

	xhttp.open("PUT", "/settings/private");
	xhttp.send(formData);
}

const alerts = document.querySelector(".alerts");
function warningAlert(status, result) {
	let alert = "";
	if (status == 200) {
		alert = `
		<div class="alert alert-success alert-dismissible fade show" role="alert">
		<strong>${result.msg}</strong> Successful.
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`;
		setTimeout(() => {
			window.location.reload();
		}, 5000);
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

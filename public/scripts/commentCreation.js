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

// query
const blogTexts = document.querySelector(".blog-text");

document.querySelector(".submit-btn").addEventListener("click", function (e) {
	const text = blogTexts.value;
	const arr = JSON.parse(this.id);
	const blogId = arr[0];
	const commentId = arr[1];
	console.log(arr);

	if (blogText.value.length < 1) {
		warningAlert(400, {
			msg: "Enter the text (min chars: 1, max chars: 255)",
		});
	} else commentQuery(text, blogId, commentId);
});

function commentQuery(text, blogId, commentId) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("text", text);
	formData.append("blogId", blogId);
	formData.append("commentId", commentId);

	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		console.log(result);
		warningAlert(this.status, result);
	};

	xhttp.open("POST", "/comment");
	xhttp.send(formData);
}

function formClear() {
	blogTexts.value = "";
	setTimeout(() => {
		window.location.reload();
	}, 2000)
}

// alerts
const alerts = document.querySelector(".alerts");
function warningAlert(status, result) {
	let alert = "";
	if (status == 200) {
		alert = `
		<div class="alert alert-success alert-dismissible fade show" role="alert">
		<strong>${result.msg}</strong> Comment created successfully <a href="/comment/${result.commentId}" class="alert-link">comment page</a>.
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`;
		formClear();
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

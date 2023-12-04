const likeCheckboxs = document.querySelectorAll(".like");
likeCheckboxs.forEach((element) =>
	element.addEventListener("change", function (e) {
		const likesCounter = this.parentNode.parentNode.querySelector(".likes");
		const blogId = likesCounter.id;
		const status = this.checked;
		if (this.checked) likesCounter.innerHTML++;
		else likesCounter.innerHTML--;
		query(blogId, status);
	}),
);

function query(blogId, status) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	// add blogId and status
	formData.append("blogId", blogId);
	formData.append("status", status);

	xhttp.onreadystatechange = function () {
		if (this.status == 200) {
			console.log(this.responseText);
		}
	};

	xhttp.open("POST", "/blog/like");
	xhttp.send(formData);
}

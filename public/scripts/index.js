// Function add link to div
function myhref(web) {
	window.location.href = web;
}

// That function add feature to like the blog post
const likeCheckboxs = document.querySelectorAll(".like");
likeCheckboxs.forEach((element) =>
	element.addEventListener("change", function (e) {
		const likesCounter = this.parentNode.parentNode.querySelector(".likes");
		const arr = JSON.parse(likesCounter.id);
		const blogId = arr[0];
		const commentId = arr[1];
		const status = this.checked;
		if (this.checked) likesCounter.innerHTML++;
		else likesCounter.innerHTML--;
		likeQuery(blogId, commentId, status);
	}),
);

// query to server
function likeQuery(blogId, commentId, status) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	// add blogId and status
	formData.append("blogId", blogId);
	formData.append("commentId", commentId);
	formData.append("status", status);

	xhttp.open("POST", "/blog/like");
	xhttp.send(formData);
}

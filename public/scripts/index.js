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

const blogDeleteBtns = document.querySelectorAll(".blog-delete-btn");
blogDeleteBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		const blogId = btn.id;
		const text = "You want to delete this blog?";
		if (confirm(text)) {
			deleteBlogQuery(btn, blogId);
		}
	});
});

function deleteBlogQuery(btn, blogId) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("blogId", blogId);
	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		if (this.status == 200) {
			btn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
		}
	};
	xhttp.open("DELETE", "/blog");
	xhttp.send(formData);
}

const commDeleteBtns = document.querySelectorAll(".comm-delete-btn");
commDeleteBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		const commId = btn.id;
		const text = "You want to delete this comment?";
		if (confirm(text)) {
			deleteCommQuery(btn, commId);
		}
	});
});

function deleteCommQuery(btn, commId) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	formData.append("commId", commId);
	xhttp.onload = function () {
		const result = JSON.parse(this.responseText);
		if (this.status == 200) {
			btn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
		}
	};
	xhttp.open("DELETE", "/comment");
	xhttp.send(formData);
}
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

// images preview
let currentFiles = [];
let newFiles = [];
const previewContainer = document.getElementById("previewContainer");

document.getElementById("imageInput").addEventListener("change", function (e) {
	newFiles = e.target.files;
	updateFileList();
});

// update preview files list
function updateFileList(fileList) {
	previewContainer.innerHTML = "";

	currentFiles.forEach((file, index) => showFile(file, index));

	Array.from(newFiles).forEach((file, index) => {
		if (file.type.startsWith("image/")) {
			currentFiles.push(file);
			showFile(file, index);
		}
	});
	newFiles = [];
}

// add file to files preview
function showFile(file, index) {
	const reader = new FileReader();
	reader.onload = function (e) {
		const imgContainer = document.createElement("div");
		imgContainer.classList.add("image-preview");
		imgContainer.innerHTML += `
        <img src="${e.target.result}" alt="Image Preview">
        <button class="btn btn-sm btn-danger delete-btn" id="${index}">&times;</button>
        `;
		previewContainer.appendChild(imgContainer);

		imgContainer
			.querySelector(".delete-btn")
			.addEventListener("click", function () {
				removeFile(parseInt(this.id));
			});
	};
	reader.readAsDataURL(file);
}

// remove file from preview
function removeFile(index) {
	currentFiles.splice(index, 1);
	updateFileList();
}

// query
const blogStatus = document.querySelector(".blog-status");
const blogTexts = document.querySelector(".blog-text");

document.querySelector(".submit-btn").addEventListener("click", function (e) {
	const status = blogStatus.value;
	const text = blogTexts.value;
	const images = currentFiles;

	query(status, text, images);
});

function query(status, text, images) {
	const xhttp = new XMLHttpRequest();
	const formData = new FormData();

	// add status and text
	formData.append("status", status);
	formData.append("text", text);

	// add images
	images.forEach((image) => formData.append("images", image));

	xhttp.open("POST", "/blog/create");
	xhttp.send(formData);
}

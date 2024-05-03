const posts = document.getElementById("posts");

// Show Posts
posts.innerHTML = "";
let currentPage = 1;
let lastPage;
let postID;

getPosts();

// Handle Infinite Scroll
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts();
  }
});

document.querySelector("#login-close-btn").onclick = () => {
  username.value = "";
  password.value = "";
};
document.getElementById("close-post").onclick = () => {
  document.querySelector("#newPost form").reset();
};

// Determine Which Button is Clicked Add Or Edit
document.addEventListener("click", (e) => {
  if (e.target.innerHTML == "+") {
    document.querySelector("#newPost .modal-title").innerHTML = "Create Post";
    document.querySelector("#create-post").innerHTML = "Create";
  } else if (e.target.innerHTML == "Edit") {
    document.querySelector("#newPost .modal-title").innerHTML = "Edit Post";
    document.querySelector("#create-post").innerHTML = "Update";
  }
});

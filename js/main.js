let loader = document.querySelector(".loader");
window.onload = function () {
  loader.classList.add("hide");
};

const baseUrl = "https://tarmeezacademy.com/api/v1";
const defaultProfileImg =
  "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg";

function getPosts() {
  loader.classList.remove("hide");
  fetch(baseUrl + "/posts" + `?limit=20&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      loader.classList.add("hide");

      lastPage = data.meta.last_page;
      let user = JSON.parse(localStorage.getItem("user"));

      data.data.forEach((post) => {
        let postImage = "";
        if (post.image.length) {
          postImage = `<img src="${post.image}" alt="" class="w-100 img-fluid" style="max-height: 450px;">`;
        }

        posts.innerHTML += `
        <div class="card shadow my-3" >
        <div class=' d-flex gap-2 position-absolute ${
          post.author.id == user?.id ? "d-block" : "d-none"
        }' style='right: 10px; top: 10px'>
          <button class='btn btn-sm btn-primary' data-bs-toggle="modal"
          data-bs-target="#newPost" onclick="fillInputs('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>
          <button class='btn btn-sm btn-danger' onclick="deletePost(${
            post.id
          })">Delete</button>
        </div>
        <a href='profile.html?id=${
          post.author.id
        }' class="card-header d-flex align-items-center gap-1" style="text-decoration: none; width: fit-content;">
          <img src="${
            post.author.profile_image.length
              ? post.author.profile_image
              : defaultProfileImg
          }" alt="" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
          <p class="username m-0">${post.author.username}</p>
          
        </a>
        <div class="card-body" style="cursor: pointer" onclick="viewPost(${
          post.id
        })">
          ${postImage}
          <h6 class="time text-secondary mt-2">${post.created_at}</h6>
          <h5 class="card-title">${post.title ? post.title : ""}</h5>
          <p class="card-text mb-4">${post.body ? post.body : ""}</p>
          <hr>
          <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
            viewBox="0 0 16 16">
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
          </svg>
            <span class="d-inline-block me-3">(${
              post.comments_count
            }) comments</span>
            <span class='text-white'>
            ${post.tags.map((tag) => {
              return (
                "<span class='badge text-bg-secondary d-inline-block me-2'>" +
                tag.name +
                "</span>"
              );
            })}
            </span>
          </div>
        </div>
      </div>
        `;
      });
    });
}

function setUI() {
  if (localStorage.getItem("token")) {
    // For Logged in User
    document.querySelector("#logged-btns").style.display = "none";
    document
      .querySelector("#logout-btn")
      .style.setProperty("display", "flex", "important");
    document
      .querySelector("#add-btn")
      ?.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    if (user != null) {
      document.querySelector(".navbar .user-info img").src = user.profile_image
        .length
        ? user.profile_image
        : defaultProfileImg;
      document.querySelector(".navbar .user-info p").innerHTML = user.username;
    }

    // Show Comment Form
    document
      .querySelector("#comment-form")
      ?.style.setProperty("display", "flex", "important");
  } else {
    document.querySelector("#logged-btns").style.display = "block";
    document
      .querySelector("#logout-btn")
      .style.setProperty("display", "none", "important");
    document
      .querySelector("#add-btn")
      ?.style.setProperty("display", "none", "important");

    document
      .querySelector("#comment-form")
      ?.style.setProperty("display", "none", "important");
  }
}
setUI();

// Get Current User Info
function getCurrentUser() {
  // Get Current User Info
  let user = null;

  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
  }

  return user;
}

// Handle Login
document.querySelector("#login-btn").onclick = () => {
  loader.classList.remove("hide");
  let username = document.querySelector("#username");
  let password = document.querySelector("#password");

  let params = {
    username: username.value,
    password: password.value,
  };

  axios
    .post(`${baseUrl}/login`, params)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUI();

      // const modal = document.querySelector("#loginModal");
      // bootstrap.Modal.getInstance(modal).hide();  // To Hide Modal

      document.getElementById("login-close-btn").click(); // Hide Modal

      username.value = "";
      password.value = "";

      swal({
        icon: "success",
        title: "Logged in successfully",
        buttons: {
          // cancel: true,
          confirm: true,
        },
        timer: 3000,
      });
    })
    .catch((err) => {
      console.log(err);
      swal({
        icon: "error",
        title: err.response.data.message || "Something went wrong",
        timer: 3000,
      });
    })
    .finally(() => {
      loader.classList.add("hide");
    });
};

// Handle Register
document.getElementById("signup-btn").onclick = () => {
  loader.classList.remove("hide");
  let name = document.querySelector("#signupModal #name").value;
  let username = document.querySelector("#signupModal #signup-username").value;
  let email = document.querySelector("#signupModal #email").value;
  let password = document.querySelector("#signupModal #signup-password").value;
  let image = document.querySelector("#signupModal #image").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (image) {
    formData.append("image", image);
  }

  axios
    .post(`${baseUrl}/register`, formData)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      document.getElementById("signup-close-btn").click();
      document.querySelector("#signupModal form").reset();
      setUI();

      swal({
        icon: "success",
        title: "Registerd successfully",
        buttons: {
          // cancel: true,
          confirm: true,
        },
        timer: 3000,
      });
    })
    .catch((err) => {
      console.log(err);
      swal({
        icon: "error",
        title: err.response.data.message,
        buttons: {
          cancel: true,
          confirm: true,
        },
      });
    })
    .finally(() => loader.classList.add("hide"));
};

// Handle Logout
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUI();
  swal({
    icon: "success",
    title: "Logged out successfully",
    buttons: {
      // cancel: true,
      confirm: true,
    },
    timer: 3000,
  });
  if (location.pathname == "/profile.html") {
    location.href = "index.html";
  }
};

function showPost(id) {
  let postElement = document.getElementById("post");
  axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`).then((res) => {
    let post = res.data.data;

    let commentsContent = "";

    for (let comment of post.comments) {
      commentsContent += `
      <div class="py-2 px-3 bg-dark">
        <div class=" d-flex align-items-center gap-2">
          <img src="${
            comment.author.profile_image.length
              ? comment.author.profile_image
              : defaultProfileImg
          }" alt="" class="rounded-circle" style="width: 40px; height: 40px">
          <span style="font-weight: 500;">${comment.author.username}</span>
        </div>
        <p class="px-4 ms-4 p-3 bg-secondary rounded-3 text-white" style="font-size: 14px;width: fit-content;"> ${
          comment.body
        }
        </p>
      </div>
      `;
    }

    postElement.innerHTML = `
      <div class="card shadow my-3" >
      <a href='profile.html?id=${
        post.author.id
      }' class="card-header d-flex align-items-center gap-1" style="text-decoration: none;">
        <img src="${
          post.author.profile_image.length
            ? post.author.profile_image
            : defaultProfileImg
        }" alt="" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
        <p class="username m-0">${post.author.username}</p>
      </a>
      <div class="card-body">
        <img src="${
          post.image.length ? post.image : ""
        }" alt="" class="w-100 img-fluid" style="max-height: 450px;">
        <h6 class="time text-secondary mt-2">${post.created_at}</h6>
        <h5 class="card-title">${post.title ? post.title : ""}</h5>
        <p class="card-text mb-4">${post.body ? post.body : ""}</p>
        <hr>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
            viewBox="0 0 16 16">
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
          </svg>
          <span class="d-inline-block me-3">(${
            post.comments_count
          }) comments</span>
          <span class='text-white'>
          ${post.tags.map((tag) => {
            return (
              "<span class='badge text-bg-secondary d-inline-block me-2'>" +
              tag.name +
              "</span>"
            );
          })}
          </span>
        </div>
      </div>
      <div id="comments" style="background: rgb(225, 222, 222);max-height: 400px; overflow-y: scroll;">
            ${commentsContent}
      </div>
      <div class=' ${
        getCurrentUser() ? "d-flex" : "d-none"
      } gap-2 p-4' id='comment-form'>
        <input class="form-control" id='comment-input' autocomplete="off"  placeholder='type a comment..'/>
        <button class='btn btn-primary btn-sm px-4' onclick="addComment()">Send</button>
      </div>
    </div>
      `;
  });
}

// Create Comment on Specific Post
function addComment() {
  let comment = document.getElementById("comment-input").value;
  if (!comment) {
    swal({
      icon: "error",
      title: "Type a valid comment",
    });
    return false;
  }
  let params = {
    body: comment,
  };
  let token = localStorage.getItem("token");
  let headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, params, {
      headers: headers,
    })
    .then((res) => {
      showPost(id);
    })
    .catch((err) => {
      swal({
        icon: "error",
        title: err.response.data.message,
      });
    });
}

// Fill Inputs With Data On Edit
function fillInputs(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);
  postID = post.id;
  document.querySelector("#newPost #post-title").value = post.title;
  document.querySelector("#newPost #post-description").value = post.body;
}

// Delete Post
function deletePost(id) {
  let token = localStorage.getItem("token");
  let headers = {
    authorization: `Bearer ${token}`,
  };

  swal({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    dangerMode: true,
    buttons: {
      cancelButtonText: "Cancel",
      confirmButtonText: "Confirm",
    },
  }).then((result) => {
    // console.log("result: ", result);
    if (result == "confirmButtonText") {
      loader.classList.remove("hide");

      axios
        .delete(`${baseUrl}/posts/${id}`, { headers: headers })
        .then((res) => {
          posts.innerHTML = "";
          getPosts();
          swal({
            icon: "success",
            title: "Deleted Successfully",
            timer: 2000,
          });
        })
        .catch((err) =>
          swal({
            icon: "error",
            title: err.response.data.message || "Something went wrong",
          })
        )
        .finally(() => loader.classList.add("hide"));
    }
  });
}

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

// Create New Post
document.querySelector("#create-post")?.addEventListener("click", createPost);
function createPost(e) {
  loader.classList.remove("hide");
  let title = document.getElementById("post-title").value;
  let description = document.getElementById("post-description").value;
  let image = document.getElementById("post-image").files[0];
  const token = localStorage.getItem("token");

  posts.innerHTML = "";

  let formData = new FormData();

  formData.append("title", title);
  formData.append("body", description);
  if (image) {
    formData.append("image", image);
  }

  let headers = {
    authorization: `Bearer ${token}`,
  };

  // Edit Existing Post
  if (e.target.innerHTML == "Update") {
    // For Fixing The Api Method
    formData.append("_method", "put");

    axios
      .post(`${baseUrl}/posts/${postID}`, formData, {
        headers: headers,
      })
      .then((res) => {
        getPosts();
        document.getElementById("close-post").click();
        swal({
          icon: "success",
          title: "Post Updated successfully",
          buttons: {
            confirm: true,
          },
          timer: 2000,
        });
        document.querySelector("#newPost form").reset();
      })
      .catch((err) => console.log(err))
      .finally(() => loader.classList.add("hide"));
  } else {
    // Create New Post
    axios
      .post(`${baseUrl}/posts`, formData, {
        headers: headers,
      })
      .then((res) => {
        getPosts();

        document.getElementById("close-post").click();
        document.querySelector("#newPost form").reset();

        swal({
          icon: "success",
          title: "Post created successfully",
          buttons: {
            confirm: true,
          },
          timer: 2000,
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          icon: "error",
          title: err.response.data.message || "Something went wrong",
          buttons: {
            cancel: true,
            confirm: true,
          },
        });
      })
      .finally(() => loader.classList.add("hide"));
  }
}

function viewPost(id) {
  const newUrl = `postDetails.html?id=${id}`;
  window.location.href = newUrl;
}

let posts = document.getElementById("posts");
let user = JSON.parse(localStorage.getItem("user"));

if (!localStorage.getItem("user")) {
  location.href = "index.html";
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id") || user.id;

if (id) {
  getUser(id);
  getPosts(id);
}

function getUser() {
  // const id = 4730;
  axios.get(`${baseUrl}/users/${id}`).then((res) => {
    let {
      profile_image,
      name: n,
      username,
      email,
      comments_count,
      posts_count,
    } = res.data.data;

    document.querySelector(".user-info .profile").innerHTML = `
  <div class="row align-items-center text-center text-md-start g-3 g-md-0">
  <div class="col-md-3">
    <img src="${
      profile_image.length ? profile_image : defaultProfileImg
    }" class="img-fluid rounded-circle border-2 border" alt="profile image"
      style="width: 100px; height: 100px">
  </div>
  <div class="col-md-5 text-secondary d-flex flex-column gap-2 fw-bold">
  <div> Username: ${username}</div>
  <div> Name: ${n}</div>
  <div> Email: ${email}</div>
  </div>
  <div class="col-md-4 text-secondary">
    <p class="m-0"> <span style="font-size: 35px;">${posts_count}</span> Posts</p>
    <p class="m-0"> <span style="font-size: 35px;">${comments_count}</span> Comments</p>
  </div>
  </div>
`;
    document.querySelector(".user-info h1").innerHTML = username + " Posts";
  });
}
getUser();

// Get User Posts
function getPosts() {
  // let id = 4730;
  fetch(`${baseUrl}/users/${id}/posts`)
    .then((res) => res.json())
    .then((data) => {
      posts.innerHTML = "";
      let user = JSON.parse(localStorage.getItem("user"));

      data.data.reverse().forEach((post) => {
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
      <div class="card-header d-flex align-items-center gap-1">
        <img src="${
          post.author.profile_image.length
            ? post.author.profile_image
            : defaultProfileImg
        }" alt="" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
        <p class="username m-0">${post.author.username}</p>
        
      </div>
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
getPosts();

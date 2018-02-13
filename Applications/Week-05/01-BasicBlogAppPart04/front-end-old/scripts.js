// server address
let _baseUrl = "http://localhost";
let _port = "3000";

function getPosts() {
    clearEdit();

    jQuery.get(`${_baseUrl}:${_port}/api/post`, function(data) {
        generatePosts(data);
    });
}

function generatePosts(data) {
    let list = document.getElementById("post-list");
    list.innerHTML = "";
    data.data.forEach((post) => {
        var newPostDiv = document.createElement("div");
        newPostDiv.classList.add("row");
        let edit = `<a href='#' data-postid='${post.id}' data-posttitle='${post.title}' data-postbody='${post.post}' onclick='editPost(event)'>edit</a>`;
        let del = `<a href='#' data-postid='${post.id}' data-posttitle='${post.title}' onclick='delPost(event)'>delete</a>`;
        newPostDiv.innerHTML =
            `<div class="col-sm-12"><span class='post-title'>${post.title}</span>&nbsp; ${edit} | ${del}</div>
            <div class="col-sm-12"><textarea class="form-input" readonly>${post.post}</textarea></div>
            <div class="col-sm-12"><p>Author: ${post.author} Created: ${post.created_at} Last Edited: ${post.updated_at}</p></div>
        <hr>
        `;

        list.appendChild(newPostDiv);
    });
}

function searchPosts(e) {
    e.preventDefault();

    let list = document.getElementById("post-list");
    list.innerHTML = "";
    let searchVal = $('#search').val();
    console.log(searchVal)
    clearEdit();

    jQuery.post(`${_baseUrl}:${_port}/api/post/search`, { search: searchVal }, function(data) {
        generatePosts(data);
    });
}

function addPost(e) {
    e.preventDefault();
    let title = $("#posttitle");
    let post = $("#postbody");
    let author = $("#postname");
    let id = $("#postid");

    let titleVal = title.val();
    let postVal = post.val();
    let authorVal = author.val();
    let idVal = id.val();

    if (titleVal == "" || postVal == "") {
        alert('Title and Post cannot be blank.');
        return;
    }

    if (idVal == 0 && authorVal == "") {
        alert('Author cannot be blank.');
        return;
    }

    if (+idVal === 0) {
        jQuery.post(`${_baseUrl}:${_port}/api/post`, { title: titleVal, post: postVal, author: authorVal }, function(data) {
            getPosts();
        });
    } else {
        $.ajax({
                method: "PUT",
                url: `${_baseUrl}:${_port}/api/post/${idVal}`,
                data: { title: titleVal, post: postVal }
            })
            .done(function(msg) {
                getPosts();
            });
    }
}

function editPost(e) {
    e.preventDefault();
    let el = $(e.srcElement);
    let title = $("#posttitle");
    let post = $("#postbody");
    let author = $("#postname");
    let id = $("#postid");

    let titleVal = el.data("posttitle");
    let postVal = el.data("postbody");
    let idVal = el.data("postid");

    id.val(idVal);
    $("#post-submit").val('Edit Post');
    title.val(titleVal);
    post.val(postVal);
    author.val("");
    author.hide();
}

function delPost(e) {
    e.preventDefault();

    let el = $(e.srcElement);
    let postid = el.data("postid");
    let title = el.data("posttitle");
    if (confirm(`Are you sure you want to delete post '${title}'`)) {
        $.ajax({
                method: "DELETE",
                url: `${_baseUrl}:${_port}/api/post/${postid}`
            })
            .done(function(msg) {
                getPosts();
            });
    }
}

function clearEdit() {
    let title = $("#posttitle");
    let post = $("#postbody");
    let author = $("#postname");
    let id = $("#postid");
    id.val(0);
    $("#post-submit").val('Add Post');
    title.val("");
    post.val("");
    author.val("");
    author.show();
}


// run getPosts on 
$(function() {
    // server is running from same IP as front-end so get the hostname
    _baseUrl = `http://${window.location.hostname}`;
    getPosts();
    $("#add-post").on('submit', addPost);
    $("#search-post").on('submit', searchPosts);
    $("#post-showall").on('click', getPosts);
});
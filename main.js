//HTTP request get,get/id,post,put/id, delete/id

// ==================== POSTS ====================

// Lấy ID lớn nhất từ danh sách posts
async function getMaxPostId() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        if (posts.length === 0) return 0;
        let maxId = Math.max(...posts.map(post => parseInt(post.id) || 0));
        return maxId;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

// Load và hiển thị danh sách posts
async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of posts) {
            // Kiểm tra nếu post đã bị xoá mềm thì hiển thị gạch ngang
            let style = post.isDeleted ? "text-decoration: line-through; color: #999;" : "";
            let deleteBtn = post.isDeleted
                ? `<input type='button' value='Khôi phục' onclick='RestorePost("${post.id}")'/>`
                : `<input type='button' value='Xoá' onclick='DeletePost("${post.id}")'/>`;
            body.innerHTML += `<tr style="${style}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    ${deleteBtn}
                    <input type='button' value='Sửa' onclick='EditPost("${post.id}")'/>
                </td>
            </tr>`;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

// Lưu post (Thêm mới hoặc Cập nhật)
async function SavePost() {
    let id = document.getElementById("post_id_txt").value;
    let title = document.getElementById("post_title_txt").value;
    let views = document.getElementById("post_view_txt").value;

    if (id === "") {
        // Tạo mới - ID tự tăng
        let maxId = await getMaxPostId();
        let newId = (maxId + 1).toString();

        let res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Thêm dữ liệu thành công");
            ClearPostForm();
        }
    } else {
        // Cập nhật - PUT
        let getItem = await fetch("http://localhost:3000/posts/" + id);
        if (getItem.ok) {
            let existingPost = await getItem.json();
            let res = await fetch('http://localhost:3000/posts/' + id, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    views: views,
                    isDeleted: existingPost.isDeleted || false
                })
            });
            if (res.ok) {
                console.log("Sửa dữ liệu thành công");
                ClearPostForm();
            }
        }
    }
    LoadData();
}

// Xoá mềm post (đánh dấu isDeleted: true)
async function DeletePost(id) {
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: post.id,
                title: post.title,
                views: post.views,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("Xoá mềm thành công");
        }
    }
    LoadData();
}

// Khôi phục post đã xoá mềm
async function RestorePost(id) {
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: post.id,
                title: post.title,
                views: post.views,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Khôi phục thành công");
        }
    }
    LoadData();
}

// Chỉnh sửa post - điền thông tin vào form
async function EditPost(id) {
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        document.getElementById("post_id_txt").value = post.id;
        document.getElementById("post_title_txt").value = post.title;
        document.getElementById("post_view_txt").value = post.views;
    }
}

// Xóa form post
function ClearPostForm() {
    document.getElementById("post_id_txt").value = "";
    document.getElementById("post_title_txt").value = "";
    document.getElementById("post_view_txt").value = "";
}

// ==================== COMMENTS ====================

// Lấy ID lớn nhất từ danh sách comments
async function getMaxCommentId() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        if (comments.length === 0) return 0;
        let maxId = Math.max(...comments.map(comment => parseInt(comment.id) || 0));
        return maxId;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

// Load và hiển thị danh sách comments
async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let body = document.getElementById("comment-table-body");
        body.innerHTML = "";
        for (const comment of comments) {
            // Kiểm tra nếu comment đã bị xoá mềm thì hiển thị gạch ngang
            let style = comment.isDeleted ? "text-decoration: line-through; color: #999;" : "";
            let deleteBtn = comment.isDeleted
                ? `<input type='button' value='Khôi phục' onclick='RestoreComment("${comment.id}")'/>`
                : `<input type='button' value='Xoá' onclick='DeleteComment("${comment.id}")'/>`;
            body.innerHTML += `<tr style="${style}">
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>
                    ${deleteBtn}
                    <input type='button' value='Sửa' onclick='EditComment("${comment.id}")'/>
                </td>
            </tr>`;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

// Lưu comment (Thêm mới hoặc Cập nhật)
async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;

    if (id === "") {
        // Tạo mới - ID tự tăng
        let maxId = await getMaxCommentId();
        let newId = (maxId + 1).toString();

        let res = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                text: text,
                postId: postId,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Thêm comment thành công");
            ClearCommentForm();
        }
    } else {
        // Cập nhật - PUT
        let getItem = await fetch("http://localhost:3000/comments/" + id);
        if (getItem.ok) {
            let existingComment = await getItem.json();
            let res = await fetch('http://localhost:3000/comments/' + id, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    text: text,
                    postId: postId,
                    isDeleted: existingComment.isDeleted || false
                })
            });
            if (res.ok) {
                console.log("Sửa comment thành công");
                ClearCommentForm();
            }
        }
    }
    LoadComments();
}

// Xoá mềm comment (đánh dấu isDeleted: true)
async function DeleteComment(id) {
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: comment.id,
                text: comment.text,
                postId: comment.postId,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("Xoá mềm comment thành công");
        }
    }
    LoadComments();
}

// Khôi phục comment đã xoá mềm
async function RestoreComment(id) {
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: comment.id,
                text: comment.text,
                postId: comment.postId,
                isDeleted: false
            })
        });
        if (res.ok) {
            console.log("Khôi phục comment thành công");
        }
    }
    LoadComments();
}

// Chỉnh sửa comment - điền thông tin vào form
async function EditComment(id) {
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        document.getElementById("comment_id_txt").value = comment.id;
        document.getElementById("comment_text_txt").value = comment.text;
        document.getElementById("comment_postId_txt").value = comment.postId;
    }
}

// Xóa form comment
function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
}

// ==================== KHỞI TẠO ====================
LoadData();
LoadComments();

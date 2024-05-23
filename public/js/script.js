document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.querySelector('#username').value.trim();
            const password = document.querySelector('#password').value.trim();

            if (username && password) {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    document.location.replace('/');
                } else {
                    alert('Failed to log in.');
                }
            }
        });
    }

    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.querySelector('#username').value.trim();
            const password = document.querySelector('#password').value.trim();
            const errorElement = document.querySelector('#signup-error');

            if (username && password) {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();

                if (response.ok) {
                    document.location.replace('/');
                } else {
                    errorElement.textContent = data.message; 
                }
            }
        });
    }

    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const response = await fetch('/api/users/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.location.replace('/login');
            } else {
                alert('Failed to log out.');
            }
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');

            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.location.replace('/dashboard'); 
            } else {
                alert('Failed to delete post.');
            }
        });
    });

    const commentForm = document.querySelector('#comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const content = commentForm.querySelector('textarea[name="content"]').value.trim();
            const postId = commentForm.querySelector('input[name="postId"]').value;

            if (content) {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    body: JSON.stringify({ content, postId }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const commentData = await response.json();
                    addCommentToPage(commentData); 
                    commentForm.reset(); 
                } else {
                    alert('Failed to add comment.');
                }
            }
        });
    }

    function addCommentToPage(comment) {
        const commentSection = document.createElement('div');
        commentSection.classList.add('comment');
        commentSection.innerHTML = `
            <p>${comment.content}</p>
            <p>— You just now</p>
        `;
        document.body.appendChild(commentSection); 
    }
    const editPostForm = document.querySelector('#edit-post-form');
    if (editPostForm) {
        editPostForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const title = editPostForm.querySelector('input[name="title"]').value.trim();
            const content = editPostForm.querySelector('textarea[name="content"]').value.trim();
            const postId = editPostForm.getAttribute('action').split('/').pop();

            if (title && content) {
                const response = await fetch(`/api/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ title, content }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    document.location.replace('/dashboard'); 
                } else {
                    alert('Failed to update post.');
                }
            }
        });
    }
});



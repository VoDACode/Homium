(() => {
    const users = document.getElementById('users');

    loadUsers();

    function loadUsers() {
        users.innerHTML = '';
        fetch('/api/users/list')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                users.appendChild(createUser(user));
                let successBtn = document.getElementById(`success_${user.id}`);
                if (successBtn) 
                    successBtn.addEventListener('click', () => {
                        success(user.id);
                    });
                let removeBtn = document.getElementById(`remove_${user.id}`);
                if (removeBtn)
                    removeBtn.addEventListener('click', () => {
                        remove(user.id);
                    });
            });
        });
    }

    function createUser(data){
        let tr = document.createElement('tr');
        tr.id = `user_${data.id}`;
        let html=  `
        <th scope="row">${data.id}</th>
        <td>${data.firstName || ""}${data.lastName ? ' ' + data.lastName : ""}</td>
        <td><a href="https://t.me/${data.username}">@${data.username}</a></td>
        <td>
            ${ data.isAuthorized == false? `<button type="button" class="btn btn-success" id="success_${data.id}">Success</button>` : `<button type="button" class="btn btn-danger" id="remove_${data.id}">Remove</button>`}
        </td>`;
        tr.innerHTML = html;
        return tr;
    }

    function success(id){
        fetch(`/api/users/success`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:id})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            loadUsers();
        });
    }

    function remove(id){
        fetch(`/api/users/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:id})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById(`user_${id}`).remove();
        });
    }
})();
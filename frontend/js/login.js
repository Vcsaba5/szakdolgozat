function forRegister() {
    window.location.href = '/reg.html';
}

// login
document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/login', {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await res.json();

    if (data.success) {
        if (data.user.role === 1) {
            window.location.href = '/admin.html';
        } else if (data.user.role === 0) {
            window.location.href = '/user.html';
        }
    } else {
        alert(JSON.stringify(data));
    }
}


window.addEventListener("load", (event) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Elmultál már 18 éves?",
        text: "Oldalunk olyan termékeket tartalmaznak amelyek korhatárosok!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Igen, elmúltam 18!",
        allowOutsideClick: false,
        cancelButtonText: "Nem még nem!",
        reverseButtons: true
    })
    .then((result) => {
        if (result.isConfirmed) {
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            window.location.href = 'http://www.google.com';
        }
    });
});
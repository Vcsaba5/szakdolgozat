async function GetProductInCar() {
    const response = await fetch('/get-product-in-cart');
    const data = await response.json();
    console.table(data);
    let kosarHolder = document.getElementById('kosar');

    data.forEach(termek => {
        kosarHolder.innerHTML += `
        <div class="col-xl-3 col-md-4 col-sm-6 my-2">
            <div class="card bg-dark text-white my-2 h-100">
                <div id="${termek.termekID}">
                    <div>
                    <img src="../images/${termek.image}" alt="${termek.name}" title="${termek.name}" class="img img-fluid img-thumbnail mx-auto d-block">
                    </div>
                    <div class="card-body text-center">
                        <h3>${termek.name}</h3>
                    </div>
                    <div class="card-body text-center">
                        <h4>${termek.termektipus}</h5>
                        <h4>${termek.price}</h5>
                    </div>
                    <div class="card-body text-center">
                        <h5>${termek.quantity} DB</h5>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

GetProductInCar()
async function Confirmation() {
    const response = await fetch('/get-product-in-cart');
    const termekek = await response.json();

    Swal.fire({
        title: "Rendelés megerősítése",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Igen, Biztos",
        cancelButtonText: "Még vásárolok",
    }).then((result) => {
        if (result.isConfirmed) {
            {
                payment()
                async function payment() {


                    termekek.forEach(termek => {
                        const termekID = termek.termekID;
                        const price = termek.price;
                        const fizetes = fetch("/payment", {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify({ price, termekID, userID }),

                        });
                        const data = fizetes.json();
                        if (data.success) {
                            console.log("Sikeres vásárlás!");
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "A rendelésed sikeresen felvettük!",
                                showConfirmButton: false,
                                timer: 1500
                            });

                        }
                    })

                }

            }
        }
    });
}








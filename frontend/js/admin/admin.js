// Termekek lekérdezése
async function fetchSeries(userID) {
    const response = await fetch(`/termekUser/${userID}`);
    const airsoft = await response.json();
  
    seriesDrawing(airsoft, "Minden");
    stars(userID);
}

// termék felvétele
document.getElementById('create-series').onsubmit = async function (event) {
    event.preventDefault();

    const name = event.target.elements.name.value;
    const termektipus = event.target.elements.tipus.value;
    const price = event.target.elements.price.value;
    const image = event.target.elements.image.files[0]

    const formData = new FormData();
    formData.append('name', name);
    formData.append('termektipus', termektipus);
    formData.append('price', price);
    formData.append('image', image);

    const res = await fetch('/termekek', {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        alert("Sikeres felvétel!");
        event.target.elements.name.value = null;
        event.target.elements.termektipus.value = null;
        event.target.elements.price.value = null;
        fetchSeries();
    } else {
        alert("Hiba a felvétel során!");
    }
}

// termek törlése
async function deleteSeries(id) {
    const confirmed = confirm("Biztosan törölni szeretnéd?");

    if (!confirmed) {
        return;
    }

    const res = await fetch(`/termek/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Sikeres törlés!");
        fetchSeries();
    } else {
        alert("Hiba a törlés során!");
    }
}

// --- termék szerkesztése ---

// modal ablak mutatása, és a megfelelő id eltárolása a modal-on belül
async function editTermek(id) {
    console.log(id);
    const res = await (fetch(`/termek/${id}`));
    const dataFromFetch = await res.json();

    const name = dataFromFetch[0].name;
    const termektipus = dataFromFetch[0].termektipus;
    const price = dataFromFetch[0].price;

    document.getElementById('termekName').value = name;
    document.getElementById('termektipus').value = termektipus;
    document.getElementById('termekPrice').value = price;

    // ---
    // itt hozzáadjuk a termék id-ját a modal ablak attribútumaihoz
    // ---
    const modal = new bootstrap.Modal(document.getElementById('updateTermekModal'));
    const termekID = document.getElementById('updateTermekModal');
    termekID.setAttribute('data-termekID', id);
    modal.show();
}

// a backend-el való kapcsolatfelvétel
async function updateTermekData() {
    const modalElements = document.getElementById('updateTermekModal');
    const id = modalElements.getAttribute('data-termekID');
    const modal = bootstrap.Modal.getInstance(modalElements);

    const name = document.getElementById('termekName').value;
    const price = document.getElementById('termekPrice').value;
    const category = document.getElementById('termektipus').value;
    const image = document.getElementById('termekImage').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('termektipus',category);
    formData.append('image', image);

    const res = await fetch(`/termekek/${id}`, {
        method: "PUT",
        body: formData
    });

    if (res.ok) {
        modal.hide();
        alert("Sikeres módosítás!");
        fetchSeries();
        resetInput();
    }
    else {
        alert("Hiba a szerkesztés során!");
    }
}

// modal ablak beviteli mezőinek kiürítése
function resetInput() {
    document.getElementById('seriesName').value = null;
    document.getElementById('seriesSeason').value = null;
}

// keresés a termekek között
document.getElementById('searchingForm').onsubmit = async function (event) {
    event.preventDefault();

    const searching = event.target.elements.searching.value;

    const res = await fetch('/searching', {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ searching })
    });

    const airsoftok = await res.json();

    if (airsoftok.length === 0) {
        document.getElementById('series-list').innerHTML = '<h3 class="text-center m-4">Nincs találat</h3>';
    } else {
        seriesDrawing(airsoftok);
    }
}
// termekek kirajzoltatása
async function fetchSeries(userID) {
    const response = await fetch(`/termekUser/${userID}`);
    const airsoft = await response.json();
  
    seriesDrawing(airsoft, "Minden");
    stars(userID);
  }


function seriesDrawing(airsoft, name) {
    let starsHTML = "";
    let seriesHTML = '<h1 class="mt-2 mb-2">' + name + "</h1>";
    for (let termek of airsoft) {
      starsHTML = ""; // Reseteljük a starsHTML-t minden iteráció előtt
      if (termek.userRating !== 0) {
        const filledStars = parseInt(termek.userRating);
        for (let i = 1; i <= filledStars; i++) {
          starsHTML += `
                  <i id="star${i}" class="fa-solid fa-star text-warning" style="font-size: 20pt;"></i>
              `;
        }
        for (let i = filledStars + 1; i <= 5; i++) {
          starsHTML += `
                  <i id="star${i}" class="fa-regular fa-star text-warning" style="font-size: 20pt;"></i>
              `;
        }
      } else {
        // Ha nincs értékelés, akkor minden csillag fa-regular
        for (let i = 1; i <= 5; i++) {
          starsHTML += `
                  <i id="star${i}" class="fa-regular fa-star text-warning" style="font-size: 20pt;"></i>
              `;
        }
      }
  
      let counter = -1;
      const rating =
        termek.rating === 0
          ? "<h6>Még nincs értékelve</h6>"
          : `<span style="font-size: 20pt;">${termek.rating} \u2B50</span>`;
  
      seriesHTML += `
              <div class="col-xl-3 col-md-4 col-sm-6 my-2">
                  <div class="card bg-dark text-white my-2 h-100">
                      <div class="card-header" style="height: 200px;">
                          <img src="../images/${termek.image}" alt="${termek.name}" title="${termek.name}" class="img img-fluid img-thumbnail mx-auto d-block">
                      </div>
                      <div class="card-body text-center">
                          <h3>${termek.name}</h3>
                          <h5>${termek.price} Ft</h5>
                          <div>
                              ${rating}
                          </div>
                      </div>
                      <div class="card-footer text-center" id="${termek.termekID}">
                          ${starsHTML}
                      </div>
                      <hr>
                      <div class="row mt-2 text-center py-2">
                          <div class="col-sm-8">
  
                          </div>
                          <div class="card-footer">
                          <button class="btn btn-outline-danger me-2" onclick="deleteSeries(${termek.termekID})"><i class="fa-solid fa-trash"></i></button>
                          <button class="btn btn-warning" onclick="editTermek(${termek.termekID})"><i class="fa-solid fa-pen"></i></button>
                              <button type="button" class="btn btn-outline-light border-0 float-end" onclick="cart(${termek.termekID})">
                                  <i class="fa-solid fa-cart-shopping" style="font-size: 20pt;"></i>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
      counter++;
    }
    document.getElementById("series-list").innerHTML = seriesHTML;
  }

  // csillagok értékének kinyerése és az értékelés elküldése
function stars(userID) {
    const stars = document.querySelectorAll(".fa-star.text-warning");
    stars.forEach((star) => {
      star.addEventListener("mouseenter", function () {
        const index = parseInt(star.id.replace("star", ""));
        const stars = Array.from(star.parentElement.children);
        highlightStars(stars, index);
      });
    });
  
    const starsContainer = document.querySelectorAll(".card-footer");
  
    starsContainer.forEach((starsContainer) => {
      starsContainer.addEventListener("mouseleave", function () {
        const stars = Array.from(this.children);
        const selectedStarsCount = parseInt(this.dataset.selectedStarsCount);
        highlightStars(stars, selectedStarsCount);
      });
  
      const stars = starsContainer.querySelectorAll(".fa-star.text-warning");
      stars.forEach((star) => {
        star.addEventListener("click", async function () {
          const starId = star.id;
          const rating = parseInt(starId.replace("star", ""));
  
          const cardId = star.closest(".card-footer").id;
  
          const res = await fetch(`/rating/${cardId}/${userID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating }),
          });
  
          const datas = await res.json();
  
          if (datas.success) {
            fetchSeries(userID);
          }
        });
      });
    });
  }
  
  // a csillagok átalakítása és visszaalakítása attól függően, hogy hol áll az egérmutató
  function highlightStars(stars, index) {
    stars.forEach((star, i) => {
      if (i < index) {
        star.classList.remove("fa-regular");
        star.classList.add("fa-solid");
      } else {
        star.classList.remove("fa-solid");
        star.classList.add("fa-regular");
      }
    });
  }

  function redirectToadminFegyverek() {
    window.location.href = "/frontend/html/admin/adminfegyverek.html";
  }
  function redirectToadminFelszereles() {
    window.location.href = "/frontend/html/admin/adminfelszereles.html";
  }
  function redirectToadminKarbantartas() {
    window.location.href = "/frontend/html/admin/adminkarbantartas.html";
  }
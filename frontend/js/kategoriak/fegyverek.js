async function fetchSeries(userID) {
  const response = await fetch(`/Fegyver/${userID}`);
  console.log("Fegyverek...................... start2");
  console.log(response);
  const airsoft = await response.json();

  seriesDrawing(airsoft, "Fegyverek");
  stars(userID);
}

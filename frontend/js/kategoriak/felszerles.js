async function fetchSeries(userID) {
  const response = await fetch(`/Felszereles/${userID}`);
  console.log("Felszereles...................... start2");
  console.log(response);
  const airsoft = await response.json();

  seriesDrawing(airsoft, "Felszerelés");
  stars(userID);
}

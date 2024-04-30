async function fetchSeries(userID) {
  const response = await fetch(`/Karbantartas/${userID}`);
  console.log("Karbantarás...................... start2");
  console.log(response);
  const airsoft = await response.json();

  seriesDrawing(airsoft, "Karbantartás");
  stars(userID);
}

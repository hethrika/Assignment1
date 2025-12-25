function run() {
  const company = document.getElementById("company").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const source = document.getElementById("source").value;

  fetch("http://localhost:3000/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, start, end, source })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  });
}

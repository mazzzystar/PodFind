function executeSearch() {
  const searchInput = document.getElementById("search");
  const searchResultsDiv = document.getElementById("searchResults");
  const query = searchInput.value.trim().toLowerCase();

  const data = [
    "@Alex Adamov: GPT 4 is definitely another level. GPT 3 struggled with the spatial awareness of objects after changes. This one will find your keys in the near future!",
    "@Lord Victor: GPT-4 may be able to appear almost human in its speech but that will never change my opinion about speaking to objects.",
    "@Conor: I dumped a live Ethereum contract into GPT-4. In an instant, it highlighted a number of security vulnerabilities and pointed out surface areas where the contract could be exploited. It then verified a specific way I could exploit the contract",
    "@Fireship: GPT-4 just made coding tutorials obsolete\ncan handle 25K input words\nso feed it all official docs for some lib\nask for a \"step-by-step guide to build X\" \nwrites perfect tutorialfuck",
  ];

  const results = data.filter((item) => item.toLowerCase().includes(query));

  searchResultsDiv.innerHTML = "";

  if (results.length > 0) {
    results.forEach((result) => {
      const resultDiv = document.createElement("div");
      resultDiv.classList.add("mb-2");

      // Find the start and end indices of the matched text
      const startIndex = result.toLowerCase().indexOf(query);
      const endIndex = startIndex + query.length;

      // Split the result into three parts: before, matched, and after the query
      const beforeMatch = result.slice(0, startIndex);
      const match = result.slice(startIndex, endIndex);
      const afterMatch = result.slice(endIndex);

      // Create the highlighted matched text
      const mark = document.createElement("mark");
      mark.classList.add("highlight");
      mark.textContent = match;

      // Append the parts of the result to the resultDiv
      resultDiv.appendChild(document.createTextNode(beforeMatch));
      resultDiv.appendChild(mark);
      resultDiv.appendChild(document.createTextNode(afterMatch));

      searchResultsDiv.appendChild(resultDiv);
    });
  } else {
    searchResultsDiv.innerHTML = "No results found.";
  }
}

function setFancySentence(event) {
  const sentence = event.target.innerText;
  const searchInput = document.getElementById("search");
  searchInput.value = sentence;
}


async function executeSearch() {
  const searchInput = document.getElementById("search");
  const searchResultsDiv = document.getElementById("searchResults");
  const query = searchInput.value.trim().toLowerCase();

  const data = await fetchData(query);

  searchResultsDiv.innerHTML = "";

  if (data.length > 0) {
    data.forEach((episode) => {
      const episodeDiv = document.createElement("div");
      episodeDiv.classList.add("mb-6", "bg-white", "shadow-md", "rounded", "p-4", "flex", "items-start");

      const coverImage = document.createElement("img");
      coverImage.src = episode.artworkUrl600 || episode.artworkUrl100 || episode.artworkUrl60 || episode.artworkUrl30;
      coverImage.alt = `${episode.trackName} cover image`;
      coverImage.classList.add("w-20", "h-20", "mr-4");

      const contentDiv = document.createElement("div");

      const titleLink = document.createElement("a");
      titleLink.href = episode.collectionViewUrl;
      titleLink.target = "_blank";
      titleLink.classList.add("text-blue-600", "hover:text-blue-800");

      const title = document.createElement("h2");
      title.innerHTML = highlightMatches(episode.trackName, query);
      title.classList.add("text-lg", "font-bold", "mb-2");

      titleLink.appendChild(title);
      contentDiv.appendChild(titleLink);

      const artist = document.createElement("p");
      artist.textContent = `Producer: ${episode.collectionName}`;
      artist.classList.add("text-sm", "mb-2");

      const releaseDate = new Date(episode.releaseDate);
      const formattedDate = releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const date = document.createElement("p");
      date.textContent = `Date: ${formattedDate}`;
      date.classList.add("text-sm", "mb-2");

      const description = document.createElement("p");
      description.innerHTML = highlightMatches(linkTimestamps(episode.description), query);
      description.classList.add("text-sm");

      contentDiv.appendChild(artist);
      contentDiv.appendChild(date);
      contentDiv.appendChild(description);

      episodeDiv.appendChild(coverImage);
      episodeDiv.appendChild(contentDiv);

      searchResultsDiv.appendChild(episodeDiv);
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


async function fetchData(query) {
  const apiUrl = `https://itunes.apple.com/search?term=${query}&media=podcast&entity=podcastEpisode&limit=25`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results;
}


function highlightMatches(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  const highlightedText = text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
  return highlightedText;
}

function linkTimestamps(text) {
  const regex = /(\d{1,2}:\d{2}(:\d{2})?)/g;
  const linkedText = text.replace(regex, '<br><a href="#$1" class="text-blue-600 hover:text-blue-800">$1</a>');
  return linkedText;
}



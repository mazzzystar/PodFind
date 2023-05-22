let currentAudio = null;

function applyFilter(data) {
  const filterTimestamps = document.getElementById("filterTimestamps");
  const timestampRegex = /(\d{1,2}:\d{2}(:\d{2})?)/;

  if (filterTimestamps.checked) {
    data = data.filter((episode) => timestampRegex.test(episode.description));
  }

  return data;
}

async function executeSearch() {
  const searchButton = document.getElementById("searchButton");
  const searchButtonText = document.getElementById("searchButtonText");
  const searchButtonProgress = document.getElementById("searchButtonProgress");

  const searchInput = document.getElementById("search");
  const filterTimestamps = document.getElementById("filterTimestamps");
  const searchResultsDiv = document.getElementById("searchResults");
  const filterContainer = document.getElementById("filterContainer");
  const query = searchInput.value.trim().toLowerCase();

  // Log the search query to the server
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  const logMessage = `[${formattedDateTime}] User query: ${query}`;
  logToServer(logMessage);

  // Disable the button and show the progress indicator
  searchButton.disabled = true;
  searchButtonText.classList.add("hidden");
  searchButtonProgress.classList.remove("hidden");

  let data = await fetchData(query);

  // Sort episodes by releaseDate in descending order
  data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  // Apply the filter
  data = applyFilter(data);

  searchResultsDiv.innerHTML = "";

  // Check if there are no results when the Timestamp filter is on
  if (data.length === 0 && filterTimestamps.checked) {
    // Turn off the Timestamp filter and apply the filter again
    filterTimestamps.checked = false;
    data = applyFilter(await fetchData(query));
  }

  if (data.length > 0) {
    filterContainer.classList.remove("hidden");
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
      title.classList.add("text-lg", "font-bold", "mb-2", "overflow-wrap-anywhere");

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
      const truncatedDescriptionText = truncateBeforeTimestamp(episode.description, 4);
      description.innerHTML = highlightMatches(linkTimestamps(truncatedDescriptionText, episode.previewUrl), query);
      description.classList.add("text-sm", "overflow-wrap-anywhere");

      contentDiv.appendChild(artist);
      contentDiv.appendChild(date);
      contentDiv.appendChild(description);

      const transcribeButton = document.createElement("button");
      transcribeButton.textContent = "Transcribe";
      transcribeButton.classList.add("mt-2", "bg-black", "text-white", "px-3", "py-2", "rounded");
      transcribeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const existingTranscribeMessage = contentDiv.querySelector(".transcribe-message");
        if (!existingTranscribeMessage) {
          const transcribeMessage = document.createElement("p");

          // Set the transcribe message text content based on the user's default language
          const userLang = navigator.language || navigator.userLanguage;
          if (userLang.startsWith("zh")) {
            transcribeMessage.textContent = "(如果将来有钱租GPU)会用Whisper转录全文+时间轴🤔";
          } else {
            transcribeMessage.textContent = "Will add Whisper to transcribe full text(if can rent GPU🤔)";
          }

          transcribeMessage.classList.add("text-sm", "mt-2", "transcribe-message");
          contentDiv.appendChild(transcribeMessage);
        }
      });
      contentDiv.appendChild(transcribeButton);

      episodeDiv.appendChild(coverImage);
      episodeDiv.appendChild(contentDiv);

      searchResultsDiv.appendChild(episodeDiv);
    });
  } else {
    searchResultsDiv.innerHTML = "No results found.";
  }

  // Re-enable the button and hide the progress indicator
  searchButton.disabled = false;
  searchButtonText.classList.remove("hidden");
  searchButtonProgress.classList.add("hidden");

  // Add the event listener for the filterTimestamps checkbox
  filterTimestamps.removeEventListener("change", executeSearch);
  filterTimestamps.addEventListener("change", executeSearch);
}

function setFancySentence(event) {
  const sentence = event.target.innerText;
  const searchInput = document.getElementById("search");
  searchInput.value = sentence;
}


async function fetchData(query) {
  const apiUrl = `https://itunes.apple.com/search?term=${query}&media=podcast&entity=podcastEpisode&limit=100`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results;
}

function logToServer(message) {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error logging message to server');
        }
    })
    .catch(error => {
        console.error('Error logging message to server:', error);
    });
}


function highlightMatches(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  const highlightedText = text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
  return highlightedText;
}

function linkTimestamps(text, audioUrl) {
  const regex = /(\d{1,2}:\d{2}(:\d{2})?)/g;
  const linkedText = text.replace(regex, (match, timestamp) => {
    // Normalize timestamp format
    const normalizedTimestamp = normalizeTimestamp(timestamp);

    return `<br><a href="#" onclick="event.preventDefault(); playEpisodeAtTimestamp('${audioUrl}', '${normalizedTimestamp}');" class="text-blue-600 hover:text-blue-800">${normalizedTimestamp}</a>`;
  });
  return linkedText;
}

function normalizeTimestamp(timestamp) {
  const timeParts = timestamp.split(":");

  if (timeParts.length === 3) {
    const hours = String(timeParts[0]).padStart(2, "0");
    const minutes = String(timeParts[1]).padStart(2, "0");
    const seconds = String(timeParts[2]).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  } else if (timeParts.length === 2) {
    const minutes = String(timeParts[0]).padStart(2, "0");
    const seconds = String(timeParts[1]).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  return timestamp;
}

function truncateBeforeTimestamp(description, maxLines) {
  const regex = /(\d{1,2}:\d{2}(:\d{2})?)/;
  const lines = description.split('\n');
  let truncatedDescription = '';
  let lineCount = 0;
  let timestampFound = false;

  for (const line of lines) {
    if (regex.test(line)) {
      timestampFound = true;
    }

    if (!timestampFound) {
      if (lineCount < maxLines) {
        truncatedDescription += line + '\n';
        lineCount++;
      } else {
        truncatedDescription += '\n';
      }
    } else {
      truncatedDescription += line + '\n';
    }
  }

  return truncatedDescription.trim();
}

function playEpisodeAtTimestamp(audioUrl, timestamp) {
  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(audioUrl);
  const timeParts = timestamp.split(":");
  let seconds = 0;

  if (timeParts.length === 3) {
    seconds += parseInt(timeParts[0]) * 3600;
    seconds += parseInt(timeParts[1]) * 60;
    seconds += parseInt(timeParts[2]);
  } else if (timeParts.length === 2) {
    seconds += parseInt(timeParts[0]) * 60;
    seconds += parseInt(timeParts[1]);
  }

  currentAudio.currentTime = seconds;
  currentAudio.play();
}

// Add this code to the bottom of your JavaScript code
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function setTextLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const scrollTextDiv = document.querySelector(".scrollText");
    const h1Title = document.querySelector("h1");
    const aboutLink = document.querySelector("a[href$='about']");
    const pageTitle = document.querySelector("title");
    const footerText = document.querySelector("footer p.text-sm.text-gray-500");
    const timestampsOnlyText = document.getElementById("timestampsOnlyText");

    if (userLang.startsWith("zh")) {
        scrollTextDiv.innerHTML = `
            <p class="inline h-8 bg-blue-200 cursor-pointer mx-2" onclick="setFancySentence(event)">晚风说</p>
            <p class="inline h-8 bg-purple-100 cursor-pointer mx-2" onclick="setFancySentence(event)">数字游民</p>
            <p class="inline h-8 bg-yellow-200 cursor-pointer mx-2" onclick="setFancySentence(event)">漫长的季节</p>
            <p class="inline h-8 bg-red-200 cursor-pointer mx-2" onclick="setFancySentence(event)">塞尔达传说</p>
            <p class="inline h-8 bg-gray-100 cursor-pointer mx-2" onclick="setFancySentence(event)">戛纳</p>
        `;

        // Change the h1 title, About link text, and page title to Chinese
        h1Title.textContent = "Podcaster们怎么看...";
        aboutLink.textContent = "关于";
        pageTitle.textContent = "PodFind - 汇聚观点";
        footerText.textContent = "此项目中的每一行代码均由 GPT-4 生成。";
        timestampsOnlyText.textContent = "有时间戳";
    }
}

document.addEventListener("DOMContentLoaded", setTextLanguage);

// Wrap this code inside a window.onload event
window.onload = function () {
  document.getElementById("filterTimestamps").addEventListener("change", executeSearch);
};





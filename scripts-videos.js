const YOUTUBE_API_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
const CHANNEL_ID = "UCn8zNIfYAQNdrFRrr8oibKw"; // CNN Brasil

fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`)
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("video-container");
    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      container.innerHTML += `
        <div style="margin-bottom:20px">
          <iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          <p>${title}</p>
        </div>
      `;
    });
  });

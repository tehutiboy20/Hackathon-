const contents = document.getElementById("root");
const contentParent = contents.parentNode;
contents.remove();

//adding inspirational text
const inspirationalText = document.createElement("div");
inspirationalText.className = "beautText";
inspirationalText.textContent =
  "Here's an easy listening to manage your work flow";
contentParent.prepend(inspirationalText);

//fetch random anime image from waifu image
async function randomImg() {
  try {
    const response = await fetch("https://nekos.best/api/v2/waifu");
    if (!response.ok) throw new Error("failed to fetch data");
    return response.json();
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

//set the background image
async function setBakgroundImage() {
  try {
    const data = await randomImg();
    //extract the first image URL from the API response
    const imageUrl = data.results[0].url;

    //setting background
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } catch (error) {
    console.error("failed to set background image", error);
  }
}

//call the function
setBakgroundImage();


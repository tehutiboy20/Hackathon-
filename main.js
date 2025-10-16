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



// Document.body.innerHTML = "";

const contents = document.getElementById("root");
const contentParent = contents.parentNode;
// contents.parentNode.removeChild(contents);
contents.remove();

const inspirationalText = document.createElement("div");
inspirationalText.className = "beautText";
inspirationalText.innerHTML = "get back to achieving your coding dreams";
contentParent.prepend(inspirationalText);

const img = document.createElement("img");
img.src = "https://d2zp5xs5cp8zlg.cloudfront.net/image-86754-800.jpg";

contentParent.appendChild(img);

// const ebayContent = document.getElementById("mainContent");
// ebayContent.parentNode.removeChild(ebayContent);

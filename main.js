
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

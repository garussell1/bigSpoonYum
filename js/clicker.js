function toggleImage(beforeId, afterId) {
  var beforeImage = document.getElementById(beforeId);
  var afterImage = document.getElementById(afterId);
  
  if (beforeImage.style.display === "none") {
    beforeImage.style.display = "block";
    afterImage.style.display = "none";
  } else {
    beforeImage.style.display = "none";
    afterImage.style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const imageUpload = document.getElementById("imageUpload");
  const extractButton = document.getElementById("extractButton");
  const resultText = document.getElementById("result");
  let selectedFile = null;

  // Load Tesseract.js from CDN
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
  document.head.appendChild(script);

  imageUpload.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      const label = document.querySelector(".upload-area label");
      label.textContent = `Selected: ${selectedFile.name}`;
    }
  });

  extractButton.addEventListener("click", async () => {
    if (!selectedFile) {
      alert("Please select or drag an image first!");
      return;
    }

    if (typeof Tesseract === "undefined") {
      resultText.textContent = "OCR Engine is loading... Please try again.";
      return;
    }

    extractButton.disabled = true;
    extractButton.textContent = "Processing...";
    resultText.textContent = "Initializing engine...";

    try {
      const result = await Tesseract.recognize(selectedFile, "sat", {
        logger: (m) => {
          // This logs everything happening behind the scenes to your browser console
          console.log(m);

          if (
            m.status === "loading sat ocr engine" ||
            m.status === "loading language traineddata"
          ) {
            resultText.textContent = `Downloading Santali language pack...`;
          } else if (m.status === "recognizing text") {
            resultText.textContent = `Extracting text: ${Math.floor(m.progress * 100)}%`;
          }
        },
      });

      if (result.data.text.trim() === "") {
        resultText.textContent =
          "No text recognized. Try a clearer or higher contrast image.";
      } else {
        resultText.textContent = result.data.text;
      }
    } catch (error) {
      console.error(error);
      resultText.textContent =
        "An error occurred. Check your internet connection or browser console.";
    } finally {
      extractButton.disabled = false;
      extractButton.textContent = "Extract Text";
    }
  });
});

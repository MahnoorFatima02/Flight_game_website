document.addEventListener('DOMContentLoaded', function() {
    const paragraphs = document.querySelectorAll('.fade-in div');

    paragraphs.forEach((paragraph, index) => {
        setTimeout(() => {
            paragraph.classList.add('active');
        }, (index + 1) * 2000); // Adjust the transition duration (1s) and delay (1000ms) as needed
    });
});
function playSoundAndRedirect() {
    var audio = document.getElementById('buttonClickSound');
    var redirectUrl = "/loginpage"; // Replace with your desired URL

    // Play the sound
    audio.play();

    // Wait for the sound to finish playing (adjust the timeout duration as needed)
    setTimeout(function () {
      // Redirect to another page
      window.location.href = redirectUrl;
    }, audio.duration * 500); // Convert duration from seconds to milliseconds
  }

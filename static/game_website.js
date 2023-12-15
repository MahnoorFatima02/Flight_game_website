document.addEventListener('click', function () {
    var music = document.getElementById('backgroundMusic');
    music.muted = false;
    music.play();
  });
 function playSoundAndRedirect1() {
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
  function playSoundAndRedirect2() {
    var audio = document.getElementById('buttonClickSound');
    var redirectUrl = "/story"; // Replace with your desired URL

    // Play the sound
    audio.play();

    // Wait for the sound to finish playing (adjust the timeout duration as needed)
    setTimeout(function () {
      // Redirect to another page
      window.location.href = redirectUrl;
    }, audio.duration * 500); // Convert duration from seconds to milliseconds
  }
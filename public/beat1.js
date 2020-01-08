var isPlaying = false;
document.addEventListener('keydown', function (e) {
  if (e.keyCode == 9) {
    if (!isPlaying) {
      document.getElementById('69').play();
      isPlaying = true
    }
    else {
      document.getElementById('69').pause();
      isPlaying = false;
    }
  }
})
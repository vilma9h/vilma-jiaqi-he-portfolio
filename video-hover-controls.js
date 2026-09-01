(function () {
  document.querySelectorAll('video').forEach((video) => {
    video.controls = true;
    video.controlsList = 'nodownload noremoteplayback';
    video.disablePictureInPicture = true;
  });
})();

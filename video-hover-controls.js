(function () {
  const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent);
  document.querySelectorAll('video').forEach((video) => {
    video.controls = !isSafari;
    video.controlsList = 'nodownload noremoteplayback';
    video.disablePictureInPicture = true;
  });
})();

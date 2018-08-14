if (window.location.href.includes('reset')) {
  const confirmPw = document.getElementById('confirm');
  confirmPw.onpaste = function(e) {
    e.preventDefault();
  }
}

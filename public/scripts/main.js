// preventing user from copy pasting password in the confirm password field
if (window.location.href.includes('reset')) {
  const confirmPw = document.getElementById('confirm');
  confirmPw.onpaste = function(e) {
    e.preventDefault();
  }
}

// handling the search from the client side with AJAX
$('#campground-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/campgrounds?' + search, function(data) {
    $('#campground-grid').html('');
    data.forEach(function(campground) {
      $('#campground-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ campground.image }">
            <div class="caption">
              <h4>${ campground.name }</h4>
            </div>
            <p>
              <a href="/campgrounds/${ campground._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

// Activating popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})

// If campground name it too long, it gets shorten and a tooltip displays full name when hover over its name
const titles = document.querySelectorAll(".tool-short");
titles.forEach(title => {
  if (title.innerText.length > 17) {
    console.log(title);
    const newTitle = title.innerText.substring(0, 13) + '...';
    title.innerHTML = `<h5 class="card-title tool-short" data-toggle="tooltip" data-placement="right" title="${title.innerText}">${newTitle}</h5>`
  }
});

// Activating tooltip functionality
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Realtime e-mail validation
const inputMail = document.querySelector('.validMail');
inputMail.oninput = function() {
  if ( /(.+)@(.+){2,}\.(.+){2,}/.test(inputMail.value) ){
    // valid email
    inputMail.style.border = '1px solid #ced4da';
  } else {
    // invalid email
    inputMail.style.border = '1px solid red';
  }
}
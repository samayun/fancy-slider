const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  // alertModal(`${images.length} results found`,"Success","success",5000);

  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

async function getImages(query) {
  try {
    toggleSpinner();
    let data = await fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`).then(response => response.json());
    if (data.hits.length == 0) {
      alertModal(`There has no result for ${query}`, "No Result Found!","success");
      return;
    }
    showImages(data.hits);
    document.getElementById('resultsFound').innerHTML = `<strong class='text-primary'>${data.hits.length}</strong> results found for ${query}`

  } catch (error) {
    alertModal(error, "NETWORK Error", "success");
  }
  finally {
    toggleSpinner();
  }
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // element.classList.add('added');
  // I added
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // alert('Hey, Already added !');
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alertModal('Select at least 2 image.');
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  // If duration is negative input  
  let duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    duration = document.getElementById('duration').value = 1000;
  }

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

function handleSearch() {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  if (search.value == "") {
    alertModal("Please Input Something");
    return;
  }
  getImages(search.value);
  search.value = ""
  sliders.length = 0;
};

// EVENT LISTENER 
searchBtn.addEventListener('click', handleSearch);

document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == "Enter") {
    handleSearch();
  }
});
sliderBtn.addEventListener('click', createSlider);

// UI Components 
function openModal(text, name, type) {
  let alertModalEl = document.createElement('div');
  alertModalEl.className = "modal";
  alertModalEl.setAttribute('id', 'alertModal');
  alertModalEl.style.display = "block";

  let alert = `<div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title"> ${name} </h4>
            <button type="button" class="close btn btn-${type}" data-dismiss="modal" onclick='closeModal()'>&times;</button>
          </div>
          <div class="modal-body">
            ${text}
          </div>          
          <div class="modal-footer">
            <button type="button" class="btn btn-${type}" onclick='closeModal()' data-dismiss="modal">Close</button>
          </div>
          
        </div>
      </div>`;
  alertModalEl.innerHTML = alert;
  document.body.appendChild(alertModalEl);
}

function closeModal() {
  document.getElementById('alertModal') ? document.getElementById('alertModal').remove() : "";
}

function alertModal(text, name = "Alert", type = "danger",duration = 300000) {
  openModal(text, name , type);
  setTimeout(() => {
    closeModal();
  }, duration);
}

function toggleSpinner() {
  document.getElementById('loading').classList.toggle('d-none');
}
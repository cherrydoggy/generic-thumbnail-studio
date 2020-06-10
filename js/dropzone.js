const makeMoveable = el => {
  var moveable = new Moveable(document.body, {
    target: el,
    container: document.body,
    draggable: true,
    resizable: true,
    scalable: true,
    rotatable: true,
    origin: true,
    edge: false,
  });

  moveable.on("drag", ({ target, left, top }) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
  })

  moveable.on("resize", ({ target, width, height, drag }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
  })

  moveable.on("scale", ({ target, transform }) => {
    target.style.transform = transform;
  })

  moveable.on("rotate", ({ target, transform }) => {
    target.style.transform = transform;
  })
}

const newMoveableImage = (dataURI) => {
  var outerEl = document.createElement('div')
  var innerEl = document.createElement('div')

  innerEl.style['background-image'] = 'url('+dataURI+')'
  innerEl.classList.add('moveable-image-inner')
  //outerEl.classList.add('moveable-image-outer')
  outerEl.id = 'moveable' // for some weird weird reason an id works but class doesn't
  outerEl.appendChild(innerEl)
  document.querySelector('#thumbnail-outer').appendChild(outerEl)
  makeMoveable(outerEl)
}

const dropzone = document.getElementById('dropzone')
function allowDrag(e) {
  e.dataTransfer.dropEffect = 'copy';
  e.preventDefault();
}

const mountFiles = (files, callback = () => null) => {
  var i = 0;
  var target = Array.from(files).length

  var fileReader = new FileReader()
  for (var file of files) fileReader.readAsDataURL(file)

  fileReader.onload = function(event) {
    newMoveableImage(event.target.result)
    console.log(event.target.result);
    i++;
    if (i === target) callback();
  };
}

function handleDrop(e) {
  e.preventDefault();
  dropzone.classList.remove('active')
  var fileReader = new FileReader();
  mountFiles(e.dataTransfer.files)
}

window.addEventListener('dragenter', e => {
  if (e.dataTransfer.types.includes('Files'))
    dropzone.classList.add('active')
})

dropzone.addEventListener('dragenter', allowDrag);
dropzone.addEventListener('dragover', allowDrag);

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('active')
})

dropzone.addEventListener('drop', handleDrop);

// @todo fist resize not working properly when resizing upwarsd (this is a hint code that wilol help you solve htis porblem)

var uploadedPicture = document.getElementById('uploaded-picture')
uploadedPicture.addEventListener('change', e => {
  mountFiles(e.target.files, () => {
    uploadedPicture.value = "";
  })
})
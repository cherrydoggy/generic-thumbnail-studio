const downloadElPicture = el => {
  for (var div of Array.from(document.querySelectorAll('.moveable-control-box'))) {
    div.style.display = 'none';
  }

  html2canvas(el).then(canvas => {
    var uri = canvas.toDataURL('png')
    var a = document.createElement('a')
    a.href = "data:" + uri;
    a.download = "thumbnail.png";
    a.click();

    for (var div of Array.from(document.querySelectorAll('.moveable-control-box'))) {
      div.style.display = 'block';
    }
  }, {
    foreignObjectRendering: true,
    useCORS: true,
    allowTaint: true
  });
}

document.querySelector('#download-button').addEventListener('click', e => {
  downloadElPicture(document.querySelector('#thumbnail-outer'))
})

document.querySelector('#clear-storage-button').addEventListener('click', e => {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    for (var resetter of valueResetters) resetter()
  }
})

var valueResetters = [];

const createTwoWayBind = (obj) => {
  if (obj.name === undefined || obj.defaultValue === undefined || obj.handleParentValueUpdate === undefined || obj.handleChildValueUpdate === undefined || obj.listenForChildValueUpdate === undefined || obj.listenForParentValueUpdate === undefined)
    throw new Error("Object doesn't have all required properties")
  
  valueResetters.push(() => {
    handleParentValueUpdate(obj.defaultValue)
    handleChildValueUpdate(obj.defaultValue)
  })

  // Initialize value
  var value = localStorage.getItem(obj.name)

  if (value === null) {
    localStorage.setItem(obj.name, obj.defaultValue)
    value = obj.defaultValue
  }

  var handleParentValueUpdate = val => {
    localStorage.setItem(obj.name, val)
    obj.handleParentValueUpdate(val)
  }

  var handleChildValueUpdate = val => {
    localStorage.setItem(obj.name, val)
    obj.handleChildValueUpdate(val)
  }

  obj.listenForParentValueUpdate(handleParentValueUpdate)
  obj.listenForChildValueUpdate(handleChildValueUpdate)

  // Handle initialized value
  handleParentValueUpdate(value)
  handleChildValueUpdate(value)
}

const createTwoWayStyleInputBind = (name, styleElement, inputElement, defaultValue) => {
  createTwoWayBind({
    name: name,
    defaultValue: defaultValue,
    handleParentValueUpdate: val => styleElement.setAttribute('style', val),
    handleChildValueUpdate: val => { if (!document.hasFocus() || document.activeElement !== inputElement) inputElement.value = val.replace(/;(?=[^\n])/g, ';\n') },
    listenForChildValueUpdate: handleChildValueUpdate => setInterval(() => {
      handleChildValueUpdate(styleElement.attributes.style.value)
    }, 1000),
    listenForParentValueUpdate: handleParentValueUpdate => inputElement.addEventListener('keyup', e => handleParentValueUpdate(e.target.value))
  })
}

createTwoWayStyleInputBind('thumbnail-inner-style', document.querySelector('#thumbnail-inner'), document.querySelector('#thumbnail-inner-style-input'),
`color: #ff336b;
font-size: 100px;
font-family: 'Luckiest Guy', cursive;
text-align: left;
line-height: 1;
letter-spacing: 1;
padding: 26px;
border: 45px solid #d01c1c;
--outline-color: black;
--outline-thickness: 5px;`)

createTwoWayStyleInputBind('thumbnail-outer-style', document.querySelector('#thumbnail-outer'), document.querySelector('#thumbnail-outer-style-input'),
`padding: 45px;
background-color: #000;`)

createTwoWayStyleInputBind('thumbnail-overlay-style', document.querySelector('#thumbnail-overlay'), document.querySelector('#thumbnail-overlay-style-input'),
`border: 45px solid #000000;`)

createTwoWayBind({
  name: 'thumbnail-text',
  defaultValue: `Thumbnail
generated by
[color=white]Generic Thumbnail [br]Studio[/color] using
[color=red]Javascript & CSS3[/color]`,
  handleParentValueUpdate: val => document.querySelector('#thumbnail-inner').innerHTML = bbcode.parse(val),
  handleChildValueUpdate: val => document.querySelector('#thumbnail-text-input').value = val,
  listenForChildValueUpdate: handleChildValueUpdate => null,
  listenForParentValueUpdate: handleParentValueUpdate => document.querySelector('#thumbnail-text-input').addEventListener('keyup', e => handleParentValueUpdate(e.target.value))
})
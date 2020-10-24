function range(int) {
  const arr = [];
  for (let i = 0; i < int; i += 1) {
    arr.push(i);
  }
  return arr;
}

function sortFunction(x, y, key) {
  if (x[key] < y[key]) {
    return -1;
  } if (x[key] > y[key]) {
    return 1;
  }
  return 0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function map(s1, s2) {
  return (`${s1} ${s2}`);
}

document.body.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((fromServer) => {
      if (document.querySelector('.flex-inner')) {
        document.querySelector('.flex-inner').remove();
      }
      const arr10 = range(10);
      const arr = arr10.map(() => {
        const number = getRandomInt(243);
        return fromServer[number];
      });
      const reverselist = arr.sort((a, b) => sortFunction(b, a, 'name'));
      const ol = document.createElement('ol');
      ol.className = 'flex-inner';
      $('form').append(ol);

      reverselist.forEach((element, i) => {
        const li = document.createElement('li');
        $(li).append(`<input type = "checkbox" value =${element.code} id = ${element.code} />`);
        $(li).append(`<label for = ${element.code}> ${element.name}</label>`);
        $(ol).append(li);
      });
      console.log(arr);
      console.log('Test');
    })
    .catch((err) => console.log(err));
});
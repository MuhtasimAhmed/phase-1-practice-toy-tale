let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
     addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      });
  }

  function renderToy(toy) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }
  fetchToys()
  const toyForm = document.querySelector('.add-toy-form');

  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const image = formData.get('image');
    
    const newToyData = {
      name,
      image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToyData)
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      toyForm.reset();
    })
  })
  toyCollection.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.id;
      const card = event.target.closest('.card');
      const likeElement = card.querySelector('p');
      console.log(parseInt(likeElement.textContent))

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: parseInt(likeElement.textContent) + 1
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        likeElement.textContent = `${updatedToy.likes} Likes`;
      });
    }
  });
})
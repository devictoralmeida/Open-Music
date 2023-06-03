function renderFilterButtons(array) {
  const div = document.querySelector(
    ".filter-section__gender-buttons-container"
  );
  const lastFilter = localStorage.getItem("lastFilterClicked");

  array.map((product) => {
    product.category = categories[product.category];
  });

  categories.forEach((item) => {
    const button = document.createElement("button");
    button.classList.add("filter-section__button");
    button.innerText = item;
    div.append(button);
  });

  const buttons = document.querySelectorAll(".filter-section__button");

  buttons.forEach((button) => {
    if (button.innerText === lastFilter) {
      button.classList.add("button__selected");
    }
  });

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const element = event.target;

      buttons.forEach((activeButton) => {
        if (activeButton.classList.contains("button__selected")) {
          activeButton.classList.remove("button__selected");
        }
      });

      if (element.innerText !== "Todos") {
        localStorage.setItem("lastFilterClicked", element.innerText);
      } else {
        localStorage.removeItem("lastFilterClicked");
        localStorage.removeItem("filter-value");
      }

      element.classList.add("button__selected");
    });
  });

  filterAlbum(products);
}

function checkingPreferences() {
  const body = document.querySelector("body");
  const img = document.querySelector(".theme-image");
  const input = document.querySelector(".filter-price__input");
  const maxValue = document.querySelector(".filter-price__price");
  const valuePreference = JSON.parse(localStorage.getItem("filter-value"));
  let color;

  if (valuePreference) {
    input.value = valuePreference;
    maxValue.innerText = `Até R$ ${input.value}`;
  }

  const backgroundPercent =
    ((input.value - input.min) / (input.max - input.min)) * 100;

  if (localStorage.getItem("theme") == "dark-mode") {
    body.classList.add("dark");
    img.src = "./src/assets/img/sun.svg";
    color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(33, 37, 41) ${backgroundPercent}%)`;
  } else {
    body.classList.remove("dark");
    img.src = "./src/assets/img/moon.svg";
    color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(206, 212, 218) ${backgroundPercent}%)`;
  }

  input.style.background = color;

  toggleTheme();
}

function toggleTheme() {
  const body = document.querySelector("body");
  const div = document.querySelector(".theme__container");
  const img = document.querySelector(".theme-image");
  let theme;

  div.addEventListener("click", () => {
    if (!body.classList.contains("dark")) {
      body.classList.add("dark");
      img.src = "./src/assets/img/sun.svg";
      theme = "dark-mode";
      localStorage.setItem("theme", theme);
    } else {
      body.classList.remove("dark");
      img.src = "./src/assets/img/moon.svg";
      theme = "white-mode";
      localStorage.setItem("theme", theme);
    }
  });
}

function renderAlbums(array) {
  const container = document.querySelector(".albuns__list");
  container.innerHTML = "";

  array.forEach((product) => {
    const card = createCard(product);
    container.append(card);
  });
}

function renderAlbumsPreference(array) {
  const container = document.querySelector(".albuns__list");
  const valuePreference = JSON.parse(localStorage.getItem("filter-value"));
  const lastFilterClicked = localStorage.getItem("lastFilterClicked");
  const body = document.querySelector("body");
  const input = document.querySelector(".filter-price__input");
  const maxValue = document.querySelector(".filter-price__price");
  const notFound = document.querySelector(".not-found__container");

  if (!valuePreference && !lastFilterClicked) {
    filterValue(products);
  }

  if (valuePreference && !lastFilterClicked) {
    container.innerHTML = "";
    let filteredProducts = array.filter((item) => {
      return item.price <= valuePreference;
    });

    filteredProducts.forEach((product) => {
      const card = createCard(product);
      container.append(card);
    });

    filterValue(filteredProducts);
  } else if (!valuePreference && lastFilterClicked) {
    container.innerHTML = "";
    let filteredProducts = array.filter((item) => {
      return item.category == lastFilterClicked;
    });

    filteredProducts.forEach((product) => {
      const card = createCard(product);
      container.append(card);
    });

    filterValue(filteredProducts);
  } else if (valuePreference && lastFilterClicked) {
    container.innerHTML = "";
    let filteredProducts = array.filter((item) => {
      return (
        item.price <= valuePreference && item.category == lastFilterClicked
      );
    });

    if (filteredProducts.length >= 1) {
      notFound.classList.remove("show");
      container.innerHTML = "";
      filteredProducts.forEach((product) => {
        const card = createCard(product);
        container.append(card);
      });

      filterValue(filteredProducts);
    } else {
      container.innerHTML = "";
      notFound.classList.add("show");
      input.value = 0;
      maxValue.innerText = `Até R$ 0`;

      if (body.classList.contains("dark")) {
        color = `rgb(33, 37, 41)`;
      } else {
        color = `rgb(206, 212, 218)`;
      }

      input.style.background = color;
    }
  }
}

function createCard(item) {
  const li = document.createElement("li");
  li.classList.add("album__card");
  const figure = document.createElement("figure");
  figure.classList.add("album__photo");

  const img = document.createElement("img");
  img.src = item.img;
  img.alt = `Capa do álbum ${item.title}`;
  figure.append(img);

  const albumData = document.createElement("div");
  albumData.classList.add("album__data");

  const albumTagsContainer = document.createElement("div");
  albumTagsContainer.classList.add("album-tags__container");

  const band = document.createElement("span");
  band.innerText = item.band;
  const albumYear = document.createElement("span");
  albumYear.innerText = item.year;
  albumTagsContainer.append(band, albumYear);

  const albumTitle = document.createElement("h2");
  albumTitle.classList.add("album-card__title");
  albumTitle.innerText = item.title;

  const albumPriceContainer = document.createElement("div");
  albumPriceContainer.classList.add("album-card__mini-container");

  const price = document.createElement("h2");
  price.classList.add("album-card__price");
  price.innerText = `R$ ${item.price}`;

  const button = document.createElement("button");
  button.classList.add("album-card__button");
  button.innerText = "Comprar";

  albumData.append(albumTagsContainer, albumTitle, albumPriceContainer);
  albumPriceContainer.append(price, button);
  li.append(figure, albumData);
  return li;
}

function filterAlbum(array) {
  const buttons = document.querySelectorAll(".filter-section__button");
  const body = document.querySelector("body");
  const input = document.querySelector(".filter-price__input");
  const maxValue = document.querySelector(".filter-price__price");
  const notFound = document.querySelector(".not-found__container");
  const container = document.querySelector(".albuns__list");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let color;

      if (button.innerText == "Todos") {
        renderAlbums(products);
        filterValue(products);
      } else if (button.innerText !== "Todos") {
        const filteredProducts = array.filter((item) => {
          return item.category == button.innerText;
        });

        if (filteredProducts.length == 0) {
          container.innerHTML = "";
          notFound.classList.add("show");
          input.value = 0;
          input.setAttribute("max", input.value);
          localStorage.setItem("filter-value", JSON.stringify(0));
          maxValue.innerText = `Até R$ 0`;

          if (body.classList.contains("dark")) {
            color = `rgb(33, 37, 41)`;
          } else {
            color = `rgb(206, 212, 218)`;
          }

          input.style.background = color;
        } else {
          notFound.classList.remove("show");
          renderAlbums(filteredProducts);
          filterValue(filteredProducts);
        }
      }
    });
  });
}

function filterValue(array) {
  const input = document.querySelector(".filter-price__input");
  const maxValue = document.querySelector(".filter-price__price");
  const body = document.querySelector("body");
  let color;
  const lastFilterClicked = localStorage.getItem("lastFilterClicked");
  const notFound = document.querySelector(".not-found__container");

  if (array.length == 1) {
    input.setAttribute("max", array[0].price);

    input.value = array[0].price;

    maxValue.innerText = `Até R$ ${array[0].price}`;

    localStorage.setItem("filter-value", JSON.stringify(array[0].price));

    if (body.classList.contains("dark")) {
      color = `rgb(33, 37, 41)`;
    } else {
      color = `rgb(206, 212, 218)`;
    }
    input.style.background = color;
  }

  const newArray = array.sort((b, a) => {
    return a - b;
  });

  const length = newArray.length;
  const lastElement = length - 1;
  input.setAttribute("max", newArray[0].price);
  input.setAttribute("min", newArray[lastElement].price);

  const max = +input.getAttribute("max");

  input.value = max;

  maxValue.innerText = `Até R$ ${newArray[0].price}`;

  localStorage.setItem("filter-value", JSON.stringify(newArray[0].price));

  const backgroundPercent =
    ((input.value - input.min) / (input.max - input.min)) * 100;

  if (body.classList.contains("dark")) {
    color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(33, 37, 41) ${backgroundPercent}%)`;
  } else {
    color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(206, 212, 218) ${backgroundPercent}%)`;
  }

  input.style.background = color;

  input.addEventListener("input", () => {
    const container = document.querySelector(".albuns__list");
    const valueJSON = JSON.stringify(input.value);
    const backgroundPercent =
      ((input.value - input.min) / (input.max - input.min)) * 100;
    maxValue.innerText = `Até R$ ${input.value}`;

    let color;

    if (body.classList.contains("dark")) {
      color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(33, 37, 41) ${backgroundPercent}%)`;
    } else {
      color = `linear-gradient(90deg, rgb(151, 71, 255) ${backgroundPercent}%, rgb(206, 212, 218) ${backgroundPercent}%)`;
    }

    input.style.background = color;

    if (lastFilterClicked) {
      const filteredProducts = array.filter((item) => {
        return item.price <= input.value && item.category == lastFilterClicked;
      });

      if (filteredProducts.length >= 1) {
        renderAlbums(filteredProducts);
        notFound.classList.remove("show");
      } else {
        container.innerHTML = "";
        notFound.classList.add("show");
      }
    } else {
      const filteredProducts = products.filter((item) => {
        return item.price <= input.value;
      });

      if (filteredProducts.length >= 1) {
        renderAlbums(filteredProducts);
        notFound.classList.remove("show");
      } else {
        container.innerHTML = "";
        notFound.classList.add("show");
        localStorage.setItem("filter-value", JSON.stringify(0));
      }
    }

    localStorage.setItem("filter-value", valueJSON);
  });
}

renderFilterButtons(products);
renderAlbums(products);
checkingPreferences();
renderAlbumsPreference(products);

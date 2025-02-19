import { Product } from "../../utils/types";
import { createProductCard } from "../../component/Card";
import { createHeader } from '../../component/Header';

document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.getElementById("main-container");
  if (mainContainer) {
    const header = createHeader();
    mainContainer.prepend(header);

    const productContainer = document.createElement("div");
    productContainer.id = "product-container";
    mainContainer.appendChild(productContainer);

    const similarProductsContainer = document.createElement("div");
    similarProductsContainer.id = "similar-products-container";
    similarProductsContainer.classList.add("similar-products-section");

    const similarProductsTitle = document.createElement("h2");
    similarProductsTitle.classList.add("similarProductsTitle");
    similarProductsTitle.textContent = "Похожие товары";
    similarProductsContainer.appendChild(similarProductsTitle);

    mainContainer.appendChild(similarProductsContainer);

    loadProduct(productContainer);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.getElementById("info-product");
  if (mainContainer) {
    const productContainer = createProductContainer();
    mainContainer.appendChild(productContainer);
    loadProduct(productContainer);
  }
});

function createProductContainer(): HTMLElement {
  const productContainer = document.createElement("div");
  productContainer.id = "product-container";
  return productContainer;
}

function createProductElement(product: Product): HTMLElement {
  const productElement = document.createElement("div");
  const productGallery = document.createElement("div");
  const productThumbnails = document.createElement("div");
  const productMainImageContainer = document.createElement("div");
  const productMainImage = document.createElement("img");
  const productInfo = document.createElement("div");
  const productTitle = document.createElement("h1");
  const productPrice = document.createElement("div");
  const currentPrice = document.createElement("span");
  const oldPrice = document.createElement("span");
  const buttonGroup = document.createElement("div");
  const addToCartButton = document.createElement("button");
  const addToFavoritesButton = document.createElement("button");

  const counter = document.createElement("div");
  const minus = document.createElement("span");
  const amount = document.createElement("span");
  const plus = document.createElement("span");

  let count = 1;

  productElement.classList.add("product");
  productGallery.classList.add("product-gallery");
  productThumbnails.classList.add("product-thumbnails");
  productMainImageContainer.classList.add("product-main-image");
  productMainImage.classList.add("main-image");
  productInfo.classList.add("product-info");
  productTitle.classList.add("product-title-two");
  productPrice.classList.add("product-price");
  currentPrice.classList.add("current-price");
  oldPrice.classList.add("old-price-right");
  buttonGroup.classList.add("button-group");
  addToCartButton.classList.add("add-to-cart");
  addToFavoritesButton.classList.add("add-to-favorites");
  counter.classList.add("counter");
  minus.classList.add("minus");
  amount.classList.add("amount");
  plus.classList.add("plus");

  productTitle.textContent = product.title;
  currentPrice.textContent = `${product.price} Руб`;
  addToCartButton.textContent = "Добавить в корзину";
  addToFavoritesButton.textContent = "Добавить в избранное";
  amount.textContent = count.toString();
  minus.textContent = "-";
  plus.textContent = "+";

  if (product.salePercentage) {
    const discount = product.price * (product.salePercentage / 100);
    const calculatedOldPrice = product.price + discount;
    oldPrice.textContent = `${Math.round(calculatedOldPrice)} Руб`;
  }

  const updatePrice = () => {
    amount.textContent = count.toString();
    currentPrice.textContent = `${(product.price * count).toFixed()} Руб`;
    oldPrice.textContent = product.salePercentage
      ? `${(Math.round((product.price + product.price * (product.salePercentage / 100)) * count))} Руб`
      : "";
  };

  minus.addEventListener("click", () => {
    if (count > 1) {
      count--;
      updatePrice();
    }
  });

  plus.addEventListener("click", () => {
    if (count < 35) {
      count++;
      updatePrice();
    }
  });

  counter.appendChild(minus);
  counter.appendChild(amount);
  counter.appendChild(plus);

  const productShortDescription = document.createElement("p");
  productShortDescription.textContent = product.description || "Описание отсутствует";
  productShortDescription.classList.add("short-description");

  productInfo.appendChild(productTitle);
  productPrice.appendChild(currentPrice);
  productPrice.appendChild(oldPrice);
  productInfo.appendChild(productPrice);
  productInfo.appendChild(counter);
  productInfo.appendChild(productShortDescription);
  buttonGroup.appendChild(addToCartButton);
  buttonGroup.appendChild(addToFavoritesButton);
  productInfo.appendChild(buttonGroup);

  productMainImage.src = product.media[0] || "https://via.placeholder.com/300";
  productMainImage.alt = product.title;
  productMainImageContainer.appendChild(productMainImage);

  product.media.forEach((img, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = img;
    thumbnail.alt = `Thumbnail ${index + 1}`;
    thumbnail.classList.add("thumbnail");

    if (index === 0) {
      thumbnail.classList.add("active");
    }

    thumbnail.addEventListener("click", () => {
      const activeThumbnail = productThumbnails.querySelector(".thumbnail.active");
      if (activeThumbnail) activeThumbnail.classList.remove("active");

      thumbnail.classList.add("active");
      productMainImage.src = img;
    });

    productThumbnails.appendChild(thumbnail);
  });

  productGallery.appendChild(productThumbnails);
  productGallery.appendChild(productMainImageContainer);

  productElement.appendChild(productGallery);
  productElement.appendChild(productInfo);

  addToFavoritesButton.addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorite = favorites.some((fav: Product) => fav.id === product.id);

    if (!isFavorite) {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      addToFavoritesButton.classList.add("active");
    } else {
      alert("Этот товар уже в избранном.");
    }
  });

  addToCartButton.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += count;
    } else {
      cart.push({ ...product, quantity: count });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Товар добавлен в корзину!");
  });


  return productElement;
}

function renderProduct(product: Product, container: HTMLElement, allProducts: Product[]): void {
  container.innerHTML = '';
  const productElement = createProductElement(product);
  container.appendChild(productElement);
  loadSimilarProducts(product.type, allProducts);
  createDescriptionSection(product);
}

function loadProduct(container: HTMLElement): void {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId && !isNaN(parseInt(productId))) {
    fetch('/db.json')
      .then(response => response.json())
      .then((data) => {
        console.log('Данные из db.json:', data);
        console.log('Ищем продукт с ID:', productId);

        const product = data.goods.find((item: { id: string; }) => item.id === productId);
        console.log('Найденный продукт:', product);

        if (product) {
          document.title = product.title;
          renderProduct(product, container, data.goods);
        } else {
          container.textContent = "Продукт не найден.";
        }
      })
      .catch(error => {
        console.error('Ошибка загрузки данных:', error);
      });

  } else {
    container.textContent = "Некорректный ID продукта.";
  }
}

function createDescriptionSection(product: Product): void {
  const descriptionSection = document.createElement("div");
  const descriptionTitle = document.createElement("h2");

  descriptionSection.classList.add("product-description-section");
  descriptionTitle.classList.add("descriptionTitle")

  descriptionTitle.textContent = "Описание товара";

  const productDescription = document.createElement("p");
  productDescription.classList.add("productDescription")
  productDescription.textContent = product.description || "Описание товара отсутствует";

  descriptionSection.appendChild(descriptionTitle);
  descriptionSection.appendChild(productDescription);

  const mainContainer = document.getElementById("main-container");
  if (mainContainer) {
    const productContainer = document.getElementById("product-container");
    if (productContainer) {
      mainContainer.insertBefore(descriptionSection, productContainer.nextSibling);
    }
  }
}

function loadSimilarProducts(type: string, allProducts: Product[]): void {
  const container = document.getElementById("similar-products-container");
  const mainContainer = document.getElementById("main-container");

  if (container && mainContainer) {
    container.innerHTML = '';

    let titleElement = document.getElementById("similar-products-title");
    if (!titleElement) {
      titleElement = document.createElement("h2");
      titleElement.id = "similar-products-title";
      titleElement.classList.add("similarProductsTitle");
      titleElement.textContent = "Похожие товары";

      mainContainer.insertBefore(titleElement, container);
    }

    const similarProducts = allProducts.filter(product => product.type === type).slice(0, 5);

    similarProducts.forEach(product => {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    });
  }
}

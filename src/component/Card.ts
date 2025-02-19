import { Product } from "../utils/types";

export function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("a");
  const imageContainer = document.createElement("div");
  const image = document.createElement("img");
  const heartIcon = document.createElement("div");
  const title = document.createElement("h2");
  const priceContainer = document.createElement("div");
  const oldPrice = document.createElement("p");
  const newPrice = document.createElement("p");
  const cartIcon = document.createElement("div");
  const ratingContainer = document.createElement("div");
  const starIcon = document.createElement("span");
  const rating = document.createElement("p");

  card.className = "product-card";
  card.href = `/src/Pages/ProductInfo/ProductInfo.html?id=${product.id}`;
  card.target = "_self";

  imageContainer.className = "product-image-container";
  image.src = product.media[0] || "https://via.placeholder.com/150";
  image.alt = product.title;
  image.className = "product-image";

  heartIcon.className = "heart-icon";
  heartIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path class="heart-path" fill="none" stroke="white" stroke-width="2" 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `;

  let favorites: Product[] = JSON.parse(localStorage.getItem("favorites") || "[]");
  const isFavorite = favorites.some((item) => item.id === product.id);
  heartIcon.className = `heart-icon ${isFavorite ? 'favorite' : ''}`;

  heartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    let favorites: Product[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favorites.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      favorites.splice(index, 1);
      heartIcon.classList.remove('favorite');
    } else {
      favorites.push(product);
      heartIcon.classList.add('favorite');
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });

  title.className = "product-title";
  title.textContent = product.title;

  priceContainer.className = "price-container";
  const discount = product.price * (product.salePercentage / 100);
  const oldPriceValue = (product.price + discount).toFixed(2);
  oldPrice.className = "old-price";
  oldPrice.textContent = `${oldPriceValue} Руб`;

  const finalPrice = product.isBlackFriday ? (product.price - discount).toFixed(2) : product.price.toFixed(2);
  newPrice.className = "product-price";
  newPrice.textContent = `${finalPrice} Руб`;

  cartIcon.className = "cart-icon";
  cartIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6h16l-2 10H6L4 6z"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>
      <path d="M6 6L5 3h2l1 3"/>
      <path d="M18 6L19 3h-2l-1 3"/>
    </svg>
  `;

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
  });

  ratingContainer.className = "product-rating-container";
  starIcon.className = "star-icon";
  starIcon.innerHTML = "&#9733;";
  rating.className = "product-rating";
  rating.textContent = `Рейтинг ${product.rating}`;

  imageContainer.append(heartIcon, image);
  priceContainer.append(oldPrice, newPrice, cartIcon);
  ratingContainer.append(starIcon, rating);
  card.append(imageContainer, title, ratingContainer, priceContainer);

  return card;
}

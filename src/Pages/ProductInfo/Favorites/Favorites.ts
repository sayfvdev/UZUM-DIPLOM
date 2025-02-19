import { Product } from "../../../utils/types";
import { createProductCard } from "../../../component/Card";
import { createHeader } from "../../../component/Header";

document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        const header = createHeader();
        mainContainer.prepend(header);
    }

    const favoritesTitle = document.createElement("h1");
    favoritesTitle.textContent = "Избранное";
    favoritesTitle.className = "favorites-title";

    const favoritesContainer: HTMLElement | null = document.getElementById("favorites-container");
    if (!favoritesContainer) {
        throw new Error("Контейнер для избранных товаров не найден!");
    }

    if (favoritesContainer.parentNode) {
        favoritesContainer.parentNode.insertBefore(favoritesTitle, favoritesContainer);
    }

    const updateFavorites = () => {
        const favorites: Product[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        favoritesContainer.innerHTML = "";

        if (favorites.length === 0) {
            const emptyImage = document.createElement("img");
            emptyImage.src = "/img/FAVORITES.png";
            emptyImage.alt = "Нет избранных товаров";
            emptyImage.className = "empty-favorites-image";

            const emptyImageContainer = document.createElement("div");
            emptyImageContainer.className = "empty-favorites-container";
            emptyImageContainer.appendChild(emptyImage);

            favoritesContainer.appendChild(emptyImageContainer);
        } else {
            const rowContainer = document.createElement("div");
            rowContainer.className = "favorites-row-container";

            favorites.forEach((product: Product, _index) => {
                const productCard = createProductCard(product);

                // Ищем сердечко в карточке товара
                const heartIcon = productCard.querySelector(".heart-icon");
                if (heartIcon) {
                    // Проверяем, является ли товар избранным
                    const isFavorite = favorites.some((item) => item.id === product.id);
                    if (isFavorite) {
                        heartIcon.classList.add("favorite");
                    }

                    // Удаляем товар из избранного по клику
                    heartIcon.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        heartIcon.classList.toggle("favorite");

                        const updatedFavorites = favorites.filter((item) => item.id !== product.id);
                        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

                        // Обновляем список товаров
                        updateFavorites();
                    });
                }

                rowContainer.appendChild(productCard);
            });

            favoritesContainer.appendChild(rowContainer);
        }
    };

    updateFavorites();
});

import { createHeader } from "../../component/Header";
import { Product } from "../../utils/types";

document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        const header = createHeader();
        mainContainer.prepend(header);
    }

    const cartContainer = document.getElementById("cart-container") as HTMLDivElement | null;
    if (!cartContainer) {
        console.error("Ошибка: контейнер корзины не найден.");
        return;
    }
    cartContainer.classList.add("cart-container");

    function createCartItemsContainer(): HTMLDivElement {
        const cartItemsContainer = document.createElement("div");
        cartItemsContainer.classList.add("cart-items");
        return cartItemsContainer;
    }

    function createTotalContainer(): HTMLDivElement {
        const totalContainer = document.createElement("div");
        totalContainer.classList.add("total-container");

        // Глобальные переменные, чтобы не искать их в DOM
        totalItemsElement = document.createElement("p");
        totalItemsElement.id = "total-items";
        totalItemsElement.textContent = "Итого товаров: 0";

        totalPriceElement = document.createElement("h3");
        totalPriceElement.id = "total-price";
        totalPriceElement.textContent = "0 сум";

        checkoutButton = document.createElement("button");
        checkoutButton.id = "checkout-button";
        checkoutButton.textContent = "Оформить заказ";
        checkoutButton.className = "checkout-button";

        totalContainer.append(totalPriceElement, totalItemsElement, checkoutButton);
        return totalContainer;
    }

    function createEmptyCartContainer(): HTMLDivElement {
        const emptyContainer = document.createElement("div");
        emptyContainer.className = "empty-cart-container";

        const emptyImage = document.createElement("img");
        emptyImage.className = "empty-cart-image";
        emptyImage.src = "/img/basket.png";
        emptyImage.alt = "Корзина пуста";

        emptyContainer.appendChild(emptyImage);
        return emptyContainer;
    }

    // Глобальные переменные
    let totalItemsElement: HTMLParagraphElement;
    let totalPriceElement: HTMLHeadingElement;
    let checkoutButton: HTMLButtonElement;

    const cartItemsContainer = createCartItemsContainer();
    const totalContainer = createTotalContainer();
    const emptyContainer = createEmptyCartContainer();

    cartContainer.append(cartItemsContainer, totalContainer, emptyContainer);

    function updateCartUI(): void {
        let cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
            cart = [];
        }

        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            emptyContainer.style.display = "flex";
            cartItemsContainer.style.display = "none";
            totalContainer.style.display = "none";
            return;
        }

        emptyContainer.style.display = "none";
        cartItemsContainer.style.display = "block";
        totalContainer.style.display = "block";

        cart.forEach((product, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            const itemImage = document.createElement("img");
            itemImage.className = "cart-item-image";
            itemImage.src = product.media?.[0] || "https://via.placeholder.com/150";
            itemImage.alt = product.title;

            const itemInfo = document.createElement("div");
            itemInfo.className = "cart-item-info";

            const title = document.createElement("h2");
            title.textContent = product.title;

            const price = document.createElement("p");
            price.innerHTML = `<strong>${product.price.toLocaleString()} сум</strong>`;

            const controls = document.createElement("div");
            controls.className = "cart-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.className = "decrease";
            decreaseButton.dataset.index = index.toString();

            const quantitySpan = document.createElement("span");
            quantitySpan.textContent = (product.quantity || 1).toString();

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.className = "increase";
            increaseButton.dataset.index = index.toString();

            const removeButton = document.createElement("button");
            removeButton.textContent = "Удалить";
            removeButton.className = "remove";
            removeButton.dataset.index = index.toString();

            controls.append(decreaseButton, quantitySpan, increaseButton, removeButton);
            itemInfo.append(title, price, controls);
            cartItem.append(itemImage, itemInfo);
            cartItemsContainer.appendChild(cartItem);

            totalPrice += product.price * (product.quantity || 1);
            totalItems += product.quantity || 1;
        });

        // Обновляем глобальные элементы
        totalItemsElement.textContent = `Итого товаров: ${totalItems}`;
        totalPriceElement.textContent = `${totalPrice.toLocaleString()} сум`;

        // Пересоздаем обработчики кнопок
        document.querySelectorAll(".decrease, .increase, .remove").forEach((button) => {
            const newButton = button.cloneNode(true) as HTMLButtonElement;
            button.replaceWith(newButton);
        });

        document.querySelectorAll(".decrease").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = parseInt((event.target as HTMLElement).dataset.index || "0", 10);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI();
            });
        });

        document.querySelectorAll(".increase").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = parseInt((event.target as HTMLElement).dataset.index || "0", 10);
                cart[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI();
            });
        });

        document.querySelectorAll(".remove").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = parseInt((event.target as HTMLElement).dataset.index || "0", 10);
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    checkoutButton.addEventListener("click", () => {
        alert("Заказ оформлен!");
        localStorage.removeItem("cart");
        updateCartUI();
    });

    updateCartUI();
});

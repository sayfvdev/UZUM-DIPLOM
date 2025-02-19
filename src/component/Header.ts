import db from "../../db.json";
import { User, Database } from "../utils/types";

export function createHeader(): HTMLElement {
    if (!db || !Array.isArray(db.goods)) {
        throw new Error("Ошибка: база данных не определена или имеет неправильную структуру.");
    }

    const database: Database = db;
    const header = document.createElement("header");
    const categoryDiv = document.createElement("div");
    const logoLink = document.createElement("a");
    const logoImage = document.createElement("img");
    const categoryBtn = document.createElement("button");
    const searchDiv = document.createElement("div");
    const searchInput = document.createElement("input");
    const searchResultsBlock = document.createElement("div");
    const nav = document.createElement("nav");
    const userDiv = document.createElement("div");
    const favoritesLink = document.createElement("a");
    const basketDiv = document.createElement("div");
    const basketLink = document.createElement("a");
    const basketCounter = document.createElement("span");
    const categoryBlock = document.createElement("div");

    header.classList.add("header");
    categoryDiv.classList.add("category");
    logoLink.href = "#";
    logoImage.src = "/icons/Logo.svg";
    logoImage.alt = "Logo";
    categoryBtn.classList.add("category_btn");
    categoryBtn.textContent = "Каталог";
    searchDiv.classList.add("search_goods");
    searchInput.classList.add("search");
    searchInput.type = "search";
    searchInput.placeholder = "Искать товары";
    searchResultsBlock.classList.add("search_results");
    searchResultsBlock.style.display = "none";
    nav.classList.add("navigation");
    userDiv.classList.add("user");
    favoritesLink.classList.add("favorites");
    favoritesLink.href = "/src/Pages/ProductInfo/Favorites/Favorites.html";
    favoritesLink.textContent = "Избранное";
    basketDiv.classList.add("basket");
    basketLink.href = "/src/Pages/Basket/basket.html";
    basketLink.textContent = "Корзина ";
    basketCounter.classList.add("basket_counter");
    categoryBlock.classList.add("category_block");
    categoryBlock.style.display = "none";

    function updateBasketCounter() {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalCount = cart.reduce((acc: number, item: { quantity: number }) => acc + (item.quantity || 1), 0);
        basketCounter.textContent = totalCount.toString();
    }
    updateBasketCounter();


    function getLoggedInUser(): User {
        return JSON.parse(localStorage.getItem("user") || "{}");
    }

    function updateUserDiv() {
        const user = getLoggedInUser();
        if (user.name) {
            userDiv.innerHTML = `<a href="/src/Pages/Profile/profile.html">${user.name}</a>`;
        } else {
            userDiv.textContent = "Войти";
            userDiv.addEventListener("click", appendLoginModal);
        }
    }
    updateUserDiv();

    function appendLoginModal() {
        if (document.getElementById("login-modal")) return;

        const modal = document.createElement("dialog");
        modal.id = "login-modal";
        modal.className = "login-dialog";
        modal.innerHTML = `
            <h2>Вход</h2>
            <form method="dialog">
                <label for="login-phone">Номер телефона</label>
                <input id="login-phone" type="tel" class="login-phone" placeholder="Введите номер телефона" required />
                
                <label for="login-password">Пароль</label>
                <input id="login-password" type="password" class="login-password" placeholder="Введите пароль" required />
                
                <button type="submit" class="login-btn">Войти</button>
                <button type="button" class="cancel-btn">Отмена</button>
            </form>
        `;
        document.body.appendChild(modal);

        const cancelButton = modal.querySelector(".cancel-btn");
        cancelButton?.addEventListener("click", () => {
            modal.close();
        });

        const loginForm = modal.querySelector("form");
        loginForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const phone = (modal.querySelector("#login-phone") as HTMLInputElement)?.value;
            const password = (modal.querySelector("#login-password") as HTMLInputElement)?.value;
            
            const user = database.users.find(u => u.phone === phone && u.password === password);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                alert("Вы успешно вошли!");
                modal.close();
                updateUserDiv();
                window.location.href = "/src/Pages/Profile/profile.html";
            } else {
                alert("Неверный номер телефона или пароль.");
            }
        });

        modal.showModal();
    }

    categoryBtn.addEventListener("click", () => {
        categoryBlock.style.display = categoryBlock.style.display === "block" ? "none" : "block";
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResultsBlock.style.display = "none";
            searchResultsBlock.innerHTML = "";
            return;
        }
        
        const filteredGoods = database.goods.filter((item) => item.title.toLowerCase().includes(query));
        searchResultsBlock.innerHTML = "";
        
        filteredGoods.forEach((item) => {
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("search_result_item");
            resultDiv.textContent = item.title;
            resultDiv.addEventListener("click", () => {
                window.location.href = `/src/Pages/ProductInfo/ProductInfo.html?id=${item.id}`;
            });
            searchResultsBlock.append(resultDiv);
        });
        searchResultsBlock.style.display = "block";
    });

    logoLink.append(logoImage);
    categoryDiv.append(logoLink, categoryBtn);
    searchDiv.append(searchInput, searchResultsBlock);
    basketLink.append(basketCounter);
    basketDiv.append(basketLink);
    nav.append(userDiv, favoritesLink, basketDiv);
    header.append(categoryDiv, searchDiv, nav, categoryBlock);
    document.body.append(header);

    return header;
}

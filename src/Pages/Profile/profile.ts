import { User } from "../../utils/types";
import { createHeader } from "../../component/Header";

document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("main-container");

    if (mainContainer) {
        const header = createHeader();
        mainContainer.prepend(header);
    }

    const user: User | null = getLoggedInUser();

    if (!user) {
        alert("Вы не авторизованы!");
        window.location.href = "/";
        return;
    }

    (document.getElementById("lastname") as HTMLInputElement).value = user.lastName || "";
    (document.getElementById("firstname") as HTMLInputElement).value = user.firstName || "";
    (document.getElementById("middlename") as HTMLInputElement).value = user.middleName || "";
    (document.getElementById("birthdate") as HTMLInputElement).value = user.birthDate || "";
    (document.getElementById("email") as HTMLInputElement).value = user.email || "";
    (document.getElementById("phone") as HTMLInputElement).value = user.phone || "";

    if (user.gender === "male") {
        document.getElementById("male")?.classList.add("selected");
    } else if (user.gender === "female") {
        document.getElementById("female")?.classList.add("selected");
    }

    document.getElementById("saveProfile")?.addEventListener("click", (event) => {
        event.preventDefault();
        saveProfile();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);

    updateUserDiv();
});

function getLoggedInUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? (JSON.parse(userData) as User) : null;
}

function saveProfile(): void {
    const updatedUser: User = {
        lastName: (document.getElementById("lastname") as HTMLInputElement).value,
        firstName: (document.getElementById("firstname") as HTMLInputElement).value,
        middleName: (document.getElementById("middlename") as HTMLInputElement).value,
        birthDate: (document.getElementById("birthdate") as HTMLInputElement).value,
        email: (document.getElementById("email") as HTMLInputElement).value,
        phone: (document.getElementById("phone") as HTMLInputElement).value,
        gender: document.querySelector(".profile-gender-btn.selected")?.id || "",
        name: (document.getElementById("firstname") as HTMLInputElement).value,
        password: getLoggedInUser()?.password || ""
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Данные успешно сохранены!");

    updateUserDiv();
}

function updateUserDiv(): void {
    const user = getLoggedInUser();
    const userDiv = document.querySelector(".user");

    if (user && userDiv) {
        // userDiv.innerHTML = `
        //     <a href="/src/Pages/Profile/profile.html">${user.name}</a>
        //     <button id="logoutBtn" class="logout-btn">Выйти</button>
        // `;

        document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
    }
}

function logoutUser(): void {
    localStorage.removeItem("user");
    alert("Вы вышли из аккаунта!");
    window.location.href = "/";
}

document.querySelectorAll(".profile-gender-btn").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".profile-gender-btn").forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

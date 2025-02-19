export function reload({ data, component, place }: any) {
    place.innerHTML = ""; 

    const container = document.createElement("div");
    container.className = "product-container"; 

    for (let item of data) {
        const card = component(item);
        container.appendChild(card);
    }

    place.appendChild(container);
}

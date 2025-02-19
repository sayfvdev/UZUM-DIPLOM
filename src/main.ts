
import { Carousel } from "./utils/carousel";
import { createHeader } from './component/Header';
import goodsData from '../db.json';
import { createProductCard } from "./component/Card"; 
import { Product } from './utils/types';
import { reload } from "./utils/reload";


document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".carousel");
});





document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.getElementById("main-container");
  if (mainContainer) {
    const header = createHeader();
    mainContainer.prepend(header);
  }
});


const products: Product[] = goodsData.goods;

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    reload({
      data: products,
      component: createProductCard,
      place: app
    });
  }
});

export class Carousel {
    private slides: HTMLElement[];
    private indicators: HTMLElement[];
    private currentIndex: number;
    private slidesContainer: HTMLElement;
    private indicatorsContainer: HTMLElement;
    private autoSlideInterval: number;

    constructor(containerSelector: string, autoSlideTime: number = 5000) {
        const container = document.querySelector(containerSelector);
        if (!container) throw new Error("Carousel container not found");

        this.slidesContainer = container.querySelector(".carousel__slides")!;
        this.indicatorsContainer = container.querySelector(".carousel__indicators")!;
        this.slides = Array.from(this.slidesContainer.children) as HTMLElement[];
        this.indicators = Array.from(this.indicatorsContainer.children) as HTMLElement[];
        this.currentIndex = 0;
        this.autoSlideInterval = autoSlideTime;

        this.initButtons(container);
        this.updateIndicators();
        this.initIndicators();
        this.update();
        this.startAutoSlide();
    }

    private initButtons(container: Element): void {
        const prevButton = container.querySelector(".carousel__button--prev")!;
        const nextButton = container.querySelector(".carousel__button--next")!;

        prevButton.addEventListener("click", () => this.prevSlide());
        nextButton.addEventListener("click", () => this.nextSlide());
    }

    private initIndicators(): void {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => this.goToSlide(index));
        });
    }

    private update(): void {
        const offset = -this.currentIndex * 100;
        this.slidesContainer.style.transform = `translateX(${offset}%)`;

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle("carousel__indicator--active", index === this.currentIndex);
        });
    }

    private prevSlide(): void {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.update();
    }

    private nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.update();
    }

    private goToSlide(index: number): void {
        this.currentIndex = index;
        this.update();
    }

    private startAutoSlide(): void {
        setInterval(() => {
            this.nextSlide();
        }, this.autoSlideInterval);
    }

    private updateIndicators(): void {
        this.indicatorsContainer.innerHTML = '';


        this.slides.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.classList.add("carousel__indicator");
            indicator.setAttribute("data-slide", `${index}`);
            indicator.addEventListener("click", () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });

        this.indicators = Array.from(this.indicatorsContainer.children) as HTMLElement[];
    }
}

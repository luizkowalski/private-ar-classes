(() => {
  // app/javascript/application.js
  window.addEventListener("load", () => {
    const links = document.querySelectorAll("[data-link]");
    links.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        const url = element.getAttribute("data-link");
        window.location.href = url;
      });
    });
  });
})();
//# sourceMappingURL=application.js.map

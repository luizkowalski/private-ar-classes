// Entry point for the build script in your package.json
// window.addEventListener("load", () => {
//   const links = document.querySelectorAll(
//     "[data-link]"
//   );

//   links.forEach((element) => {
//     element.addEventListener("click", (event) => {
//       event.preventDefault();

//       const url = element.getAttribute("data-link");
//       window.location.href = url;
//     });
//   });
// });

import "@hotwired/turbo-rails"
import "@rails/actiontext"
import "trix"
import "./controllers"


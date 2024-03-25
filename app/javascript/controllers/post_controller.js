import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="post"
export default class extends Controller {
  connect() {
    document.addEventListener("trix-file-accept", event => {
      event.preventDefault();
    })
  }
}

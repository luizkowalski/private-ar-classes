import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  hideModal() {
    this.element.parentElement.removeAttribute("src")
    this.element.remove()
  }

    // hide modal when clicking ESC
  // action: "keyup@window->modal#closeWithKeyboard"
  closeWithKeyboard(e) {
    if (e.code == "Escape") {
      this.hideModal()
    }
  }
}

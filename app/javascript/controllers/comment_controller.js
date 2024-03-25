import { Controller } from "@hotwired/stimulus";
import { Turbo } from "@hotwired/turbo-rails";

// Connects to data-controller="comment"
export default class extends Controller {
  static targets = ["form", "inputText"];
  connect() {
  }

  post(event){
    if((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
      event.preventDefault();
      Turbo.navigator.submitForm(this.formTarget);
      this.inputTextTarget.value = "";
    }
  }
}

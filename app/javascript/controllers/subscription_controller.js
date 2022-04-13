import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails";

// Connects to data-controller="subscription"
export default class extends Controller {
  connect() {
  }

  join(event){
    fetch(event.params.url, {
      method: 'post',
      headers: {
        'X-CSRF-Token': event.params.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      Turbo.visit(window.location.href) // lol
    });
  }
}

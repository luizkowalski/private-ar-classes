import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "body", "comments" ]

  comment(event) {
    event.preventDefault();
    fetch(event.params.url, {
      method: event.params.method,
      body: JSON.stringify({ body: this.bodyTarget.value }),
      headers: {
        'X-CSRF-Token': event.params.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        console.log(data)
        this.commentsTarget.prepend(data.html)
      } else {
        // alert(data.message)
      }
    });
  }
}

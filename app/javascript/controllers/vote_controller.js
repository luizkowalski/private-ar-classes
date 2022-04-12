import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "upvotes" ]

  upvote(event) {
    fetch(event.params.url, {
      method: event.params.method,
      headers: {
        'X-CSRF-Token': event.params.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        if(data.new_record) {
          this.upvotesTarget.innerText = parseInt(this.upvotesTarget.innerText) + 1
        }
      } else {
        // alert(data.message)
      }
    });
  }
}

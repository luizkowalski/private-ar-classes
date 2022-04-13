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
      if(data.success && data.new_record) {
        console.log(data.upvotes)
        this.upvotesTarget.innerText = data.upvotes
      } else {
        // alert(data.message)
      }
    });
  }
}

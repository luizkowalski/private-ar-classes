import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "postId", "upvotes" ]

  connect() {
    console.log('Hello world!')
  }

  upvote(event) {
    // event.preventDefault();
    // const form = event.target
    // const url  = form.action
    // console.log(url)
    // const element = this.postIdTarget
    // const post_id = element.value

    // const upvotes = this.upvotesTarget
    // upvotes.innerText = parseInt(upvotes.innerText) + 1
    // event.preventDefault()
    // const form = event.target
    // const url  = form.action
    // const method = form.method
    // const data = new FormData(form)
    // fetch(url, {
    //   method: method,
    //   body: data
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.success) {
    //     const vote_count = document.getElementById('vote_count')
    //     vote_count.innerText = data.vote_count
    //   }
    // })
  }
}

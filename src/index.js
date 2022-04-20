let showing = true;

document.addEventListener("DOMContentLoaded", () => {
    const imageContainer = document.querySelector("div.image-container");

    fetch("http://localhost:3000/images/")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            console.log(element)
            displayImage(element)
        })
    })

    function displayImage(item) {
        const imageCard = document.querySelector("div.image-card");

        const imageContent = `
            <h2 id="card-title" class="title">${item.title}</h2>
            <img id="card-image" class="image" src="${item.image}" alt="${item.title}" />
            <div class="likes-section">
            <span id="like-count" class="likes">${item.likes} likes</span>
            <button id="like-button" class="like-button">♥</button>
            </div>
            <ul id="comments-list" class="comments">
            </ul>
            <form id="comment-form" class="comment-form">
            <input
                class="comment-input"
                type="text"
                name="comment"
                id="comment"
                placeholder="Add a comment..."
            />
            <button class="comment-button" type="submit">Post</button>
            </form>
        `
        imageCard.innerHTML = imageContent
        imageContainer.appendChild(imageCard)

        const commentsList = imageCard.querySelector("#comments-list")
        getComments(item, commentsList)

        imageCard.querySelector("#like-button").addEventListener("click", function(){
            updateLikes(item)
        })
        const commentForm = imageCard.querySelector("form#comment-form");
        commentForm.addEventListener("submit", function(e){
            e.preventDefault()
            const data = {
                imageId: item.id,
                content: commentForm["comment"].value
            }
            postNewComment(data)
            getComments(item, commentsList)
            commentForm.reset()
        })

        const imageTitle = imageCard.querySelector("#card-title")
        imageTitle.addEventListener("click", () => {
            const cardImage = imageCard.querySelector("#card-image")
            showing = !showing;
            if(showing){
                cardImage.style.display = "block"
            } else {
                cardImage.style.display = "none"
            }
        })

    }

    function updateLikes(item) {
        fetch(`http://localhost:3000/images/${item.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: item.id,
                title: item.title,
                likes: ++item.likes,
                image: item.image,
            })
        })
        .then(response => response.json())
        .then(data => displayImage(data))
    }

    function getComments(item, container) {
        container.innerHTML = ''
        fetch(`http://localhost:3000/comments`)
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                if(element.imageId === item.id){
                    const listItem = document.createElement("li")
                    listItem.innerText = element.content
                    listItem.addEventListener("click", function(){
                        listItem.remove()
                        deleteComment(element.id)
                    })
                    container.append(listItem)
                }
            })
        })
    }


    function postNewComment(data) {
        fetch(`http://localhost:3000/comments`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
    }

    function deleteComment(id) {
        fetch(`http://localhost:3000/comments/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(result => result)
    }
})

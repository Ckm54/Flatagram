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
            COMMENTS
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

        imageCard.querySelector("#like-button").addEventListener("click", function(){
            updateLikes(item)
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
})

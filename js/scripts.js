class Book {
	constructor(title, authors, pageCount, averageRating, read, image){
		this.title = title;
		this.authors = authors;
		this.pageCount = pageCount;
		this.rating = averageRating;
		this.read = read;
		this.image = image;
	}
}

const append = (parent, el) => parent.appendChild(el);
const compare = type => (a,b) => (a[type] > b[type]) ? 1 : (b[type] > a[type]) ? -1 : 0;
const createNode = element => document.createElement(element);
const deleteChildren = x => {
  const node = document.getElementById(`${x}`);
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}
const hideOptions = () => myLibrary.length > 1 ? document.getElementById("dropdowns").style.display = "flex" : document.getElementById("dropdowns").style.display = "none" 
const htmlStarCreator = bookID => {
	let innerHTML = "";
	for (let i = 5; i >= 0.5; i -= 0.5){
		innerHTML += `<input class="rating-buttons${bookID}" type="radio" id="${bookID}rating-${i}" name="rating${bookID}" value="${i}">
									<label for="${bookID}rating-${i}"></label>`;
	}
	return innerHTML
}
const ifImageBlankThumbnail = dataPath => dataPath ? dataPath.thumbnail : "images/not-available.svg";
const ifImageBlankFullSize = dataPath => dataPath ? returnLargestImage(dataPath) : ""
const ifBlank = dataPath => dataPath ? dataPath : "";
const ifAuthorBlank = dataPath => dataPath ? dataPath.join(', ').replace(/, ([^,]*)$/, ' & $1') : "";
const ifRatingBlank = dataPath => dataPath ? dataPath : 0;
const readCheck = book => book.read ? document.getElementById(`label-text${myLibrary.indexOf(book)}`).innerHTML = "Read" : document.getElementById(`label-text${myLibrary.indexOf(book)}`).innerHTML = "Unread";
const render = book => {
	const gridContainer = document.getElementById("libraryGrid");
	const gridRow = document.createElement("div");
	const user = firebase.auth().currentUser
	const dbRefObject = firebase.database().ref(`users/${user.uid}/${myLibrary.indexOf(book)}`)
	gridRow.classList.add("library-local-perspective");
	gridRow.innerHTML = 
   `<div class="library-book">
	 	<img src="${book.image}" class="library-book__front"></img>
		<div class="library-book__back">
			<div class="library-book__back--title">${book.title}</div>
		<div class="library-book__back--authors">${book.authors}</div>
		<div class="library-book__back--page-count">${book.pageCount}<br>pages</div>
		<div class="library-book__back--read-button">
			<input type="checkbox" class="hidden-checkbox" id="readCheckbox${myLibrary.indexOf(book)}">
			<p id="label-text${myLibrary.indexOf(book)}"></p>
			<label class="read-button-label" for="readCheckbox${myLibrary.indexOf(book)}"></label>
		</div>
		<div class="library-book__back--rating">
			<fieldset class="star-rating-group">
				${htmlStarCreator(myLibrary.indexOf(book))}
			</fieldset>
		</div>
			<button class="library-book__back--remove-button" id="deleteButton${myLibrary.indexOf(book)}" data-type="${myLibrary.indexOf(book)}">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.96 25"><title>close-button 2</title><polygon points="24.96 2.44 22.56 0.04 12.5 10.1 2.4 0 0 2.4 10.1 12.5 0 22.59 2.4 25 12.5 14.9 22.56 24.96 24.96 22.56 14.9 12.5 24.96 2.44" style="fill:#FFFFFF"/></svg>
			</button>
		</div>
	</div>`;
	gridContainer.appendChild(gridRow);
	if (book.rating > 0) {
		document.getElementById(`${myLibrary.indexOf(book)}rating-${book.rating}`).checked = true;
	}
	document.querySelectorAll(`.rating-buttons${myLibrary.indexOf(book)}`).forEach(button => {
		button.addEventListener("change", (e) => {
			book.rating = Number(e.target.value);
			if (user) {
				dbRefObject.update({rating: book.rating});
			}
	  	})
	})
	document.getElementById(`readCheckbox${myLibrary.indexOf(book)}`).checked = book.read
	readCheck(book)
	document.getElementById(`readCheckbox${myLibrary.indexOf(book)}`).addEventListener("change", (e) => {
		book.read = document.getElementById(e.target.id).checked;
		readCheck(book)
		if (user) {
			dbRefObject.update({read: book.read});
		}
	})
	document.getElementById(`deleteButton${myLibrary.indexOf(book)}`).addEventListener("click", (e) => {
		myLibrary.splice(e.target.dataset.type, 1);
		if (user) {
			dbRefObject.set(myLibrary);
		}
		renderLibrary()
	})
}
const renderLibrary = () => {
  document.getElementById("libraryGrid").innerHTML =
   `<button class="library-grid__add-book" id="addBook">
			<svg id="add-book-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 120"><title>add-book</title><polygon points="58.2 58.5 44 58.5 44 44.3 41 44.3 41 58.5 26.8 58.5 26.8 61.5 41 61.5 41 75.7 44 75.7 44 61.5 58.2 61.5 58.2 58.5"/><polygon points="55.5 2 83 2 83 29.6 85 29.6 85 0 55.5 0 55.5 2"/><polygon points="2 29.6 2 2 28.7 2 28.7 0 0 0 0 29.6 2 29.6"/><polygon points="28.7 118 2 118 2 87.9 0 87.9 0 120 28.7 120 28.7 118"/><polygon points="83 87.9 83 118 55.5 118 55.5 120 85 120 85 87.9 83 87.9"/></svg>
		</button>`
  hideOptions()
  myLibrary.forEach(book => render(book));
}
const returnLargestImage = object => object.medium ? object.medium : object.thumbnail ? object.thumbnail : "";
/*const returnLargestImage = object => object.extraLarge ? object.extraLarge : object.large ? object.large : object.medium ? object.medium : object.small ? object.small : "";*/
const returnButtonFunction = input => {
	const inputValues = {
		modalReset: ["closeSearch", "modal-overlay", "Escape", "closeLoginSignUp"],
		bookSearch: ["searchButton", "Enter"],
		addBook: []
	}
	for (let [key, value] of Object.entries(inputValues)) {
		if (value.indexOf(input) !== -1) {
			return `${key}`;
		}
	}
}
const sortValue = x => x.replace(/\s+/g, "")
const toggleDOM = (element, className) => document.getElementById(`${element}`).classList.toggle(`${className}`);

const buttonFunctionsMap = {
	addBook: () => {
		deleteChildren("search-results");
	  modal.searchVisible = true;
	  toggleDOM("searchBar", "hidden");
	  toggleDOM("modal-overlay", "hidden");
	},
	bookSearch: () => {
		const search = document.getElementById("searchInput").value;
		const ul = document.getElementById("search-results");
		if (modal.searchVisible && search !== "") {
			if (!document.getElementById("searchBar").classList.contains("search-mode")){
				toggleDOM("searchBar", "search-mode");
			}
			deleteChildren("search-results")

			fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${config}`)
				.then(response => response.json())
				.then(data => {
					data.items.map(book => {
						let li = createNode("li"),
						   img = createNode("img"),
						     p = createNode("p");
						   
						img.src = `${ifImageBlankThumbnail(book.volumeInfo.imageLinks)}`;
						p.innerHTML = `<div class="search-item__info--title">${ifBlank(book.volumeInfo.title)}</div><div class="search-item__info--authors">${ifAuthorBlank(book.volumeInfo.authors)}</div>`;
						li.classList = "search-item";
						img.classList = "search-item__image";
						p.classList = "search-item__info";
						li.addEventListener("click", (e) => {
							fetch(`https://www.googleapis.com/books/v1/volumes/${book.id}?key=${config}`)
								.then(response => response.json())
								.then(data => {
									myLibrary
									 .push(new Book(
											ifBlank(data.volumeInfo.title), 
											ifAuthorBlank(data.volumeInfo.authors), 
											ifBlank(data.volumeInfo.pageCount), 
											ifRatingBlank(data.volumeInfo.averageRating), 
											false, 
											ifImageBlankFullSize(data.volumeInfo.imageLinks)));
									render(myLibrary[myLibrary.length - 1]);
									hideOptions()
									const user = firebase.auth().currentUser
									const dbRefObject = firebase.database().ref('users/' + user.uid)
									if (user) {
										dbRefObject.set(myLibrary[myLibrary.length - 1]);
									}
							})
						})
						append(li, img);
						append(li, p);
						append(ul, li);
						})
					})
		}
	},
	loginSignUpButton: () => {
		modal.loginSignUpVisible = true;
    toggleDOM("loginSignUp", "hidden");
    toggleDOM("modal-overlay", "hidden");
	},
	modalReset: () => {
		["searchBar", "modal-overlay", "loginSignUp"].forEach(element => {
			if (!document.getElementById(element).classList.contains("hidden")) {
				toggleDOM(element, "hidden");
			}
		})
		if (document.getElementById("searchBar").classList.contains("search-mode")) {
    	toggleDOM("searchBar", "search-mode");
	  }
	  document.getElementById("searchInput").value = "";
	  modal.searchVisible = modal.loginSignUpVisible = false;
	},
	reverseArray: () => {
		toggleDOM("reverseArray", "flipped")
		myLibrary.reverse()
		renderLibrary()
	},
}

let myLibrary = []

const modal = {
	searchVisible: false,
  loginSignUpVisible: false,
  signOutVisible: false,
}

document.addEventListener("click", (e) => {
  if (returnButtonFunction(e.target.id)) {
    buttonFunctionsMap[returnButtonFunction(e.target.id)]();
  } else if (buttonFunctionsMap[e.target.id]) {
  	buttonFunctionsMap[e.target.id]()
  }

	if (modal.signOutVisible && e.target.id !== "signOut") {
		toggleDOM("signOut", "hiddenSignOut");
		modal.signOutVisible = false;
	} else if (!modal.signOutVisible && e.target.id === "userInfo") {
		toggleDOM("signOut", "hiddenSignOut");
		modal.signOutVisible = true;
	}
})

document.addEventListener("keyup", (e) => {
  if (modal.searchVisible && returnButtonFunction(e.key)) {
    buttonFunctionsMap[returnButtonFunction(e.key)]();
  }
})

document.getElementById("hideRead").addEventListener("change", (e) => {
	const innerHTML =
		`<button class="library-grid__add-book" id="addBook">
			<svg id="add-book-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 120"><title>add-book</title><polygon points="58.2 58.5 44 58.5 44 44.3 41 44.3 41 58.5 26.8 58.5 26.8 61.5 41 61.5 41 75.7 44 75.7 44 61.5 58.2 61.5 58.2 58.5"/><polygon points="55.5 2 83 2 83 29.6 85 29.6 85 0 55.5 0 55.5 2"/><polygon points="2 29.6 2 2 28.7 2 28.7 0 0 0 0 29.6 2 29.6"/><polygon points="28.7 118 2 118 2 87.9 0 87.9 0 120 28.7 120 28.7 118"/><polygon points="83 87.9 83 118 55.5 118 55.5 120 85 120 85 87.9 83 87.9"/></svg>
		</button>`
	if (e.target.checked) {
		document.getElementById("libraryGrid").innerHTML = innerHTML;
  	myLibrary.forEach(book => {if (!book.read) render(book)})
	} else {
		document.getElementById("libraryGrid").innerHTML = innerHTML;
  	myLibrary.forEach(book => render(book));
	}
})

document.getElementById("sortList").addEventListener("change", (e) => {
	if (document.getElementById("reverseArray").classList.contains("flipped")) {
		toggleDOM("reverseArray", "flipped")
	}
  myLibrary.sort(compare(sortValue(e.target.value)));
  renderLibrary();
}) 

/*document.getElementById("signupConfirmPassword").addEventListener("focusout", (e) => {
	if (e.value !== document.getElementById("signupPassword").value) {
		e.target.id.setCustomValidity("Passwords must match!");
	} else {
		e.target.id.setCustomValidity("");
	}
})

document.querySelectorAll(".switchForm").forEach(form => {
	form.addEventListener("click", () => {
		toggleDOM("signUp", "hidden");
		toggleDOM("logIn", "hidden");
	})
})
*/

//FIREBASE

let ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    uiShown: function() {
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: "popup",
  signInSuccessUrl: "./",
  signInOptions: [
  	firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  tosUrl: 'https://www.termsfeed.com/live/4e604e5a-6090-455f-b239-96159f7a38d5',
  privacyPolicyUrl: 'https://www.freeprivacypolicy.com/privacy/view/33adde2175c97e83733f6bc09192c066'
};

ui.start('#firebaseui-auth-container', uiConfig);

window.addEventListener("load", () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    	const dbRefObject = firebase.database().ref('users/' + user.uid)
    	dbRefObject.once("value", snap => {
    		if (snap.val()) {
    			myLibrary = (snap.val())
    			renderLibrary()
    		}
    	})
    	toggleDOM("userInfo", "hidden");
      document.getElementById("username").innerHTML = `${user.displayName}`
      const icon = document.getElementById("userIcon")
      if (user.photoURL) {
        icon.src = `${user.photoURL}`;
      } else {
        icon.style.backgroundImage = `url("images/default-user.png")`;
      }
    } else {
      modal.loginSignUpVisible = true
      toggleDOM("loginSignUp", "hidden")
      toggleDOM("modal-overlay", "hidden")
      toggleDOM("loginSignUpButton", "hidden");
    }
  });
})

document.getElementById("signOut").addEventListener("click", (e) => {
  firebase.auth().signOut().then(() => location.reload())
})
/*
document.getElementById("signUp").addEventListener("submit", (e) => {
	email = document.getElementById("signupEmail").value
	password = document.getElementById("signupPassword").value
	if (document.getElementById("signupConfirmPassword").value === password) {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
		buttonFunctionsMap[modalReset]()
	} else {
		e.preventDefault()

	}
})

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
*/
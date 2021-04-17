let startRood = 0;
let startGreen = 0;
let startBlauw = 0;
let colorChangeRate = 30;

function addNewCommentPost()
{
    let divGuestbook = document.getElementById("guestbook");
    let divContainer = divGuestbook.parentElement;
    let commentMsg = document.getElementById("currentComment").value;
    if ((commentMsg != null) && (commentMsg != ""))
    {
        divContainer.appendChild(createCommentDiv(commentMsg,cardKleur=geefRGB(100,100,100),bodyKleur=geefRGB(200,100,200)));
    }
}

function geefRGB(addRed = 0, addGreen = 0, addBlauw = 0)
{
    let rood =  clamp(startRood - addRed);
    let groen = clamp(startGreen + addGreen);
    let blauw = clamp(startBlauw - addBlauw);
    return "rgb("+rood+", "+groen+", "+blauw+")"; 
}

function clamp(valueToCheck, minValue = 0, maxValue = 255)
{
    let result;
    if (valueToCheck > minValue)
        if (valueToCheck < maxValue)
            result = valueToCheck;
        else
            result = valueToCheck - maxValue;
    else
        result = maxValue + valueToCheck;
    return result;
}

function createCommentDiv(newComment, cardKleur = geefRGB(), bodyKleur = geefRGB())
{
    let divCard = document.createElement("div");
        divCard.className = "card";
        divCard.style.backgroundColor = cardKleur;

        let divBody = document.createElement("div");
            divBody.className = "card-body";
            divBody.style.backgroundColor = bodyKleur;

            let pTxt = document.createElement("p");
                pTxt.className = "card-text";
                pTxt.textContent = newComment; 
            divBody.appendChild(pTxt);

            let commentBtn = document.createElement("a");
                commentBtn.className = "btn btn-primary";
                commentBtn.textContent = "Antwoord";   

                let onClick = document.createAttribute("onclick");
                    onClick.value = "toggleAnswer(this)"; 
                commentBtn.setAttributeNode(onClick);

            divBody.appendChild(commentBtn);   
        divCard.appendChild(divBody);
    return divCard;
}

function toggleAnswer(currentPost)
{
    let children = currentPost.parentElement.parentElement.children;
    let bRemove = false;
    if (children != null)
        for (let i=0; i<children.length; i++)
        {
            if (children[i].className === "comment-container")
            {
                currentPost.parentElement.parentElement.removeChild(children[i]);
                bRemove = true;
            }
        }
    if (!bRemove)
    {
        if (currentPost.parentElement.parentElement.firstChild)
            currentPost.parentElement.parentElement.insertBefore
                (
                createCommentSection(), currentPost.parentElement.parentElement.firstChild.nextSibling
                );
        else
            currentPost.parentElement.parentElement.appendChild(createCommentSection());
    }
}

function createCommentSection()
{
    let commentContainer = document.createElement("div");
        commentContainer.className = "comment-container";

        let txtField = document.createElement("input");
            txtField.className = "comment";

            let myType = document.createAttribute("type");
                myType.value = "text";
            txtField.setAttributeNode(myType);

        let commentBtn = document.createElement("a");
            commentBtn.className = "btn btn-primary";
            commentBtn.textContent = "Post antwoord";
            
            let onClick = document.createAttribute("onclick");
                onClick.value = "addNewAnswer(this)"; 
            commentBtn.setAttributeNode(onClick);        
        commentContainer.appendChild(txtField);
        commentContainer.appendChild(commentBtn);

    return commentContainer;
}

function addNewAnswer(currentPost)
{
    let myComment   = findCommentInParent(currentPost.parentElement);
    let iParents    = countParents(currentPost);
    if ((myComment != null) && (myComment != ""))
    {
        currentPost.parentElement.parentElement.appendChild
            (
                createCommentDiv    (   myComment,    
                                        cardKleur=geefRGB   (   addRed  =(iParents*colorChangeRate),
                                                                addGreen=(iParents*colorChangeRate), 
                                                                addBlauw=(iParents*colorChangeRate)
                                                            ),
                                        bodyKleur=geefRGB   (   addRed  =(iParents*colorChangeRate),
                                                                addGreen=(iParents*colorChangeRate), 
                                                                addBlauw=(iParents*colorChangeRate)
                                                            )
                                    )
            );
        toggleAnswer(currentPost);
    }
}

function findCommentInParent(parent)
{
    if (parent != null)
    {
        let children = parent.children;
        for (let i= 0; i < children.length; i++)
        {
            if (children[i].children.length > 0)
            {
                let diepComment = findCommentInParent(children[i]);
                if (diepComment != null) return diepComment;
            }    
            if (children[i].className === "comment")
            {
                return children[i].value;
            }
        }
    }
}

function countParents(elem) {
    // source:  https://gomakethings.com/how-to-get-all-parent-elements-with-vanilla-javascript/
	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		parents.push(elem);
	}

	// Return our parent array
	return parents.length;
};


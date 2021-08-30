const addQuickLinkInput = document.querySelector('#addQuickLinkInput')
const addQuickLinkForm = document.querySelector('#addQuickLinkForm')
const addLinkBtn = document.querySelector('#addLinkBtn')
const linksList = document.querySelector('#linksList')
const linksContainer = document.querySelector('#linksContainer')


addLinkBtn.addEventListener('click', toggleQuickLinkInput);
addQuickLinkForm.addEventListener('submit', addLink);
linksList.addEventListener('click', deleteLink);
loadLinks();

function toggleQuickLinkInput() {
    toggleSettings()
    settingsItem.forEach(function(settings){
        settings.firstChild.style.fontWeight = 'initial'
        settings.style.opacity = '.9'
        
        if(settings.firstChild.classList.contains('quickLinkSetting')){
            settings.firstChild.style.fontWeight = 'bold'
            subsettingsItem.forEach(function(subsetting){
                if(subsetting.classList.contains('quickLinkSetting')){
                    subsetting.style.display = 'initial'
                } else {
                    subsetting.style.display = 'none'
                }
            })
        }
    })

    addQuickLinkInput.focus()
}

function addLink(e){
    var urlPattern = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)
    if(urlPattern.test(addQuickLinkInput.value)){
        var inputValue = addQuickLinkInput.value;
        var titleUrl = `http://textance.herokuapp.com/title/${inputValue}`
        fetch(titleUrl)
            .then(response => response.text())
            .then(data =>{
                const imgUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${inputValue}`

                // populate subsetting
                const li = document.createElement('li');
                li.className = 'listItem';
                
                const img = document.createElement('img');
                img.setAttribute('src', imgUrl)

                const link = document.createElement('a');
                link.className = 'listItemText';

                const deleteTodo = document.createElement('a');
                deleteTodo.className = 'deleteBtn';
                deleteTodo.innerHTML = `<i class="material-icons">close</i>`;
                
                const btnDiv = document.createElement('div');
                btnDiv.className = 'secondary-content';
                btnDiv.appendChild(deleteTodo);
        
                link.appendChild(img);
                link.appendChild(document.createTextNode(data));
                li.appendChild(link)
                li.appendChild(btnDiv)
                linksList.appendChild(li)

                // populate linkElement
                const linkItem = document.createElement('a');
                linkItem.className = 'linkItem';
                linkItem.setAttribute('href', inputValue);

                const linkImg = document.createElement('img');
                linkImg.setAttribute('src', imgUrl)

                const linkText = document.createElement('p');
                linkText.className = 'linkText';
                linkText.appendChild(document.createTextNode(data));

                linkItem.appendChild(linkImg)
                linkItem.appendChild(linkText)
                linksContainer.appendChild(linkItem)

                // add to storage
                var linkObj = {
                    linkTitle: data,
                    linkUrl: inputValue,
                    linkImg: imgUrl
                };
                
                var localLinksList;
                if(localStorage.getItem('linksList') === null){
                    localLinksList = [];
                } else {
                    localLinksList = JSON.parse(localStorage.getItem('linksList'));
                }
                localLinksList.push(linkObj);
                localStorage.setItem('linksList', JSON.stringify(localLinksList));



            });

        
    } else {
        notifModal('Invalid Link.')

    }
    addQuickLinkInput.value = '';
    e.preventDefault()
}

function deleteLink(e){
    if(e.target.parentElement.classList.contains('deleteBtn')){
        e.target.parentElement.parentElement.parentElement.remove();
        var linkText = document.querySelectorAll(".linkItem p.linkText")

        // delete from main element
        linkText.forEach(function(link){
            if(link.textContent == e.target.parentElement.parentElement.parentElement.firstChild.textContent) {
                console.log(link.parentElement.remove())
            }
        })

        // delete from storage
        var localLinksList = JSON.parse(localStorage.getItem('linksList'));
        localLinksList.forEach(function(link, index){
            if(link.linkTitle == e.target.parentElement.parentElement.parentElement.firstChild.textContent){
                localLinksList.splice(index, 1)
            }
        });
        localStorage.setItem('linksList', JSON.stringify(localLinksList));
    }

    e.preventDefault()
}

function loadLinks(){
    var localLinksList;
    if(localStorage.getItem('linksList') === null){
        localLinksList = [];
    } else {
        localLinksList = JSON.parse(localStorage.getItem('linksList'));
    }

    localLinksList.forEach(function(localLinkItem){

                // populate subsetting
                const li = document.createElement('li');
                li.className = 'listItem';
                
                const img = document.createElement('img');
                img.setAttribute('src', localLinkItem.linkImg)

                const link = document.createElement('a');
                link.className = 'listItemText';

                const deleteTodo = document.createElement('a');
                deleteTodo.className = 'deleteBtn';
                deleteTodo.innerHTML = `<i class="material-icons">close</i>`;
                
                const btnDiv = document.createElement('div');
                btnDiv.className = 'secondary-content';
                btnDiv.appendChild(deleteTodo);
        
                link.appendChild(img);
                link.appendChild(document.createTextNode(localLinkItem.linkTitle));
                li.appendChild(link)
                li.appendChild(btnDiv)
                linksList.appendChild(li)

                // populate linkElement
                const linkItem = document.createElement('a');
                linkItem.className = 'linkItem';
                linkItem.setAttribute('href', localLinkItem.linkUrl);

                const linkImg = document.createElement('img');
                linkImg.setAttribute('src', localLinkItem.linkImg)

                const linkText = document.createElement('p');
                linkText.className = 'linkText';
                linkText.appendChild(document.createTextNode(localLinkItem.linkTitle));

                linkItem.appendChild(linkImg)
                linkItem.appendChild(linkText)
                linksContainer.appendChild(linkItem)
    })
}
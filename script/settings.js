const settingsBtn = document.querySelector("#settingsBtn")
const settingsOverlay = document.querySelector("#settingsOverlay")
const settingsContainer = document.querySelector("#settingsContainer")
const settingsList = document.querySelector("#settingsList")
const subsettingsList = document.querySelector("#subsettingsList")
const settingsItem = document.querySelectorAll(".settingsItem")
const subsettingsItem = document.querySelectorAll(".subsettingsItem")

const generalSettingsForm = document.querySelector("#generalSettingsForm")
const generalSaveBtn = document.querySelector("#generalSaveBtn")
const changeNameInput = document.querySelector("#changeNameInput")
const changeBirthDateInput = document.querySelector("#changeBirthDateInput")
const clearCityBtn = document.querySelector("#clearCityBtn")
const setCityInput = document.querySelector("#setCityInput")
const generalCancelBtn = document.querySelector("#generalCancelBtn")

const backgroundSubSettingList = document.querySelector("#backgroundSubSetting .subsettingList");
const BGCategories = document.querySelector('#BGCategories');
const generateBGBtn = document.querySelector('#generateBGBtn');
const setBGBtn = document.querySelector('#setBGBtn');

const mainElements = document.querySelectorAll('.mainElements')
const hideUnhideElementsList = document.querySelector('#hideUnhideSubSetting .subsettingList')

const clearSettingsBtn = document.querySelector('#clearSettingsBtn')
const clearSettingsModal = document.querySelector('#clearSettingsModal')

const editorBtnContainer = document.querySelector("#editorBtnContainer");
const editorModeBtn = document.querySelector('#editorModeBtn')
const saveEditorBtn = document.querySelector('#saveEditorBtn')
const cancelEditorBtn = document.querySelector('#cancelEditorBtn')
const defaultEditorBtn = document.querySelector('#defaultEditorBtn')
var urlBG;

loadSettings();
loadBG();
changeNameInput.setAttribute('placeholder', localStorage.getItem('localUser'))

if(localStorage.getItem('localBirthDate') != null){
    changeBirthDateInput.setAttribute('placeholder', new Date(localStorage.getItem('localBirthDate')).toLocaleDateString('en-US'))
}
if(localStorage.getItem('localCity') != null){
    setCityInput.setAttribute('placeholder', localStorage.getItem('localCity'))
    clearCityBtn.style.opacity = '.7';
    clearCityBtn.onmouseenter = function(){
        this.style.opacity = '1'
    }
    clearCityBtn.onmouseleave = function(){
        this.style.opacity = '.7'
    }
}

// event listeners
settingsBtn.addEventListener('click', toggleSettings);
settingsOverlay.addEventListener('click', toggleSettings);
settingsList.addEventListener('click', showSubsetting);

generalSettingsForm.addEventListener('submit', saveGeneralSettings)
generalSettingsForm.addEventListener('keydown', preventEnter);
generalCancelBtn.addEventListener('click', clearGeneralInputs);
clearCityBtn.addEventListener('click', clearCityFromStorage);

BGCategories.addEventListener('click', generateBG);
setBGBtn.addEventListener('click', setBG);

hideUnhideElementsList.addEventListener('click', hideUnhideElements)

clearSettingsBtn.addEventListener('click', clearSettings)
editorModeBtn.addEventListener('click', editorMode)
/********************************
   -- Event Functions --
********************************/

// load Settings
function loadSettings(){
    let elementSettings = JSON.parse(localStorage.getItem('elementSettings'));

    if(elementSettings != null){

        elementSettings.forEach(function(localElement){
            mainElements.forEach(function(mainElement){
                if(localElement.elementId == mainElement.id){

                    // isShownOrHidden
                    if(localElement.isHidden == true){
                        mainElement.style.display = 'none';
                        Array.from(hideUnhideElementsList.children).forEach(function(hideSetting){
                            if(localElement.elementId == hideSetting.getAttribute('value'))
                                hideSetting.classList.add('elementHidden');
                        })
                    }

                    // loadTransformValue
                    if(localElement.transformValue != 'none'){
                        mainElement.style.transform = localElement.transformValue
                    }

                    // loadPosition
                    if(localElement.posX != '' || localElement.posY != ''){
                        mainElement.style.left = localElement.posX
                        mainElement.style.top = localElement.posY
                    }

                }

            })
        })
    } else {
        elementSettings = []
        mainElements.forEach(function(element){
            elementSettings.unshift({elementId: element.id})
        })
        localStorage.setItem('elementSettings', JSON.stringify(elementSettings))
    }

}
// show or hide settings when button is clicked or when outside container is clicked
function toggleSettings(){
    if(settingsContainer.style.display == 'flex'){
        settingsContainer.style.animation = 'settingsMoveOut .6s forwards';
        setTimeout(function(){
            settingsContainer.style.display = 'none';
        }, 500);
        settingsBtn.style.transform = 'rotate(0deg)';
        settingsOverlay.style.display = 'none';

    } else {
        settingsContainer.style.display = 'flex'
        settingsContainer.style.animation = 'settingsMoveIn .6s forwards'
        settingsBtn.style.transform = 'rotate(120deg)'
        settingsOverlay.style.display = 'block';

    }
}

// cycle through the subsettings when the setting category is clicked
function showSubsetting(e){
    settingsItem.forEach(function(settings){
        settings.firstChild.style.fontWeight = 'initial'
        settings.style.opacity = '.9'
    })
    subsettingsItem.forEach(function(subsetting){

        if(subsetting.classList.contains(e.target.className)){
            subsetting.style.display = 'initial'
            e.target.style.fontWeight = 'bold'
            e.target.style.opacity = '1'
        } else {
            subsetting.style.display = 'none'
        }
    })
}



// General settings

    // save changes on general settings
function saveGeneralSettings(e){
    var inputs = e.target.querySelectorAll('.generalInput')
    inputs.forEach(function(input){
        if(input.value != ''){
            if(input.id == 'changeNameInput'){
                localStorage.setItem('localUser', input.value);
                greetUser();
            }
            else if (input.id == 'changeBirthDateInput'){

                localStorage.setItem('localBirthDate', new Date(input.value.replace(/-/g, '\/')));
            }
            else if (input.id == 'setCityInput'){
                localStorage.setItem('localCity', input.value);
                getWeather()
                input.placeholder = input.value
                clearCityBtn.style.opacity = '.8';

            }
            input.value = '';
            changeBirthDateInput.setAttribute('placeholder', new Date(localStorage.getItem('localBirthDate')).toLocaleDateString('en-US'))
            notifModal('General settings updated.');
        }
    })
    e.preventDefault();
}

    // prevent submitting form when enter is clicked
function preventEnter(e){
    if(e.key == 'Enter'){
        e.target.blur()
        e.preventDefault()
    }
}
// clear inputs when 'Cancel' button is clicked
function clearGeneralInputs(){
    var inputs = document.querySelectorAll('.generalInput')
    inputs.forEach(function(input){
        input.value = ''
    })
}

function clearCityFromStorage(){
    if(localStorage.getItem('localCity') != null){
        localStorage.removeItem('localCity');
        setCityInput.placeholder = 'City Name';
        notifModal('City removed from Database.');
        clearCityBtn.style.opacity = '.05';
        getWeather();
    } else {
        clearCityBtn.style.opacity = '.05';
    }

}


// Background settings

// load background on load
function loadBG(){
    
    if(localStorage.getItem('isBGSet') == 'true'){
        setBGBtn.style.borderLeft = '1px solid #4db6ac';
        generateBGBtn.style.opacity = '.7';
        content.style.background = `linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${JSON.parse(localStorage.getItem('BGInfo')).url}) no-repeat fixed center/cover`;

    } else {
        generateBGBtn.style.borderLeft = '1px solid #4db6ac';
        setBGBtn.style.opacity = '.7';
        var categoryItems = Array.from(BGCategories.children);
        var BGInfo;
        
        if(localStorage.getItem('BGInfo') == null) {
            BGInfo = {category: 'Wallpapers', url: null};
        } else {
            BGInfo = JSON.parse(localStorage.getItem('BGInfo'));
        }
    
        categoryItems.forEach(function(category){
            if(category.textContent == BGInfo.category){
                category.style.color = '#4db6ac';
                category.style.opacity = '1';
                category.style.fontWeight = '600';
                fetchBG(category.textContent);
            } 
        });

        
    }
}

// generateBGBtn event -- generates random background from selected category 
function generateBG(e){
    localStorage.setItem('isBGSet', false)

    generateBGBtn.style.borderLeft = '1px solid #4db6ac'
    generateBGBtn.style.opacity = '1'
    setBGBtn.style.borderLeft = '1px solid transparent';
    setBGBtn.style.opacity = '.6'

    var categoryItems = Array.from(BGCategories.children)
    categoryItems.forEach(function(category){
        category.style.color = 'rgb(235, 235, 235)'
        category.style.opacity = '.7'
        category.style.fontWeight = '400'
    });

    e.target.style.opacity = '1'
    e.target.style.fontWeight = '600'
    e.target.style.color = '#4db6ac'

    let BGInfo;
    if(localStorage.getItem('BGInfo') == null) {
        BGInfo = {category: 'Wallpapers', url: null};
    } else {
        BGInfo = JSON.parse(localStorage.getItem('BGInfo'));
    }

    BGInfo.category = e.target.textContent;
    fetchBG(BGInfo.category);

    localStorage.setItem('BGInfo', JSON.stringify(BGInfo));
    notifModal(`Background set to ${e.target.textContent}`);
}   

// powered by unsplash api --
function fetchBG(category){
    fetch(`https://source.unsplash.com/1920x1080/?${category}`)
    .then( data => {
        if(data.status == '404'){
            BGElement.style.background = 'linear-gradient(to right, #232526, #414345)';
        } else {
            content.style.background =`linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${data.url}) no-repeat fixed center/cover`;
            urlBG = data.url;
        }
    })
}

// setBGBtn event --set current background as default. stops generating random background on every reload.
function setBG(){
    setBGBtn.style.borderLeft = '1px solid #4db6ac';
    generateBGBtn.style.borderLeft = '1px solid transparent';
    generateBGBtn.style.opacity = '.6'
    setBGBtn.style.opacity = '1'

    var categoryItems = Array.from(BGCategories.children)
    categoryItems.forEach(function(category){
        category.style.color = 'rgb(235, 235, 235)'
        category.style.fontWeight = '400'
        category.style.opacity = '.7'
    });

    localStorage.setItem('isBGSet', true)
    let BGInfo;

    if(localStorage.getItem('BGInfo') == null) {
        BGInfo = {category: 'Wallpapers', url: ''};
    } else {
        BGInfo = JSON.parse(localStorage.getItem('BGInfo'));
    }
    BGInfo.url = urlBG
    localStorage.setItem('BGInfo', JSON.stringify(BGInfo));
    notifModal('Current background set to default.')
}


// Hide/Unhide Elements settings
function hideUnhideElements(e){
    let elementSettings = JSON.parse(localStorage.getItem('elementSettings'));
    e.target.classList.toggle('elementHidden');

    if(e.target.classList.contains('elementHidden')){
        mainElements.forEach(function(element){
            if(e.target.getAttribute('value') == element.id){
                element.style.display = 'none';
                
                elementSettings.forEach(function(localElement){
                    if(element.id == localElement.elementId){
                        localElement.isHidden = true;
                    }
                })
            }
        });
    } else {
        mainElements.forEach(function(element){
            if(e.target.getAttribute('value') == element.id){
                element.style.display = 'flex';

                elementSettings.forEach(function(localElement){
                    if(element.id == localElement.elementId){
                        localElement.isHidden = false;
                    }
                })
            }
        });
    }
    localStorage.setItem('elementSettings', JSON.stringify(elementSettings))
}


// clear all settings
function clearSettings(){
    const clearSettingsBtnContainer = document.querySelector('#clearSettingsBtnContainer')
    content.style.filter = 'blur(8px) brightness(20%)';
    clearSettingsModal.style.display = 'flex';

    clearSettingsBtnContainer.addEventListener('click', function(e){
        if(e.target.id == 'clearConfirmBtn'){
            localStorage.clear();
            location.reload();
        } else if(e.target.id == 'clearCancelBtn'){
            clearSettingsModal.style.display = 'none';
            content.style.filter = 'none';

        }
    })
}


// editor mode
function editorMode(){

    editorBtnContainer.style.display = 'flex'
    settingsBtn.style.display = 'none';
    settingsContainer.style.animation = 'settingsMoveOut .6s forwards';
    setTimeout(function(){
        settingsContainer.style.display = 'none';
    }, 500);
    settingsOverlay.style.display = 'none';

    // enable editorBtn events
    saveEditorBtn.addEventListener('click', setElementPositions)
    cancelEditorBtn.addEventListener('click', loadSettings)
    cancelEditorBtn.addEventListener('click', exitEditorMode)
    defaultEditorBtn.addEventListener('click', defaultEditorSettings)



    mainElements.forEach(function(element){
        // create an overlay for each elements
        var overlay = document.createElement('div');
        var scaleUp = document.createElement('a');
        var scaleDown = document.createElement('a');
        overlay.className = 'editorOverlay';
        scaleUp.className = 'scaleUp';
        scaleUp.innerHTML = '<i class="fas fa-plus"></i>'
        scaleDown.innerHTML = '<i class="fas fa-minus"></i>'
        scaleDown.className = 'scaleDown';
        overlay.appendChild(scaleUp)
        overlay.appendChild(scaleDown)
        element.appendChild(overlay);

        //prevent taskElement to auto height bottom
        if(element.id == 'todoElement'){
            element.style.removeProperty('bottom');
        }

        overlay.addEventListener('click', scaleElement);
        overlay.addEventListener('click', dragElement(element));

        
    })

}

function scaleElement(e){
    var numberPattern = /-?\d+\.?\d*/g;
    var matrixValue = window.getComputedStyle(e.target.parentElement.parentElement.parentElement).transform.match(numberPattern).map(Number);
    if(e.target.classList.contains('fa-plus')){
        matrixValue[0] += .05;
        matrixValue[3] += .05;

    } else if(e.target.classList.contains('fa-minus')){
        matrixValue[0] -= .05;
        matrixValue[3] -= .05;
    }

    // append new values --looping causes some problems.
    this.parentElement.style.transform = `matrix(${matrixValue[0]}, ${matrixValue[1]}, ${matrixValue[2]}, ${matrixValue[3]}, ${matrixValue[4]}, ${matrixValue[5]})`;
}


function dragElement(element){
    var pos1 = 0, pos2 = 0;
    element.onmousedown = dragMouseDown;

    element.ontouchstart = dragTouchStart;

    // mouse events
    function dragMouseDown(e){
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        content.onmouseup = closeDragElement;
        content.onmousemove = elementDrag;

        function elementDrag(e){
            e.preventDefault();
    
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
        }
        function closeDragElement(){
            content.onmouseup = null;
            content.onmousemove = null;
    
        }
    }

    // touch events
    function dragTouchStart(e){
        // e.preventDefault();
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        content.ontouchend = closeDragElementTouch;
        content.ontouchmove = elementDragTouch;

        function elementDragTouch(e){
            e.preventDefault();
    
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
        }

        function closeDragElementTouch(){
            content.ontouchend = null;
            content.ontouchmove = null;

        }
    }
}


function  defaultEditorSettings(){
    var elementSettings = JSON.parse(localStorage.getItem('elementSettings'));
    elementSettings.forEach(function(localElement){
        delete localElement.posX;
        delete localElement.posY;
        delete localElement.transformValue;
    });
    localStorage.setItem('elementSettings', JSON.stringify(elementSettings));
    location.reload();

}

function setElementPositions(){
    var elementSettings = JSON.parse(localStorage.getItem('elementSettings'));
    elementSettings.forEach(function(localElement){

        mainElements.forEach(function(elem){
            if(elem.style.display != 'none'){
                if(localElement.elementId == elem.id){
                    localElement.posX = elem.style.left;
                    localElement.posY = elem.style.top;

                    // height width
                    localElement.transformValue = window.getComputedStyle(elem).transform;


                }
            }
        })

    })
    localStorage.setItem('elementSettings', JSON.stringify(elementSettings));
    location.reload();

}


function exitEditorMode(){
    // temporary
    location.reload();

    // var elementSettings = JSON.parse(localStorage.getItem('elementSettings'));
    // elementSettings.forEach(function(localElement){
    //     console.log(localElement)
    // })

    // editorBtnContainer.style.display = 'none'
    // settingsBtn.style.display = 'initial';
    //     setInterval(function(){
    //     toggleSettings

    // },100)




}



// https://stackoverflow.com/questions/50592957/get-title-of-external-page-using-javascript
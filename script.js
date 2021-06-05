var content = document.querySelector('#content');
var localUserName = localStorage.getItem('localName');
var localUserCity = localStorage.getItem('localCity');
var urlBG;
var searchForm = document.querySelector("#searchForm");
// todo variables
var taskForm = document.querySelector("#taskForm");
var taskInput = document.querySelector("#taskInput");
var taskList = document.querySelector("#taskList");
var clearBtn = document.querySelector("#clearBtn");
var taskText = document.querySelectorAll('.taskText');
//settings
var settingsBtn = document.querySelector("#settingsBtn")
var editorDone = document.querySelector("#editorDone");
var editorDefault = document.querySelector("#editorDefault")

if(localStorage.getItem('localSettings') == null){
    var localSettings = [{elementID: 'timeElement'}, {elementID: 'greetElement'}, {elementID: 'weatherElement'}, {elementID: 'searchElement'}, {elementID: 'taskElement'}, {elementID: 'linksElement'}]
    localStorage.setItem('localSettings', JSON.stringify(localSettings));
}

window.onload = function(){
    generateBG();
    setBG();
    setInterval(time, 1000);
    loadTasks();
    loadSettings();
    if(localUserName == null){
        getName();
    }
    if(localUserName != null){
        greeting();
    }

    if(localUserCity != null){
        // run every 10 mins
        setInterval(weather(), 600000);
    }


    searchForm.addEventListener('submit', search);
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeTask);
    clearBtn.addEventListener('click', clearTasks);
    taskList.addEventListener('click', finishTask);
}


// search --google search
function search(e){
    var searchInput = document.querySelector("#searchInput");
    window.open(`https://www.google.com/search?q=${searchInput.value}`, '_blank');
    searchInput.value = '';
    e.preventDefault();

}

//TODO - load tasks from localStorage
function loadTasks(){
   
    if(localStorage.getItem('tasks') != null){
        var localTasks = JSON.parse(localStorage.getItem('tasks'));
        localTasks.forEach(function(task) {
            const li = document.createElement('li');
            li.className = 'listItem';

            const link = document.createElement('a');
            link.className = 'taskText';
            if(task.taskStatus == true){
                link.className += ' taskDone';
            }
            link.appendChild(document.createTextNode(task.taskName));

            const deleteTask = document.createElement('a');
            deleteTask.className = 'deleteTask secondary-content';

            deleteTask.innerHTML = `<i class="material-icons">close</i>`;
            
            li.appendChild(link);
            li.appendChild(deleteTask);
            taskList.appendChild(li);
        })
    }

}

//TODO - add task
function addTask(e){
    if(/\S/.test(taskInput.value)) {

        const li = document.createElement('li');
        li.className = 'listItem';

        const link = document.createElement('a');
        link.className = 'taskText';
        link.appendChild(document.createTextNode(taskInput.value));

        const deleteTask = document.createElement('a');
        deleteTask.className = 'deleteTask secondary-content';
        deleteTask.innerHTML = `<i class="material-icons">close</i>`;
        
        li.appendChild(link);
        li.appendChild(deleteTask);
        taskList.appendChild(li);
        var taskObj = {taskName: taskInput.value, taskStatus: false};
        console.log(taskObj.taskStatus)

        var localTasks;
        if(localStorage.getItem('tasks') === null){
            localTasks = [];
        } else {
            localTasks = JSON.parse(localStorage.getItem('tasks'));
        }
        localTasks.push(taskObj);
        localStorage.setItem('tasks', JSON.stringify(localTasks));

        taskInput.value = '';
        e.preventDefault();

    } 
     e.preventDefault();
}

//TODO - delete task
function removeTask(e){
    if(e.target.parentElement.classList.contains('deleteTask')) {


        var localTasks = JSON.parse(localStorage.getItem('tasks'));
        localTasks.forEach(function(task, index) {

            if(e.target.parentElement.parentElement.textContent == task.taskName  + 'close') {
               localTasks.splice(index, 1)
            }
        });
      
        localStorage.setItem('tasks', JSON.stringify(localTasks))
        e.target.parentElement.parentElement.remove();

    }       
}
//TODO - clear all tasks
function clearTasks(){
    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild)
   }
   localStorage.removeItem('tasks')
}

//TODO - mark task as finished
function finishTask(e){
    var localTasks = JSON.parse(localStorage.getItem('tasks'));

    if(e.target.className == 'taskText'){
        e.target.className += ' taskDone';
        localTasks.forEach(function(task) {
            if(e.target.textContent == task.taskName) {
               task.taskStatus = true;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(localTasks));

    } else if(e.target.classList.contains('taskDone')){
        e.target.classList.remove('taskDone');

        localTasks.forEach(function(task) {
            if(e.target.textContent == task.taskName) {
               task.taskStatus = false;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(localTasks));
    }

}

// generate background --unsplash
function generateBG(){
    var BGElement = document.querySelector('#content');
    var localBG = localStorage.getItem('localBG');

    if(localBG == null){
        fetch("https://source.unsplash.com/1920x1080/?nature")
            .then( data => {
            if(data.status == '404'){
                BGElement.style.background = 'linear-gradient(to right, #232526, #414345)';
            } else {
                BGElement.style.background =`linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${data.url}) no-repeat fixed center/cover`;
                urlBG = data.url;
            }
        });
    } else {
        BGElement.style.background =`linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${localBG}) no-repeat fixed center/cover`;
    }

}

// set or generate random BG
function setBG(){
    var setBG = document.querySelector("#setBG");
    var setBGnotif = document.querySelector("#setBGnotif");

    var removeBG = document.querySelector("#removeBG");
    var localBG = localStorage.getItem('localBG');

    setBG.addEventListener('click', function(){
        localStorage.setItem('localBG', urlBG);
        setBG.style.display = 'none';
        removeBG.style.display = 'block';
        setBGnotif.style.display = 'block';
        setBGnotif.textContent = 'Background Set!'
        setTimeout(function(){
            setBGnotif.style.display = 'none';
        },1500);

    });
    removeBG.addEventListener('click', function(){
        localStorage.removeItem('localBG');
        removeBG.style.display = 'none';
        setBG.style.display = 'block';
        setBGnotif.style.display = 'block';
        setBGnotif.textContent = 'Background Removed.'
        setTimeout(function(){
            setBGnotif.style.display = 'none';
        },1500);
        generateBG();

    });

    if(localBG == null){
        removeBG.style.display = 'none';
    } else {
        setBG.style.display = 'none';
    }
    
}


// getName - get the name of user
function getName(){
    localStorage.removeItem('localName');
    var nameForm = document.querySelector("#nameForm");
    var nameInput = document.querySelector("#nameInput");
    var userInfoElement = document.querySelector("#userInfo");
    var name404 = document.querySelector("#name404");

    document.querySelector('#content').style.filter = 'blur(8px) brightness(30%)';
    userInfoElement.style.display = 'block';
    nameForm.addEventListener('submit', function(e){
        if(/^[a-zA-Z]+$/.test(nameInput.value)) {
            // localUserName = nameInput.value;
            localUserName = (nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1));
            localStorage.setItem('localName', localUserName);
            userInfoElement.style.display = 'none';
            document.querySelector('#content').style.filter = 'none';
            if(localStorage.getItem('localCity') == null){
                getCity();
            }
            nameInput.value = '';
            greeting();
            e.preventDefault();
        } else{
            name404.textContent = `Please enter a valid input.`;
            name404.style.display = 'block';
            setTimeout(function(){
                name404.style.display = 'none';
            },2500);
            nameInput.value = '';
        }
    });

}

// get city of user
function getCity(){
    var cityForm = document.querySelector("#cityForm")
    var cityInput = document.querySelector("#cityInput");
    var userCityElement = document.querySelector("#userCity");
    var citySpan = document.querySelector("#citySpan");

    citySpan.textContent = `${localStorage.getItem('localName')}?`;
    document.querySelector('#content').style.filter = 'blur(8px) brightness(30%)';
    userCityElement.style.display = 'block';
    cityForm.addEventListener('submit', function(e){
        localUserCity = cityInput.value;
        localStorage.setItem('localCity', localUserCity);
        userCityElement.style.display = 'none';
        document.querySelector('#content').style.filter = 'none';
        location.reload();
        e.preventDefault();
    });

}

// news();
// function news(){
//     fetch("https://google-news1.p.rapidapi.com/top-headlines?country=US&lang=en", {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "9a54e86360msh1c5bfe91b4c09b8p1ec23ajsn13e8d03e293b",
//             "x-rapidapi-host": "google-news1.p.rapidapi.com"
//         }
//     })
//     .then(response => {
//         console.log(response.body[0]);

//     })
//     .catch(err => {
//         console.error(err);
//     });
// }




//openweather api
function weather(){
    const openWeatherKey = '7ad0d69ac0442c9c96dbeee5b7a93263';
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${localUserCity}&appid=${openWeatherKey}`;
    var city404 = document.querySelector("#city404");

    fetch(url).then((response)=>{
        return response.json();
    }).then(data => {
        if(data.cod == '404'){
            getCity();
            city404.style.visibility = 'visible';
            // document.querySelector("#userCity p").style.marginBottom = '0'
            city404.innerHTML = `Sorry, '${localUserCity}' is not found in the system. <br>Please enter a different city.`;
            setTimeout(function(){
                city404.style.visibility = 'hidden';
            },3500);
        } else {
            localStorage.setItem('localCity', data.name);
            var weatherCity = document.querySelector("#weatherCity");
            var weatherTemp = document.querySelector("#weatherTemp");
            var weatherConditionImg = document.querySelector("#weatherConditionImg");
            var weatherConditionText = document.querySelector("#weatherConditionText");

            weatherCity.innerHTML = `<i class="material-icons">location_on</i> ${data.name}, ${data.sys.country}`;
            weatherTemp.style.cursor = 'pointer';

            if(localStorage.getItem('tempUnit') == null || localStorage.getItem('tempUnit') == 'fahrenheit'){
                weatherTemp.innerHTML = `${Math.round((data.main.temp -273.15) * 9/5 + 32 )} <small> °F</small>`;
            } else {
                weatherTemp.innerHTML = `${Math.round(data.main.temp -273.15)} <small> °C</small>`;
            }
            weatherTemp.addEventListener('click', function(){
                if(localStorage.getItem('tempUnit') == 'fahrenheit'){
                    weatherTemp.innerHTML = `${Math.round(data.main.temp -273.15)} <small> °C</small>`;
                    localStorage.setItem('tempUnit', 'celsius');
                } else {
                    weatherTemp.innerHTML = `${Math.round((data.main.temp -273.15) * 9/5 + 32 )} <small> °F</small>`;
                    localStorage.setItem('tempUnit', 'fahrenheit');
    
                }
            })
            weatherConditionImg.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
            weatherConditionText.textContent = data.weather[0].description;
        }  
    })
}

//get current time
function time(){

    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;

    var time = `${hours}:${minutes} ${ampm}`;
    document.querySelector("#timeElement p").textContent = time;

}

// greet user
function greeting(){
    var greetText = document.querySelector("#greetText");
    var hours = new Date().getHours();
    var localUserName = localStorage.getItem('localName');
    var greeting;

    if(hours < 12){
        greeting = 'Good morning';
    } else if(hours >= 12 && 18 >= hours){
        greeting = 'Good afternoon';
    } else{
        greeting = 'Good evening'
    }
    greetText.textContent = `${greeting}, ${localUserName}!`;
}


//settings variables
var settingsBtn = document.querySelector("#settingsBtn");
var settingsDrop = document.querySelector("#settingsDrop");
var editorModeBtn = document.querySelector("#editorMode");
var hideOnClick = document.querySelector("#hideOnClick");

settingsBtn.addEventListener('click', hideUnhideSettings);
settingsDrop.addEventListener('click', settings);

// toggle settings list on button click
function hideUnhideSettings(){

    if(settingsDrop.style.transform == 'translateX(0px)'){
        settingsDrop.style.transform = 'translateX(-150%)';
        settingsDrop.style.animation = 'moveOut .8s';
        settingsBtn.style.opacity = '.6'
        hideOnClick.style.display = 'none';

    } else {
        settingsDrop.style.transform = 'translateX(0)';
        settingsDrop.style.animation = 'moveIn .8s';
        settingsBtn.style.opacity = '1'
        hideOnClick.style.display = 'block';
    }
}

//hide settings dropdown on click
hideOnClick.addEventListener('click', function(){
    settingsDrop.style.transform = 'translateX(-150%)';
    settingsDrop.style.animation = 'moveOut .8s';
    settingsBtn.style.opacity = '.6'
    hideOnClick.style.display = 'none';
})

// settings drop down function
function settings(e){
    // console.log(e.target.id)
    switch(e.target.id) {
        case 'editorMode':
            editorMode();
            break;
        case 'setBG':
            //
            break;
        case 'removeBG':
            //
            break;
        case 'settingsName':
            getName();
        break;
        case 'settingsCity':
            getCity();
        break;
        default:
            showHideElem(e)
            break;
      }

}

//show or hide elements
function showHideElem(e){
    var element = document.querySelectorAll(`.${e.target.classList[0]}`);
    element = document.querySelectorAll(`.${e.target.classList[0]}`);
    var localSettings = JSON.parse(localStorage.getItem('localSettings'));

    e.target.classList.toggle('taskDone');
    if(e.target.classList.contains('taskDone')){
        element[1].style.display = 'none';
        localSettings.forEach(function(localElem){

            if(element[1].id == localElem.elementID){
                localElem.elementDisplay = false;
            }
        })
        localStorage.setItem('localSettings', JSON.stringify(localSettings))
    } else {
        element[1].style.display = 'block';
        localSettings.forEach(function(localElem){

            if(element[1].id == localElem.elementID){
                localElem.elementDisplay = true;
            }
        })
        localStorage.setItem('localSettings', JSON.stringify(localSettings))
    }

}

//load saved settings from local storage
function loadSettings(){
    var localSettings = JSON.parse(localStorage.getItem('localSettings'));
    var settingsDropElement;
    var element;

    localSettings.forEach(function(localElem){
        element = document.querySelector(`#${localElem.elementID}`);

        if(localElem.elementDisplay != null){
            // element = document.querySelector(`#${localElem.elementID}`);
            settingsDropElement = document.querySelectorAll(`.${element.classList[1]}`)
            if(localElem.elementDisplay == false){
                settingsDropElement[0].className += ' taskDone'
                element.style.display = 'none';
            }
        }
        if(localElem.posX != null){
            // element = document.querySelector(`#${localElem.elementID}`);
            element.style.left = localElem.posX;
            element.style.top = localElem.posY;
        }
        if(localElem.scale != null){
            // element = document.querySelector(`#${localElem.elementID}`);
            element.style.transform = localElem.scale;
        }

    })
}

// editor mode
function editorMode(){
    var editorDone = document.querySelector("#editorDone")
    var editorDefault = document.querySelector("#editorDefault")
    var settingsBtn = document.querySelector("#settingsBtn")
    var settingsDrop = document.querySelector("#settingsDrop");
    var elements = document.querySelectorAll('.mainElements');
    settingsDrop.style.animation = 'moveOut .5s';
    settingsDrop.style.transform = 'translateX(-150%)';
    hideOnClick.style.display = 'none';

    // var overlay = document.createElement('div');
    // var scaleUp = document.createElement('a');
    // var scaleDown = document.createElement('a');
    

    elements.forEach(function(elem){
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
        elem.appendChild(overlay);

        //prevent taskElement to auto height bottom
        if(elem.id == 'taskElement'){
            elem.style.removeProperty('bottom');
        }
        elem.addEventListener('click', dragElement(elem));
        elem.addEventListener('click', function(e){
            if(e.target.className =='scaleUp' || e.target.classList.contains('fa-plus')){
                if(this.style.transform.charAt(0) != 't'){
                    this.style.transform = 'translate(-50%, -50%) scale(1.1)';
                } else {
                    this.style.transform += ' scale(1.1)'
                }

            } else if (e.target.className =='scaleDown' || e.target.classList.contains('fa-minus')){
                if(this.style.transform.charAt(0) != 't'){
                    this.style.transform = 'translate(-50%, -50%) scale(.9)';
                } else {
                    this.style.transform += ' scale(.9)'
                }
            }

        });

        
    })
    editorDone.style.display = 'block';
    editorDefault.style.display = 'block';
    settingsBtn.style.display = 'none';
}



function dragElement(element){
    var pos1 = 0, pos2 = 0;
    // console.log(element)
    element.onmousedown = dragMouseDown;
    function dragMouseDown(e){
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        content.onmouseup = closeDragElement;
        content.onmousemove = elementDrag;
    }
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


editorDone.addEventListener('click', setElementPositions);
editorDefault.addEventListener('click', clearElementPositions);

function setElementPositions(){
    var elements = document.querySelectorAll('.mainElements');
    var localSettings = JSON.parse(localStorage.getItem('localSettings'));
    var elements = document.querySelectorAll('.mainElements');

    localSettings.forEach(function(localElem){

        elements.forEach(function(elem){
            if(localElem.elementID == elem.id){
                localElem.posX = elem.style.left;
                localElem.posY = elem.style.top;

                // height width
                localElem.scale = window.getComputedStyle(elem).transform;

            }
        })

    })
    localStorage.setItem('localSettings', JSON.stringify(localSettings));
    location.reload();

}

function clearElementPositions(){
    var localSettings = JSON.parse(localStorage.getItem('localSettings'));
    localSettings.forEach(function(){

        localSettings.forEach(function(elem){
                delete elem.posX;
                delete elem.posY;
                delete elem.scale;
        })

    })
    localStorage.setItem('localSettings', JSON.stringify(localSettings));
    location.reload();
}

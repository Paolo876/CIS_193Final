// variables
const content = document.querySelector("#content")
const timeElement = document.querySelector("#timeElement");
const timeText = document.querySelector("#timeText");
const greetElement = document.querySelector("#greetElement");
const weatherElement = document.querySelector("#weatherElement");
const searchElement = document.querySelector("#searchElement");
const searchForm = document.querySelector("#searchForm");
const todoElement = document.querySelector("#todoElement");
const linksElement = document.querySelector("#linksElement");

// load functions
window.onload = function (){
    initialPrompts()
    setInterval(getTime, 1000);
    greetUser();
    locationPrompt();
}


//event listeners
timeText.addEventListener('click', changeTimeFormat);
searchForm.addEventListener('submit', search);


function initialPrompts(){
    if(localStorage.getItem('localUser') == null || localStorage.getItem('localUser') == ''){
        getName();
    }
}

// notification modal function --displays pop-up notification
function notifModal(message){
    const modalElement = document.createElement('div');
    const modalOverlay = document.createElement('div');
    const modalText = document.createElement('p');
    modalElement.setAttribute('id', 'modalElement');
    modalOverlay.setAttribute('id', 'modalOverlay');
    modalText.setAttribute('id', 'modalText');
    modalText.textContent = message;
    modalElement.appendChild(modalText);
    document.body.appendChild(modalOverlay);
    document.body.appendChild(modalElement);
    
    setInterval(function(){
        modalOverlay.style.display = 'none';
    }, 2000);

    modalOverlay.onclick = function(){
        modalElement.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

}


/********************************
    -- Init Functions --
********************************/

function locationPrompt(){
    navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
        getWeather();
        permissionStatus.onchange = function() {
            // ask user for a city
          if(this.state =='granted'){
              getWeather()
          } else {
              if(localStorage.getItem('localCity') == null){
                getCity();

              }
          }
          location.reload();
        };
      });
}

//ask for name of user
function getName(){
    const getNameElement = document.querySelector("#getNameElement");
    const getNameForm = document.querySelector("#getNameForm");
    const getNameInput = document.querySelector("#getNameInput");

    content.style.filter = 'blur(8px) brightness(30%)';
    getNameElement.style.display = 'flex';
    getNameInput.focus();

    getNameForm.addEventListener('submit', (e)=>{
        if(/\S/.test(getNameInput.value)){
            localStorage.setItem('localUser', getNameInput.value);
            getNameInput.value = '';
            getNameElement.style.display = 'none';
            content.style.filter = null;
            greetUser();
        } else {
            notifModal('Please Enter a valid input.')
            getNameInput.value = '';
        }

        e.preventDefault();
    })
}

function getCity() {
    const getCityElement = document.querySelector("#getCityElement");
    const getCityForm = document.querySelector("#getCityForm");
    const getCityInput = document.querySelector("#getCityInput");

    content.style.filter = 'blur(8px) brightness(30%)';
    getCityElement.style.display = 'flex';
    getCityInput.focus();

    getCityForm.addEventListener('submit', (e)=>{
        localStorage.setItem('localCity', getCityInput.value);
        getCityInput.value = '';
        getCityElement.style.display = 'none';
        content.style.filter = null;
        getWeather()
        e.preventDefault();
    })
  
}

// getTime --runs every second, gets the current time.
function getTime(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var hourFormat = localStorage.getItem('hourFormat');
    var time;
    if(hourFormat == null || hourFormat == '12hr'){
        var ampm = hours >= 12 ? 'pm' : 'am';
        hourFormat = '12hr';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        time = `${hours}:${minutes} ${ampm}`;
        localStorage.setItem('hourFormat', hourFormat);
    } else {
        if(hours < 10){
            hours = '0' + hours;
        }
        hourFormat = '24hr';
        time = `${hours}:${minutes}`;
        localStorage.setItem('hourFormat', hourFormat)
    }
    document.querySelector("#timeText").textContent = time;
}

// greetUser --greets the user.
function greetUser(){
    const greetText = document.querySelector("#greetText");
    var hours = new Date().getHours();
    var greeting;
    var localUser = localStorage.getItem('localUser');
    if(hours < 12){
        greeting = 'Good morning';
    } else if(hours >= 12 && hours <= 18){
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }
    greetText.textContent = `${greeting}, ${localUser}!`;
}

//getWeather
function getWeather(){
    const openWeatherKey = '7ad0d69ac0442c9c96dbeee5b7a93263';
    var url;
    if(localStorage.getItem('localCity') != null){
       url =  `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('localCity')}&appid=${openWeatherKey}`;
       openWeatherInfo(url)
    }else {
        navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
            if(permissionStatus.state == 'granted'){

                navigator.geolocation.getCurrentPosition(function(position){
                    let lat = position.coords.latitude;
                    let lon = position.coords.longitude;
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}`;
                    openWeatherInfo(url)
                });
            } else {
                getCity();
            }
        })
        
    }
}

// powered by openweathermap.org (free api) --
function openWeatherInfo(url){
    const weatherText = document.querySelector("#weatherText");
    const weatherTemp = document.querySelector("#weatherTemp");
    const weatherConditionImg = document.querySelector("#weatherConditionImg");
    const weatherConditionStatus = document.querySelector("#weatherConditionStatus");

        fetch(url)
            .then((response)=>{
                return response.json();
            }).then(data =>{
                weatherText.innerHTML = `<span><i class="material-icons">location_on</i></span> ${data.name}, ${data.sys.country}`;
                weatherTemp.style.cursor = 'pointer'



                var tempUnit = localStorage.getItem('tempUnit');
                if(tempUnit == null || tempUnit == 'fahrenheit'){
                    temperature = Math.round((data.main.temp - 273.15) * 9/5 + 32);
                    weatherTemp.innerHTML = `<p>${temperature} <small>°F</small></p>`;
                    if(tempUnit == null){
                        localStorage.setItem('tempUnit', 'fahrenheit');
                    }
                } else {
                    temperature = Math.round(data.main.temp - 273.15);
                    weatherTemp.innerHTML = `<p>${temperature} <small>°C</small></p>`;
                }

                weatherTemp.addEventListener('click', function(){
                    changeTempUnit(data.main.temp);
                    notifModal('Temperature unit changed.');
                });
                weatherConditionImg.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                weatherConditionStatus.textContent = data.weather[0].description;

            });
}

// function getLink(e) {
//     // const addLinkInput = document.querySelector('#addLinkInput')
//     const addQuickLinkInput = document.querySelector('#addQuickLinkInput')
//     // para sa title
//     // http://textance.herokuapp.com/title/
//     // favicon
//     // https://s2.googleusercontent.com/s2/favicons?domain_url
//     console.log(e.target)
//     if(e.target.id == 'addLinkBtn'){
//         toggleSettings()

//         settingsItem.forEach(function(settings){
//             settings.firstChild.style.fontWeight = 'initial'
//             settings.style.opacity = '.9'
//             if(settings.firstChild.classList.contains('quickLinkSetting')){
//                 settings.firstChild.style.fontWeight = 'bold'
//                 console.log(';asd')
//                 subsettingsItem.forEach(function(subsetting){
//                     if(subsetting.classList.contains('quickLinkSetting')){
//                         subsetting.style.display = 'initial'
//                     } else {
//                         subsetting.style.display = 'none'
//                     }
//                 })
//             }

//         })

//         addQuickLinkInput.style.background = 'red';
//         addQuickLinkInput.focus()

//     }
// }



/********************************
   -- Event Functions --
********************************/

//timeElement click -change time format 24hrs/12hrs
function changeTimeFormat(){
    var hourFormat = localStorage.getItem('hourFormat');
    if(hourFormat == '12hr'){
        hourFormat = '24hr';
    } else {
        hourFormat = '12hr';
    }
    localStorage.setItem('hourFormat', hourFormat)
    notifModal('Time format changed.')
}

// weatherTemp click -change temperature unit celsius/fahrenheit
function changeTempUnit(temp){
    var tempUnit = localStorage.getItem('tempUnit');
    var temperature;
    if(tempUnit == 'celsius'){
        // tempUnit = 'celsius';
        temperature = Math.round((temp - 273.15) * 9/5 + 32);
        weatherTemp.innerHTML = `<p>${temperature} <small>°F</small></p>`;
        localStorage.setItem('tempUnit', 'fahrenheit')
    } else {
        // tempUnit = 'fahrenheit';
        temperature = Math.round(temp - 273.15);
        weatherTemp.innerHTML = `<p>${temperature} <small>°C</small></p>`;
        localStorage.setItem('tempUnit', 'celsius')
    }
}

function search(e){
    var searchInput = document.querySelector("#searchInput");
    window.open(`https://www.google.com/search?q=${searchInput.value}`, '_blank');
    searchInput.value = '';
    e.preventDefault();

}


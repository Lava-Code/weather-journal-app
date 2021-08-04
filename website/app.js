
/* Global Variables */
const baseUrl = 'http://localhost:7000';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// intiate a key value and add country for US
const APK = ',us&appid=bbe4208ef67714d2b717906b03378426&units=metric';

// Create a new date instance dynamically with JS
let d = new Date();
// fix the month value when start from 0
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// Add EventListener to the button to performe the main function
document.getElementById('generate').addEventListener('click', performAction);

function performAction(evt){
    let zipCode = document.getElementById('zip').value;
    let myFeeling = document.getElementById('feelings').value;
    getWeatherApi(apiUrl+zipCode+APK)
        .then((dataToPost)=> {
            // check the returned value to avoid undified while error
            if (dataToPost){let temp = dataToPost.main.temp
            postWeatherData(baseUrl + '/post', { temp: temp, date: newDate, myFeeling: myFeeling })
            // Because we used promises chaing, the retuned data here reflecting the last posted data
            .then((data)=>{
              getMyData(baseUrl + '/get')
              // The value that it returns is passed to the next .then which will be as argument in updateUI function
              .then(() =>{
                  updateUI(data.temp, data.date, data.myFeeling);
              })  
            })
            }
         });
};

// Create GET request to Weather API
// Async is waiting for postData to finish before excute the next line code.
const getWeatherApi = async (url = '') =>{
    // Wait until the API respond (reach the url and response) and move to try.
    const response = await fetch(url)
    try {
        const weatherData = await response.json();
        // Handle Errror 404 invalid zip code out of catch by alarm message.
        if (weatherData['cod'] == 404 || weatherData['cod'] == 400) {
            alert((`${weatherData['message']}. The entered Zip code does not exist in US`));
            // Reject the promise to avoid return bad data to the callback function.
            Promise.reject;
        }else{
           return weatherData; 
        }   
    }catch(error){
        console.log('Error is:' + error.response.data);
    };
};

// Create POST request to save weather data in our endpoint
// Async is waiting for postData to finish before excute the next line code.
const postWeatherData = async (url='', data = {}) => {
    // Wait until the API respond (reach the url and respond) and move to try.
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data),
    });
    try{
        // Wait until the API respond (convert the response to JSON) and return the result.
        const dataToPost = await response.json();
        return dataToPost;
    }catch(error){
        console.log('Error in :',error);
    };
};

// Create GET request to end point
const getMyData = async (url='') =>{
    // Wait until the API respond(reach the url and respond) and move to try.
    const request = await fetch(url)
    try{
        // Wait until the API respond (convert the response to JSON) and return the result.
        const data = await request.json();
        // console.log(data);
        return data;
    }catch(error){
        console.log('Error in :',error);
    };
};

// Update UI with server data
function updateUI(temp, date, feeling){
    // Selct the target element form DOM and update it with new value.
    document.getElementById('date').innerHTML = date;
    document.getElementById('temp').innerHTML = temp;
    document.getElementById('content').innerHTML = feeling;
}
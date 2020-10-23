//TO PUT IN ENV =+>
const APIKEY = 'AIzaSyCem5-tCnvPw8dxnEvJO54DVo7Mu3DECBw';

/* SEARCH FUNCTION */
const search = async (query, type, pageToken = null) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params:{ 
            key: APIKEY ,
            q : query,
            type: type,
            part: 'snippet',
            pageToken : pageToken
        }
    });
    console.log(response.data);
}

/* const fetchVideoData =  async (id) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params:{ 
            key: APIKEY,
            part: 'statistics, snippet',
            id: id,
           // fields: 'items(statistics)'
        }
    });
    console.log(response.data);
}

// W6NZfCO5SIk */

const type = document.querySelector('#type');
const searchKw = document.querySelector('#search_kw');
let timeoutId;

const onInput = e => {
    
    // to prevent overloading requests, make sure the search request happen only if the user hasn't 
    // enter any other characters for the previous 1 sec period
    if(timeoutId){
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(()=>{
        search(e.target.value, type.value);
    }, 1000);
    
}

searchKw.addEventListener('input', onInput);
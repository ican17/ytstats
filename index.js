//TO PUT IN ENV =+>
const APIKEY = 'AIzaSyCem5-tCnvPw8dxnEvJO54DVo7Mu3DECBw';

/* SEARCH FUNCTION */
const search = async (query, type, pageToken = null) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            key: APIKEY,
            q: query,
            type: type,
            part: 'snippet',
            pageToken: pageToken
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


const onInput = e => {
    search(e.target.value, type.value);
}

const onTypeChange = e => {
    if(searchKw.value.trim().length > 0 ){
        search(e.target.value, type.value);
    }
}

searchKw.addEventListener('input', debounce(onInput));
type.addEventListener('change', onTypeChange);
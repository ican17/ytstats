//TO PUT IN ENV =+>
const APIKEY = 'AIzaSyCem5-tCnvPw8dxnEvJO54DVo7Mu3DECBw';

/* SEARCH FUNCTION */
const search = async (query, type, pageToken = null) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            key: APIKEY,
            q: query.trim(),
            type: type,
            part: 'snippet',
            pageToken: pageToken
        }
    });
    return response.data.items;
}

/** HTML GENERATION */
const searchContainer = document.querySelector('#search');
searchContainer.innerHTML = `
    <div class="dropdown">
        <input id="search_kw" type="text" name="kw" class="input" placeholder="Type something here...">
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
               
            </div>
        </div>
    </div>
    <div class="select">
        <select name="type" id="type">
            <option value="video">Video</option>
            <option value="channel">Channel</option>
            <option value="playlist">Playlist</option>
        </select>
    </div>
`;

const type = document.querySelector('#type');
const searchKw = document.querySelector('#search_kw');
const autocompleteDropdown = searchContainer.querySelector('.dropdown');
const autocompleteContent= searchContainer.querySelector('.dropdown-content');


const onInput = async e => {
    const items = await search(e.target.value, type.value);

    //make sure to delete previous results for the new search
    autocompleteContent.innerHTML = ``;

    autocompleteDropdown.classList.add('is-active');
    for (const item of items) {
        const result = document.createElement('a');
        result.classList.add('dropdown-item');
        result.innerHTML = `
        
                <img src="${item.snippet.thumbnails.default.url}" />
                <h3>${item.snippet.title}</h3>

        `;
        autocompleteContent.appendChild(result);
    }
}

const onTypeChange = async e => {
    if(searchKw.value.trim().length > 0 ){
        const items = await search(e.target.value, type.value);
        console.log(items);
    }
}

searchKw.addEventListener('input', debounce(onInput));
type.addEventListener('change', onTypeChange);

/** CLOSE THE DROPDOWN IF CLICKED OUTSIDE */
document.addEventListener('click', e => {
    if(!searchContainer.contains(e.target)){
        autocompleteDropdown.classList.remove('is-active');
    }
})
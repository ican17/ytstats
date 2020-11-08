//TO PUT IN ENV =+>

// Oldr apikeys :
//const APIKEY = 'AIzaSyCem5-tCnvPw8dxnEvJO54DVo7Mu3DECBw';

const APIKEY = 'AIzaSyDNggO3vw4GH_TE2HI8fNpmN8OxkCNJf74';

/* FUNCTION: SEARCH FUNCTION */
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
/* FUNCTION: Fetch data */
const fetchData = async (id, type) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/' + type, {
        params: {
            key: APIKEY,
            id: id,
            part: 'statistics, snippet'
        }
    });
    return response.data.items;
    // return response.data.item;
}

/** Function : ON ITEM SELECTED */
const onItemSelected = async (item) => {

    // retrive the type & id of the resource
    const type = item.id.kind.split('#')[1];
    const id = item.id[`${type}Id`];

    const data = await fetchData(id, type + 's');
    console.log(data);
    // show data to the user
    displayResultDetailContainer.innerHTML = ItemDetailTemplate(data[0]);

}
/** FUNCTION : POPULATE AUTOCOMPLETE RESULTS WRAPPER */
const populateAutocomplete = (items, input, dropdwon, ResultsContainer) => {

    //make sure to delete previous results for the new search
    ResultsContainer.innerHTML = ``;

    dropdwon.classList.add('is-active');
    if (items.length > 0) {

        for (const item of items) {
            const result = document.createElement('a');
            result.classList.add('dropdown-item');
            result.innerHTML = `
             
                     <img src="${item.snippet.thumbnails.default.url}" />
                     <h3>${item.snippet.title}</h3>
     
             `;

            // if the user clicks on an entry => close dropdown + print the title in the input
            result.addEventListener('click', () => {
                dropdwon.classList.remove('is-active');
                input.value = item.snippet.title;
                onItemSelected(item);
            });

            ResultsContainer.appendChild(result);
        }
    } else { // no result
        const noResult = document.createElement('p');
        noResult.classList.add('dropdown-item');
        noResult.innerHTML = `
                     <h3>No results found for your query</h3>
             `;
        ResultsContainer.appendChild(noResult);
    }
}

/** FUNCTION : SELECTED RESULT DISPLY DETAIL TEMPLATE */
const ItemDetailTemplate = (data) => {
    const date = new Date(Date.parse(data.snippet.publishedAt))
    return `
    <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="${data.snippet.thumbnails.default.url}" alt="Placeholder image">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${data.snippet.title}</p>
          <p class="subtitle is-6">Published on: <time datetime="2016-1-1">${date.toUTCString()}</time></p>
        </div>
      </div>
  
      <div class="content">
        <p class="subtitle is-6">Statistics:</p>
        <table class="table is-narrow is-hoverable">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Stat</th>
            </tr>
          </thead>
          <tbody>
          ${
              data.statistics.subscriberCount?
              `
              <tr>
                <td><i class="fas fa-user"></i> Subs</td>
                <td>${data.statistics.subscriberCount}</td>
              </tr>`
              : ``
          }
          ${
              data.statistics.videoCount?
              `
              <tr>
                <td><i class="fas fa-file-video"></i> Videos</td>
                <td>${data.statistics.videoCount}</td>
              </tr>`
              : ``
          }
          ${
              data.statistics.viewCount?
              `
              <tr>
                <td><i class="fas fa-eye"></i> Views</td>
                <td>${data.statistics.viewCount}</td>
              </tr>`
              : ``
          }
          ${
              data.statistics.likeCount?
              `
              <tr>
                <td><i class="fas fa-thumbs-up"></i> Likes</td>
                <td>${data.statistics.likeCount}</td>
              </tr>`
              : ``
          }
          ${
              data.statistics.dislikeCount?
              `
              <tr>
                <td><i class="fas fa-thumbs-down"></i> Dislikes</td>
                <td>${data.statistics.dislikeCount}</td>
              </tr>`
              : ``
          }
          ${
              data.statistics.commentCount?
              `
              <tr>
                <td><i class="fas fa-comment"></i> Comments</td>
                <td>${data.statistics.commentCount}</td>
              </tr>`
              : ``
          }
           
          </tbody>
        </table>
       
        ${
            data.snippet.tags? 
                `
                <p class="subtitle is-6">Tags(${data.snippet.tags.length}):</p>
                <div class="tags are-small">
                    ${data.snippet.tags.map(tag => `<span class="tag">${tag}</span>` ).join(``)}
                </div>`
                 
            : ``
        }
 
      </div>
    </div>
  </div>
        `;
    }
    /** HTML GENERATION */
    const searchContainer = document.querySelector('#search');
    const displayResultDetailContainer = document.querySelector('#result');
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
        </select>
    </div>
`;

const type = document.querySelector('#type');
const searchKw = document.querySelector('#search_kw');
const autocompleteDropdown = searchContainer.querySelector('.dropdown');
const autocompleteContent = searchContainer.querySelector('.dropdown-content');

const onInput = async e => {

    // don't make any request if it's empty
    if (e.target.value.length == 0) {
        autocompleteDropdown.classList.remove('is-active');
        return;
    }

    const items = await search(e.target.value, type.value);
    populateAutocomplete(items, searchKw, autocompleteDropdown, autocompleteContent);

}

const onTypeChange = async () => {
    if (searchKw.value.trim().length > 0) {
        const items = await search(searchKw.value, type.value);
        populateAutocomplete(items, searchKw, autocompleteDropdown, autocompleteContent);
    }
}

searchKw.addEventListener('input', debounce(onInput));
type.addEventListener('change', onTypeChange);

/** CLOSE THE DROPDOWN IF CLICKED OUTSIDE */
document.addEventListener('click', e => {
    if (!searchContainer.contains(e.target)) {
        autocompleteDropdown.classList.remove('is-active');
    }
})
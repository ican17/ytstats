//TO PUT IN ENV =+>

// Oldr apikeys :
//const APIKEY = 'AIzaSyCem5-tCnvPw8dxnEvJO54DVo7Mu3DECBw';

const APIKEY = 'AIzaSyD-zZYgeU0wYwou0RiusEN46LaUnT0at9g';

//const APIKEY = 'AIzaSyDNggO3vw4GH_TE2HI8fNpmN8OxkCNJf74';


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
          ${data.statistics.subscriberCount ?
            `
              <tr>
                <td><i class="fas fa-user"></i> Subs</td>
                <td>${data.statistics.subscriberCount}</td>
              </tr>`
            : ``
        }
          ${data.statistics.videoCount ?
            `
              <tr>
                <td><i class="fas fa-file-video"></i> Videos</td>
                <td>${data.statistics.videoCount}</td>
              </tr>`
            : ``
        }
          ${data.statistics.viewCount ?
            `
              <tr>
                <td><i class="fas fa-eye"></i> Views</td>
                <td>${data.statistics.viewCount}</td>
              </tr>`
            : ``
        }
          ${data.statistics.likeCount ?
            `
              <tr>
                <td><i class="fas fa-thumbs-up"></i> Likes</td>
                <td>${data.statistics.likeCount}</td>
              </tr>`
            : ``
        }
          ${data.statistics.dislikeCount ?
            `
              <tr>
                <td><i class="fas fa-thumbs-down"></i> Dislikes</td>
                <td>${data.statistics.dislikeCount}</td>
              </tr>`
            : ``
        }
          ${data.statistics.commentCount ?
            `
              <tr>
                <td><i class="fas fa-comment"></i> Comments</td>
                <td>${data.statistics.commentCount}</td>
              </tr>`
            : ``
        }
           
          </tbody>
        </table>
       
        ${data.snippet.tags ?
            `
                <p class="subtitle is-6">Tags(${data.snippet.tags.length}):</p>
                <div class="tags are-small">
                    ${data.snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join(``)}
                </div>`

            : ``
        }
 
      </div>
    </div>
  </div>
        `;
}

// Create the autocomplete widget
const searchContainer = document.querySelector('#search');

createAutocomplete({
    root: searchContainer,
    renderOption: (item) => `
                <img src="${item.snippet.thumbnails.default.url}" />
                <h3>${item.snippet.title}</h3>
            `,
    selectOption : (item) => {
        return {
            handler : onItemSelected.bind(null, item),
            inputValue : item.snippet.title
        }
    },
    fetchSearchData : async (query, type, pageToken = null) => {
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
    }, 
 
});

const displayResultDetailContainer = document.querySelector('#result');

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
const createAutocomplete = ({ root, renderOption }) => {
    root.innerHTML = `
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

    const type = root.querySelector('#type');
    const input = root.querySelector('#search_kw');
    const dropdwon = root.querySelector('.dropdown');
    const resultsContainer = root.querySelector('.dropdown-content');

    // Function : Popualate the autocomplete results container
    const populateAutocomplete = items => {
        //make sure to delete previous results for the new search
        resultsContainer.innerHTML = ``;

        dropdwon.classList.add('is-active');
        if (items.length > 0) {

            for (const item of items) {
                const result = document.createElement('a');
                result.classList.add('dropdown-item');
                result.innerHTML = renderOption(item);

                // if the user clicks on an entry => close dropdown + print the title in the input
                result.addEventListener('click', () => {
                    dropdwon.classList.remove('is-active');
                    input.value = item.snippet.title;
                    onItemSelected(item);
                });

                resultsContainer.appendChild(result);
            }
        } else { // no result
            const noResult = document.createElement('p');
            noResult.classList.add('dropdown-item');
            noResult.innerHTML = `
                           <h3>No results found for your query</h3>
                   `;
            resultsContainer.appendChild(noResult);
        }
    }

    // On Input Handler =>
    const onInput = async e => {

        // don't make any request if it's empty
        if (e.target.value.length == 0) {
            dropdwon.classList.remove('is-active');
            return;
        }

        const items = await search(e.target.value, type.value);
        populateAutocomplete(items);

    }
    
    // On type changed handler
    const onTypeChanged = async () => {
        if (input.value.trim().length > 0) {
            const items = await search(input.value, type.value);
            populateAutocomplete(items);
        }
    }

    input.addEventListener('input', debounce(onInput));
    type.addEventListener('change', onTypeChanged);

    /** CLOSE THE DROPDOWN IF CLICKED OUTSIDE */
    document.addEventListener('click', e => {
        if (!searchContainer.contains(e.target)) {
            dropdwon.classList.remove('is-active');
        }
    });



}
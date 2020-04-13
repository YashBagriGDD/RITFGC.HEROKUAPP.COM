//At the top of the file
let _csrf;

// Values to help not repeat methods
let pageList = false;
let loopNumber = 1;


const handleVideo = (e) => {
    let videoKey = 0;
    let modValue = 0;
    e.preventDefault();

    // Create a video object to send to the server
    const videoObj = { }

    // For each match a user wants to add, push the object
    for(let i = 0; i < loopNumber; i++) {
        let newObject = {
         }
        videoObj[i] = newObject;
    }

    // Find the overall link the user inputted
    $('#videoForm').find('input').each(function(){
        if(this.name === 'videoLink') {
            videoObj.videoLink = this.value;
        }
    });

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' || $("#characterOne").val() == ''
    || $("#characterTwo").val() == '' || $("#videoLink").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

     // Comment this out if you need to send data
     ///
     /// Putting each input into its own object to send to the server 
     ///
     $('#videoForm').find('section > input').each(function(){

        if(modValue===0) {
            // Each match will have a specific timestamp, so put that here with concatenation
            videoObj[videoKey].link = `${videoObj.videoLink}&t=${this.value}`;
        } 
        if(modValue===1) {
            videoObj[videoKey].player1 = this.value;
        }
        if(modValue===2) {
            videoObj[videoKey].char1 = this.value;
        } 
        if(modValue===3) {
            videoObj[videoKey].char2 = this.value;
        } 
        if(modValue===4) {
            
            // Once the end is reached, add the game from the selection
            // and iterate the videoKey and reset the modification value
            videoObj[videoKey].player2 = this.value;
            videoObj[videoKey].game = $('#videoForm').find('select').find(":selected").text();
            videoKey++;
            modValue=-1;
        } 

        modValue++;
    });

    // CSRF is associated with a user, so add a token to the overall object to send to the server
    $('#videoForm').find('input').each(function(){
        if(this.type === 'hidden') {
            videoObj._csrf = this.value;
        }
    });

    console.log(videoObj);


    // Uncomment this to send data
    // Send the object! :diaYay:
    sendAjax('POST', $("#videoForm").attr("action"), videoObj, function() {
        loadVideosFromServer();
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
  
    let data = {
      uid: e.target.value,
      _csrf
    }
  
    sendAjax('POST', '/delete', data, function () {loadVideosFromServer();});
  
    return false;
  }

// Handling password change
const handleChange = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    if($("#pass").val() === $("#pass2").val()) {
        handleError("RAWR! Passwords cannot match!");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

// Handle the search
const handleSearch = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    let params = {
        player1: $("#player1Search").val(),
        player2: $("#player2Search").val(),
        char1: $("#char1Search").val(),
        char2: $("#char2Search").val(),
        game: $("#gameSearch").val(),
    }

    sendAjax('GET', $("#searchForm").attr("action"), params, (data) =>{
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

// Search form
const SearchForm = () => {
    return(
        <form
            id="searchForm"
            onSubmit={handleSearch}
            name="searchForm"
            action="/search"
            method="GET"
            className="searchForm"
        >
            <label htmlFor="player1">Player 1: </label>
            <input id="player1Search" type="text" name="player1" placeholder="Player 1"/>
            <label htmlFor="player2">Player 2: </label>
            <input id="player2Search" type="text" name="player2" placeholder="Player 2"/>
            <label htmlFor="char1">Character 1: </label>
            <input id="char1Search" type="text" name="char1" placeholder="Character 1"/>
            <label htmlFor="char2">Character 2: </label>
            <input id="char2Search" type="text" name="char2" placeholder="Character 2"/>
            <label htmlFor="game">Game: </label>
            <select id="gameSearch">
                <option value="gbvs">GBVS</option>
                <option value="bbcf">BBCF</option>
                <option value="">All</option>
            </select>
            <input id="formSubmit" type="submit" value="Search"/>
        </form>
    )
};

/// FORM TO SUBMIT NEW DATA
const VideoForm = (props) => {

    // Rows to dynamically add more matches
    // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
    let rows = [];
    let rowing;

    for(let i = 0; i < loopNumber; i++) {
        rows.push(
        <section>
            <label htmlFor="timestamp">timestamp: </label>
            <input id="timestamp" type="text" name="timestamp" placeholder="00h00m00s"/>
            <label htmlFor="playerOne">Player 1: </label>
            <input id="playerOne" type="text" name="playerOne" placeholder="Player 1"/>
            <label htmlFor="characterOne">Character 1: </label>
            <input id="characterOne" type="text" name="characterOne" placeholder="Character 1"/>

            <label htmlFor="characterTwo">Character 2: </label>
            <input id="characterTwo" type="text" name="characterTwo" placeholder="Character 2"/>
            <label htmlFor="playerTwo">Player 2: </label>
            <input id="playerTwo" type="text" name="playerTwo" placeholder="Player 2"/>        
        </section>
        )
    }

    if($('#videoForm').find('select').find(":selected").text() == 'BBCF')
    {
        rowing = <input className="makeVideoSubmit" type="submit" value="Make Video"/>;
    } 

    return ( 
    <form 
        id="videoForm"
        onSubmit={handleVideo}
        name="videoForm"
        action="/maker"
        method="POST"
        className="videoForm"
    >
        <label htmlFor="videoLink">Video Link: </label>
        <input id="videoLink" type="text" name="videoLink" placeholder="Video Name"/>
        <label htmlFor="game">Game: </label>
        <select id="Game">
            <option value="gbvs">GBVS</option>
            <option value="bbcf">BBCF</option>
        </select>
        {rows}
        {rowing}
        <input className="makeVideoSubmit" type="submit" value="Make Video"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <button id="addMatchButton" type="button">Add Match</button>
    </form>
    );
};


/// CHANGE PASSWORD WINDOW
const ChangeWindow = (props) => {
    return ( 
    <form id="changeForm" name="changeForm"
            onSubmit={handleChange}
            action="/passChange"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="old password"/>
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="new password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Change Password"/>
    </form>
    );
};


/// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list
const VideoList = function(props) {
    
    // Do we need to show deletion or not
    let deleteButton;

    if(props.videos.length === 0) {
        return (
            <div className="videoList">
                <h3 className="emptyVideo">No Videos Yet</h3>
            </div>
        );
    }


    const videoNodes = props.videos.map(function(video) {

        // https://react-cn.github.io/react/tips/if-else-in-JSX.html
        if(pageList) {
            deleteButton = <button value={video._id} onClick={handleDelete}>Delete Item</button>;
        } else {
            deleteButton = null;
        }

        return (
            <div key = {video._id} className="video">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="videoLink"><a href={video.link}>Link</a></h3>
                <h3 className="videoPlayerOne">{video.player1}</h3>
                <h3 className="videoCharacterOne">({video.char1})</h3>
                <h3 className="vs">vs</h3>
                <img id="char2Img" src="/assets/img/CF/Mai.png" alt="domo face" />

                <h3 className="videoCharacterTwo">({video.char2})</h3>
                <h3 className="videoPlayerTwo">{video.player2}</h3>
                {deleteButton}
            </div>
        );
    });
    
    return (
        <div className="videoList">
            {videoNodes}
        </div>
    );
};

const loadVideosFromServer = () => {
    loopNumber = 1;
    pageList = true;
    sendAjax('GET', '/getVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

// Display all videos for home page
const loadAllVideosFromServer = () => {
    loopNumber = 1;
    pageList = false;
    sendAjax('GET', '/getAllVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

const createPassChangeWindow = (csrf) => {
    loopNumber =1;
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createAddWindow = (csrf) => {
    ReactDOM.render(
        <VideoForm csrf={csrf} />,
        document.querySelector("#content")
    );

    // Get the button that was made in the videoForm
    const addMatchButton = document.querySelector("#addMatchButton");
    addMatchButton.addEventListener("click", (e) => {
        loopNumber++;
        //If it's clicked, just re-render
        ReactDOM.render(
            <VideoForm csrf={csrf} />,
            document.querySelector("#content")
        );
    });
};

const createSearchForm = () => {
    ReactDOM.render(
        <SearchForm />, document.querySelector("#content")  
    );
}

const setup = function(csrf) {
    const homeButton = document.querySelector("#home");
    const pageButton = document.querySelector("#myPage");
    const addButton = document.querySelector("#addVideo");
    const passChangeButton = document.querySelector("#passChangeButton");
    const searchButton = document.querySelector("#searchButton");

    passChangeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPassChangeWindow(csrf);
        return false;
    });

    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        createAddWindow(csrf);
        return false;
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadAllVideosFromServer();
        return false;
    });

    pageButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadVideosFromServer();
        return false;
    });

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchForm();
        return false;
    });

    loadAllVideosFromServer();
};

//And set it in getToken
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
      _csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
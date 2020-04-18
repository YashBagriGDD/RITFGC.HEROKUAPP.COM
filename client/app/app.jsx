//At the top of the file
let _csrf;

// Values to help not repeat methods
let pageList = false;
let loopNumber = 1;
let videoKey = 0;

const handleVideo = (e) => {
    videoKey = 0;
    let modValue = 0;

    let charVideoKey = 0;
    let charModValue = 0;
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

    /*if($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' ||
    $("#videoLink").val() == '') {
        handleError("ERROR | All fields are required");
        return false;
    }

    if($('#videoForm').find('#Game').find(":selected").text() === 'Game' ||
    $('#videoForm').find('#Game').find(":selected").text() === '') {
        handleError("ERROR | Please select a game");
        return false;
    }

    // Check if the error uses the correct link *just copying the url
    if(!$("#videoLink").val().includes('www.youtube.com')) {
        handleError("ERROR | Please use a valid link");
        return false;
    }*/


    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers
    // https://www.w3schools.com/jsref/jsref_replace.asp
    let regex = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g;


     /// Putting each input into its own object to send to the server 
     ///
     $('#videoForm').find('td > input').each(function(){

        if(modValue===0) {

            // Using regex to ensure the timestamp is correct
            if(regex.test(this.value)) {
                let array = this.value.match(regex);
                JSON.stringify(array);
                let newArray = array[0].replace(/:.*?/, "h");
                let newArray2 = newArray.replace(/:.*?/, "m");
                let finalArray = newArray2 + "s"

                videoObj[videoKey].link = `${videoObj.videoLink}&t=${finalArray}`;
            } else {
                videoObj[videoKey].link = `${videoObj.videoLink}&t=${this.value}`;
            }
        } 
        if(modValue===1) {
            videoObj[videoKey].player1 = this.value;
        }
        if(modValue===2) {
            // Once the end is reached, add the game from the selection
            // Add characters as well
            // and iterate the videoKey and reset the modification values
            videoObj[videoKey].player2 = this.value;
            videoObj[videoKey].game = $('#videoForm').find('#Game').find(":selected").text();
            videoKey++;
            modValue=-1;
        }

        modValue++;
    });

    videoKey = 0;
    //console.dir("Video Object: " + videoObj);

    $('#videoForm').find('select').each(function() {
        console.log(videoObj);


        if(this.id !== 'Game') {
            if(charModValue === 0) {
                videoObj[videoKey].char1 = this.value;
            }
            if(charModValue === 1) {
                videoObj[videoKey].char2 = this.value;
                videoKey++;
                charModValue = -1;
            }
        }
        videoKey++;
        charModValue++;
    })

    // CSRF is associated with a user, so add a token to the overall object to send to the server
    $('#videoForm').find('input').each(function(){
        if(this.type === 'hidden') {
            videoObj._csrf = this.value;
        }
    });

    console.log(videoObj);


    // Uncomment this to send data
    // Send the object! :diaYay:
    /*sendAjax('POST', $("#videoForm").attr("action"), videoObj, function() {
        loadVideosFromServer();
    });*/

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

    if($("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("ERROR | All fields are required");
        return false;
    }

    if($("#pass").val() === $("#pass2").val()) {
        handleError("ERROR | Passwords cannot match");
        return false;
    }

    if($("pass2").val() !== $("#pass3").val()) {
        handleError("ERROR | The new passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

// Handle the search
const handleSearch = (e) => {
    e.preventDefault();

    let params = {
        player1: $("#player1Search").val(),
        player2: $("#player2Search").val(),
        char1: $("#char1Search").val(),
        char2: $("#char2Search").val(),
        game: $("#gameSearch").val(),
    }

    /*sendAjax('GET', $("#searchForm").attr("action"), params, (data) =>{
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });*/
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
    let charSelection;
    let char2Selection;

    console.log($('#videoForm').find('#Game').find(":selected").text());

    if($('#videoForm').find('#Game').find(":selected").text() === 'BBCF' ||
    $('#videoForm').find('#Game').find(":selected").text() === 'Game' ||
    $('#videoForm').find('#Game').find(":selected").text() === '') {
        charSelection = <select id = "char1">
                    <option value="Amane" selected>Amane</option><option value="Arakune">Arakune</option>
        <option value="Azrael">Azrael</option><option value="Bang">Bang</option><option value="Bullet">Bullet</option>
        <option value="Carl">Carl</option><option value="Celica">Celica</option><option value="Es">Es</option>
        <option value="Hakumen">Hakumen</option><option value="Hazama">Hazama</option><option value="Hibiki">Hibiki</option>
        <option value="Izanami">Izanami</option><option value="Izayoi">Izayoi</option><option value="Jin">Jin</option>
        <option value="Jubei">Jubei</option><option value="Kagura">Kagura</option><option value="Kokonoe">Kokonoe</option>
        <option value="Litchi">Litchi</option><option value="Makoto">Makoto</option><option value="Mai">Mai</option>
        <option value="Naoto">Naoto</option><option value="Nine">Nine</option><option value="Noel">Noel</option>
        <option value="Platinum">Platinum</option><option value="Rachel">Rachel</option><option value="Ragna">Ragna</option>
        <option value="Relius">Relius</option><option value="Susanoo">Susanoo</option><option value="Tager">Tager</option>
        <option value="Taokaka">Taokaka</option><option value="Tsubaki">Tsubaki</option><option value="Terumi">Terumi</option>
        <option value="Valkenhayn">Valkenhayn</option><option value="Lambda-11">Lambda-11</option><option value="Mu-12">Mu-12</option>
        <option value="Nu-13">Nu-13</option>
                </select>

        char2Selection = <select id = "char2">
                    <option value="Amane" selected>Amane</option><option value="Arakune">Arakune</option>
        <option value="Azrael">Azrael</option><option value="Bang">Bang</option><option value="Bullet">Bullet</option>
        <option value="Carl">Carl</option><option value="Celica">Celica</option><option value="Es">Es</option>
        <option value="Hakumen">Hakumen</option><option value="Hazama">Hazama</option><option value="Hibiki">Hibiki</option>
        <option value="Izanami">Izanami</option><option value="Izayoi">Izayoi</option><option value="Jin">Jin</option>
        <option value="Jubei">Jubei</option><option value="Kagura">Kagura</option><option value="Kokonoe">Kokonoe</option>
        <option value="Litchi">Litchi</option><option value="Makoto">Makoto</option><option value="Mai">Mai</option>
        <option value="Naoto">Naoto</option><option value="Nine">Nine</option><option value="Noel">Noel</option>
        <option value="Platinum">Platinum</option><option value="Rachel">Rachel</option><option value="Ragna">Ragna</option>
        <option value="Relius">Relius</option><option value="Susanoo">Susanoo</option><option value="Tager">Tager</option>
        <option value="Taokaka">Taokaka</option><option value="Tsubaki">Tsubaki</option><option value="Terumi">Terumi</option>
        <option value="Valkenhayn">Valkenhayn</option><option value="Lambda-11">Lambda-11</option><option value="Mu-12">Mu-12</option>
        <option value="Nu-13">Nu-13</option>
                </select>


    } else if($('#videoForm').find('#Game').find(":selected").text() === 'GBVS'){
        charSelection= <select id ="char1">
        <option value="Beezlebub" selected>Beezlebub</option><option value="Charlotta">Charlotta</option>
        <option value="Djeeta">Djeeta</option><option value="Ferry">Ferry</option>
        <option value="Gran">Gran</option><option value="Katalina">Katalina</option>
        <option value="Ladiva">Ladiva</option><option value="Lancelot">Lancelot</option>
        <option value="Lowain">Lowain</option><option value="Metera">Metera</option>
        <option value="Narmaya">Narmaya</option><option value="Percival">Percival</option>
        <option value="Soriz">Soriz</option><option value="Vaseraga">Vaseraga</option>
        <option value="Zeta">Zeta</option>
                </select>

        char2Selection= <select id ="char2">
        <option value="Beezlebub" selected>Beezlebub</option><option value="Charlotta">Charlotta</option>
        <option value="Djeeta">Djeeta</option><option value="Ferry">Ferry</option>
        <option value="Gran">Gran</option><option value="Katalina">Katalina</option>
        <option value="Ladiva">Ladiva</option><option value="Lancelot">Lancelot</option>
        <option value="Lowain">Lowain</option><option value="Metera">Metera</option>
        <option value="Narmaya">Narmaya</option><option value="Percival">Percival</option>
        <option value="Soriz">Soriz</option><option value="Vaseraga">Vaseraga</option>
        <option value="Zeta">Zeta</option>
                </select>
    } else if($('#videoForm').find('#Game').find(":selected").text() === 'UNICLR'){
        charSelection= <select id ="char1">
        <option value="Akatsuki" selected>Akatsuki</option><option value="Byakuya">Byakuya</option>
        <option value="Carmine">Carmine</option><option value="Chaos">Chaos</option>
        <option value="Eltnum">Eltnum</option><option value="Enkidu">Enkidu</option>
        <option value="Gordeau">Gordeau</option><option value="Hilda">Hilda</option>
        <option value="Hyde">Hyde</option><option value="Linne">Linne</option>
        <option value="Londrekia">Londrekia</option><option value="Merkava">Merkava</option>
        <option value="Phonon">Phonon</option><option value="Seth">Seth</option>
        <option value="Vatista">Vatista</option><option value="Wagner">Wagner</option>
        <option value="Waldstein">Waldstein</option><option value="Yuzuriha">Yuzuriha</option>
                </select>

        char2Selection= <select id ="char2">
        <option value="Akatsuki" selected>Akatsuki</option><option value="Byakuya">Byakuya</option>
        <option value="Carmine">Carmine</option><option value="Chaos">Chaos</option>
        <option value="Eltnum">Eltnum</option><option value="Enkidu">Enkidu</option>
        <option value="Gordeau">Gordeau</option><option value="Hilda">Hilda</option>
        <option value="Hyde">Hyde</option><option value="Linne">Linne</option>
        <option value="Londrekia">Londrekia</option><option value="Merkava">Merkava</option>
        <option value="Phonon">Phonon</option><option value="Seth">Seth</option>
        <option value="Vatista">Vatista</option><option value="Wagner">Wagner</option>
        <option value="Waldstein">Waldstein</option><option value="Yuzuriha">Yuzuriha</option>
                </select>
    }

    for(let i = 0; i < loopNumber; i++) {
        rows.push(
            <tbody>
                <tr>
                    <td><input id="timestamp" type="text" name="timestamp" placeholder="Timestamp"/></td>
                    <td><input id="playerOne" type="text" name="playerOne" placeholder="Player 1"/></td>
                    <td>{charSelection}</td>
                    <td>vs</td>
                    <td>{char2Selection}</td>
                    <td><input id="playerTwo" type="text" name="playerTwo" placeholder="Player 2"/></td>
                </tr>
            </tbody>
        )
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
        <div id ="static">
            <input id="videoLink" className='form-control' type="text" name="videoLink" placeholder="YouTube Link (https://www.youtube.com/watch?v=***********)"/>
            <select className="form-control" id="Game" placeholder="Game">
                <option value="" disabled selected hidden>Game</option>
                <option value="bbcf">BBCF</option>
                <option value="gbvs">GBVS</option>
                <option value="uniclr">UNICLR</option>
            </select>
            <table id="videoFormTable" className="table table-sm table-dark">
                {rows}
            </table>
            <input className="makeVideoSubmit" className="btn btn-primary" type="submit" value="Add Video"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button id="addMatchButton" className="btn btn-default"type="button">Add a Match</button>
        </div>
        <div id="adSpace"></div>

    </form>
    );
};


/// CHANGE PASSWORD WINDOW
const ChangeWindow = (props) => {
    return ( 
    <form   id="changeForm" 
            name="changeForm"
            onSubmit={handleChange}
            action="/passChange"
            method="POST"
            className="mainForm"
        >
        <input className="form-control" id="pass" type="password" name="pass" placeholder="old password"/>
        <input className="form-control" id="pass2" type="password" name="pass2" placeholder="new password"/>
        <input className="form-control" id="pass3" type="password" name="pass3" placeholder="re-type password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Change"/>
    </form>
    );
};


/// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list
const VideoList = function(props) {
    
    // Do we need to show deletion or not
    let deleteButton;
    let adSpace;

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
            deleteButton = <td>
                            <button className="delete btn" value={video._id} onClick={handleDelete}>
                                <i className="fas fa-trash"></i>
                            </button>
                           </td>;
            adSpace = null;
        } else {
            deleteButton = null;
            adSpace = <div>
                      <div id="ad">Your Ad Here!</div>
                      <div id="adtwo">Your Ad Here!</div>
                      </div>;
        }

        let char1Src;
        let char2Src;
        let gameSrc;

        let img1;
        let img2;

        if(video.game === "BBCF") {
            char1Src = `/assets/img/CF/${video.char1}.png`;
            char2Src = `/assets/img/CF/${video.char2}.png`;
            gameSrc = `/assets/img/CF/${video.game}.png`;
        } else if(video.game === "GBVS"){
            char1Src = `/assets/img/GBVS/${video.char1}.png`;
            char2Src = `/assets/img/GBVS/${video.char2}.png`;
            gameSrc = `/assets/img/GBVS/${video.game}.png`;
        } else {
            char1Src = `/assets/img/UNICLR/${video.char1}.png`;
            char2Src = `/assets/img/UNICLR/${video.char2}.png`;
            gameSrc = `/assets/img/UNICLR/${video.game}.png`;
        }

        img1 = <img id="char1Img" src={char1Src} alt={video.char1} />
        img2 = <img id="char2Img" src={char2Src} alt={video.char2} />

        if(video.game === "UNICLR") {
            img2 = <img id="char2Img" className='flip' src={char2Src} alt={video.char2} />
        }

        
        return (
                <tbody>
                    <tr>
                        <th scope="row"><img id="gameLogo" className="gameLogo" src={gameSrc} alt={video.gameSrc} /></th>
                        <td>{video.player1}</td>
                        <td>{img1}</td>
                        <td>vs</td>
                        <td>{img2}</td>
                        <td>{video.player2}</td>
                        <td>
                            <a href={video.link} className="icons-sm yt-ic" target="_blank"><i className="fab fa-youtube fa-2x"> </i></a>
                        </td>
                        {deleteButton}
                    </tr>
                </tbody>
            
        );
    });
    
    return (
        <div id="pageContainer">
            <table className="table table-sm table-dark">
                {videoNodes}
            </table>
            {adSpace}
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

    // If theh game changes, re-render
    $('#videoForm').find('#Game').on('change', function() {
        ReactDOM.render(
            <VideoForm csrf={csrf} />,
            document.querySelector("#content")
        );
    });

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
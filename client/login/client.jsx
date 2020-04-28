const handleLogin = (e) => {
    e.preventDefault();


    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("ERROR | Username or Password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("ERROR | All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("ERROR | Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

//Sets the values of the players and game to null, then triggers a change to remove the char selects from the form
const handleReset = (e) => {
    e.preventDefault();

    $("#player1Search").val("");
    $("#player2Search").val("");
    $("#gameSearch").val("").prop('selected', true).trigger("change");

    return false;
} 

// Handles the search. Will check for each value in the inputs for the search form to see if they exist.
// If they exist put them into the query string them send it to the server with the GET command
const handleSearch = (e) => {
    e.preventDefault();

    let queryString = `${$('#searchForm').attr('action')}?`;

    // Check each search field to see if anything is in them. If there is data in them, add it to the querystring
    if($("#player1Search").val()){
        queryString += `player1=${$("#player1Search").val()}`
    }
    if($("#player2Search").val()){
        queryString += `&player2=${$("#player2Search").val()}`
    }
    if($("#char1").find(":selected").text() !== 'Character 1' &&
    $("#char1").find(":selected").text() !== 'Anyone'){
        queryString += `&char1=${$("#char1").find(":selected").text()}`
    }   
    if($("#char2").find(":selected").text() !== 'Character 2' &&
    $("#char2").find(":selected").text() !== 'Anyone'){
        queryString += `&char2=${$("#char2").find(":selected").text()}`
    }
    if($("#gameSearch").val()){
        queryString += `&game=${$("#gameSearch").val()}`
    }

    console.log($('#searchForm').find('#char1').find(":selected").text());

    console.log(queryString)

    sendAjax('GET', queryString , null, (data) =>{

        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

// Search form
//Sets up the search form, will change the select for characters depending on the game selected
const SearchForm = () => {

    let charSelection;
    let char2Selection;

    if($('#searchForm').find('#gameSearch').find(":selected").text() === 'BBCF') {
        charSelection = bbcfChar1;

        char2Selection = bbcfChar2;

    } else if($('#searchForm').find('#gameSearch').find(":selected").text() === 'GBVS'){
        charSelection= gbvsChar1;

        char2Selection= gbvsChar2;

    } else if($('#searchForm').find('#gameSearch').find(":selected").text() === 'UNICLR'){
        charSelection= uniChar1;

        char2Selection= uniChar2;
    }

    return(
        <form
            id="searchForm"
            onChange={handleSearch}
            onReset={handleReset}
            name="searchForm"
            action="/search"
            method="GET"
            className="searchForm"
        >
          <table id="searchFormTable" className="table table-sm">
                <tbody>
                    <tr>
                        <td><input className="form-control" id="player1Search" type="text" name="player1" placeholder="Player 1"/></td>
                        <td>{charSelection}</td>
                        <td>vs</td>
                        <td>{char2Selection}</td>
                        <td><input className="form-control" id="player2Search" type="text" name="player2" placeholder="Player 2"/></td>
                        <td>
                            <select id="gameSearch" className="form-control">
                                <option value="" disabled selected hidden>Game</option>
                                <option value="">All</option>
                                <option value="bbcf">BBCF</option>
                                <option value="gbvs">GBVS</option>
                                <option value="uniclr">UNICLR</option>
                            </select>
                        </td>
                        <td><input className="searchFormSubmit btn" id="formSubmit" type="reset" value="Reset"/></td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
};

const LoginWindow = (props) => {
    return ( 
    <form   id="loginForm"
            className="mainForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
        >
        <input id="user" type="text" name="username" placeholder="username"/>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Sign In"/>

    </form>
    );
};

const SignupWindow = (props) => {
    return ( 
    <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
        <input id="user" type="text" name="username" placeholder="username"/>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Sign Up"/>

    </form>
    );
};

//#region Home Video Code
const VideoList = function(props) {
    if(props.videos.length === 0) {
        return (
            <div className="videoList">
                <h3 className="emptyVideo">No videos found!</h3>
                <div>
                    <div id="ad">Your Ad Here!</div>
                    <div id="adtwo">Your Ad Here!</div>
                </div>
            </div>
        );
    }

    const videoNodes = props.videos.map(function(video) {
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
                    </tr>
                </tbody>

            
        );
    });
    
    return (
        <div id="pageContainer">
            <table className="table table-sm">
                {videoNodes}
            </table>
            <div id="ad">Your Ad Here!</div>
            <div id="adtwo">Your Ad Here!</div>

        </div>
    );
};

const loadAllVideosFromServer = () => {
    sendAjax('GET', '/getAllVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });

    //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};
//#endregion

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));

    //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
   // ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

const createSearchForm = () => {
    ReactDOM.render(
        <SearchForm />, document.querySelector("#search")  
    );

    // If theh game changes, re-render
    $('#searchForm').find('select').on('change', function() {
        ReactDOM.render(
            <SearchForm />,
            document.querySelector("#search")
        );
    });
}

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const homeButton = document.querySelector("#home");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchForm();
        loadAllVideosFromServer();
        return false;
    });

    createSearchForm();
    loadAllVideosFromServer() //Default window
    //Default loads all Videos on the server 
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

//#region Character Forms
//Separated the character forms for ease of reference and readability in above code
const bbcfChar1 = <select id = "char1" className="form-control">
    <option value="" disabled selected hidden>Character 1</option><option value="Anyone">Anyone</option>
    <option value="Amane">Amane</option><option value="Arakune">Arakune</option>
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
    </select>;

const bbcfChar2 = <select id = "char2" className="form-control">
    <option value="" disabled selected hidden>Character 2</option><option value="Anyone">Anyone</option>
    <option value="Amane">Amane</option><option value="Arakune">Arakune</option>
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
    </select>;

const gbvsChar1 = <select id ="char1" className="form-control">
    <option value="" disabled selected hidden>Character 1</option><option value="Anyone">Anyone</option>
    <option value="Beezlebub">Beezlebub</option><option value="Charlotta">Charlotta</option>
    <option value="Djeeta">Djeeta</option><option value="Ferry">Ferry</option>
    <option value="Gran">Gran</option><option value="Katalina">Katalina</option>
    <option value="Ladiva">Ladiva</option><option value="Lancelot">Lancelot</option>
    <option value="Lowain">Lowain</option><option value="Metera">Metera</option>
    <option value="Narmaya">Narmaya</option><option value="Percival">Percival</option>
    <option value="Soriz">Soriz</option><option value="Vaseraga">Vaseraga</option>
    <option value="Zeta">Zeta</option>
    </select>;

const gbvsChar2 = <select id ="char2" className="form-control">
    <option value="" disabled selected hidden>Character 2</option><option value="Anyone">Anyone</option>
    <option value="Beezlebub">Beezlebub</option><option value="Charlotta">Charlotta</option>
    <option value="Djeeta">Djeeta</option><option value="Ferry">Ferry</option>
    <option value="Gran">Gran</option><option value="Katalina">Katalina</option>
    <option value="Ladiva">Ladiva</option><option value="Lancelot">Lancelot</option>
    <option value="Lowain">Lowain</option><option value="Metera">Metera</option>
    <option value="Narmaya">Narmaya</option><option value="Percival">Percival</option>
    <option value="Soriz">Soriz</option><option value="Vaseraga">Vaseraga</option>
    <option value="Zeta">Zeta</option>
    </select>;

const uniChar1 = <select id ="char1" className="form-control">
    <option value="" disabled selected hidden>Character 1</option><option value="Anyone">Anyone</option>
    <option value="Akatsuki">Akatsuki</option><option value="Byakuya">Byakuya</option>
    <option value="Carmine">Carmine</option><option value="Chaos">Chaos</option>
    <option value="Eltnum">Eltnum</option><option value="Enkidu">Enkidu</option>
    <option value="Gordeau">Gordeau</option><option value="Hilda">Hilda</option>
    <option value="Hyde">Hyde</option><option value="Linne">Linne</option>
    <option value="Londrekia">Londrekia</option><option value="Merkava">Merkava</option>
    <option value="Phonon">Phonon</option><option value="Seth">Seth</option>
    <option value="Vatista">Vatista</option><option value="Wagner">Wagner</option>
    <option value="Waldstein">Waldstein</option><option value="Yuzuriha">Yuzuriha</option>
    </select>;

const uniChar2 = <select id ="char2" className="form-control">
    <option value="" disabled selected hidden>Character 2</option><option value="Anyone">Anyone</option>
    <option value="Akatsuki">Akatsuki</option><option value="Byakuya">Byakuya</option>
    <option value="Carmine">Carmine</option><option value="Chaos">Chaos</option>
    <option value="Eltnum">Eltnum</option><option value="Enkidu">Enkidu</option>
    <option value="Gordeau">Gordeau</option><option value="Hilda">Hilda</option>
    <option value="Hyde">Hyde</option><option value="Linne">Linne</option>
    <option value="Londrekia">Londrekia</option><option value="Merkava">Merkava</option>
    <option value="Phonon">Phonon</option><option value="Seth">Seth</option>
    <option value="Vatista">Vatista</option><option value="Wagner">Wagner</option>
    <option value="Waldstein">Waldstein</option><option value="Yuzuriha">Yuzuriha</option>
    </select>;
//#endregion
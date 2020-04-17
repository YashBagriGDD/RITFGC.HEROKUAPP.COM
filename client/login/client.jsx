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
        <input className="formSubmit btn" type="submit" value="Sign Up"/>

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
                <h3 className="emptyVideo">No Videos Yet</h3>
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

    //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );

   // ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

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
        loadAllVideosFromServer();
        return false;
    });

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
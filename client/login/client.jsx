const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("RAWR! Username or Password is empty!");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("RAWR! Passwords do not match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    return ( 
    <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign in"/>

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
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign Up"/>

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
        if(video.game === "BBCF") {
            char1Src = `/assets/img/CF/${video.char1}.png`;
            char2Src = `/assets/img/CF/${video.char2}.png`;
            gameSrc = `/assets/img/CF/${video.game}.png`;
        } else {
            char1Src = `/assets/img/GBVS/${video.char1}.png`;
            char2Src = `/assets/img/GBVS/${video.char2}.png`;
            gameSrc = `/assets/img/GBVS/${video.game}.png`;
        }
        return (
            <div key = {video._id} className="video">
                <img src={gameSrc} alt={video.game} className="gameLogo"/>
                <h3 className="videoLink"><a href={video.link}>Link</a></h3>
                <div id = 'vidDiv1'>
                    <h3 className="videoPlayerOne">{video.player1}</h3>
                    <img id="char1Img" src={char1Src} alt={video.char1} />
                </div>
                <div className="vs">
                    <h3>vs</h3>
                </div>
                <div id = 'vidDiv2'>
                    <img id="char2Img" src={char2Src} alt={video.char2} />
                    <h3 className="videoPlayerTwo">{video.player2}</h3>
                </div>
            </div>
            
        );
    });
    
    return (
        <div className="videoList">
            {videoNodes}
        </div>
    );
};

const loadAllVideosFromServer = () => {
    sendAjax('GET', '/getAllVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });

    ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};
//#endregion

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#videos"));
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#videos"));
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
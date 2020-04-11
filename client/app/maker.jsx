//At the top of the file
let _csrf;

// Values to help not repeat methods
let pageList = false;
let loopNumber = 1;
let videoKey = 0;
let modValue = 0;

const handleVideo = (e) => {
    e.preventDefault();
    videoKey = 0;
    modValue = 0;


    const videoObj = { }

    console.dir(loopNumber);
    for(let i = 0; i < loopNumber; i++) {
        let newObject = {
         }
        videoObj[i] = newObject;
    }

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#videoName").val() == '' || $("#videoAge").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

     // Comment this out if you need to send data
     $('#videoForm').find('section > input').each(function(){
        //console.log(this.value);
        //console.log(modValue);

       if(modValue%2===0 || modValue ===0) {
            videoObj[videoKey].name =this.value;
            modValue++;
        } else {
            videoObj[videoKey].age =this.value;
            modValue++;
            videoKey++;
        }
    });

    $('#videoForm').find('input').each(function(){
        if(this.type === 'hidden') {
            videoObj._csrf = this.value;
        }
    });

    console.log(videoObj);


    // Uncomment this to send data
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

/// FORM TO SUBMIT NEW DATA
const VideoForm = (props) => {

    // Rows to dynamically add more matches
    // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
    let rows = [];

    for(let i = 0; i < loopNumber; i++) {
        rows.push(
        <section>
            <label htmlFor="username">Name: </label>
            <input id="videoName" type="text" name="name" placeholder="Video Name"/>
            <label htmlFor="age">Age: </label>
            <input id="videoAge" type="text" name="age" placeholder="Video Age"/>
        </section>
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
        {rows}
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
                <h3 className="videoName">Name: {video.name} </h3>
                <h3 className="videoAge">Age: {video.age}</h3>
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

const setup = function(csrf) {
    const homeButton = document.querySelector("#home");
    const pageButton = document.querySelector("#myPage");
    const addButton = document.querySelector("#addVideo");
    const passChangeButton = document.querySelector("#passChangeButton");

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
    })

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
//At the top of the file
let _csrf;
let pageList = false;

const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
  
    let data = {
      uid: e.target.value,
      _csrf
    }
  
    sendAjax('POST', '/delete', data, function () {loadDomosFromServer();});
  
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
const DomoForm = (props) => {
    
    return ( 
    <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        <label htmlFor="username">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>

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
const DomoList = function(props) {
    
    // Do we need to show deletion or not?
    let deleteButton;

    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }


    const domoNodes = props.domos.map(function(domo) {

        // https://react-cn.github.io/react/tips/if-else-in-JSX.html
        if(pageList) {
            deleteButton = <button value={domo._id} onClick={handleDelete}>Delete Item</button>;
        } else {
            deleteButton = null;
        }

        return (
            <div key = {domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                {deleteButton}
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    pageList = true;
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#content")
        );
    });
};

// Display all domos for home page
const loadAllDomosFromServer = () => {
    pageList = false;
    sendAjax('GET', '/getAllDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#content")
        );
    });
};

const createPassChangeWindow = (csrf) => {
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createAddWindow = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#content")
    );
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

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#content")
    );

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadAllDomosFromServer();
        return false;
    });

    pageButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadDomosFromServer();
        return false;
    })

    loadDomosFromServer();
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
import React, {Component} from 'react';
import logo from '../../logo.svg';
import base from '../../base';
import firebase from 'firebase';
class Home extends Component {
    constructor(){
        super();
        this.state = {
            login : false,
            uid: null,
            user: null
        }
        this.authenticate = this.authenticate.bind(this);
        this.renderLogIn = this.renderLogIn.bind(this);
        this.syncData = this.syncData.bind(this);
    }


     componentWillMount(){
        firebase.auth().onAuthStateChanged((user) => {    
        if (user) {
            const {uid} = firebase.auth().currentUser
            this.setState({uid})
            this.setState({login: true})
            base.bindToState(`/users/${uid}`, {
                context: this,
                state: 'user'
            }
           )
        } 
            else {
                console.log(false);
                this.setState({login: false})
            }
        });
    }


     authenticate(){
        let provider = new firebase.auth.FacebookAuthProvider();
        const result = firebase.auth().signInWithPopup(provider)
        .then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const {email, displayName,uid, photoURL} = result.user;

        base.post(`/users/${uid}`, {
            data: {
                name: displayName,
                email,
                photoURL
            },
            then(err){
                console.log(err);
            }
        });
        this.setState({login: true})
        this.setState({uid});

        base.bindToState(`/users/${uid}`, {
            context: this,
             state: 'user'
          })
         console.log(this.ref);
        }).catch(function(error) {
            console.log(error)
        });
    }

    syncData(){
        const email = this.state.email;
        const displayName = this.state.displayName
        const uid = this.state.uid;        
        base.post(`/users/${uid}/nested`, {
            data: {
                "test":"thing"
            },
            then(err){
                console.log(err);
            } 
        });
    }

    signout(){
        // base.remove(`/users/${this.state.uid}`, (err) =>{
        //     if(err){
        //         console.log("removing data");
        //     } 
        // });
        firebase.auth().signOut().then(() => {
            console.log('Signed Out');
            this.setState({login:false});
            this.setState({user: null});
            this.setState({uid: null});
        }, (error) => {
            console.error('Sign Out Error', error);
        });
    }

    renderLogIn(){
        return (
             <button onClick={() => this.authenticate()}>facebook login</button>
        )
    }

  

    render() {
        return (
        
        <div className="App">
            <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React new version</h2>
            </div>
            <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            {console.log(this.state.login)}
           {!this.state.login ? this.renderLogIn(): ''}

           <button onClick={() => this.syncData()}>firebase put data</button>
            <button onClick={() => this.signout()}>sign out</button>
            <button onClick={() => console.log(firebase.auth().currentUser)}>User Signed in</button>
            <br/>
            <br/>
          
            {this.state.user ? <img src={this.state.user.photoURL} alt="" /> : ''}
            {this.state.user ? <h1>{this.state.user.name}</h1> : ''}
            {this.state.user? <h1>{this.state.user.email}</h1> : ''}
          
        </div>
        );
    }
} 


export default Home;

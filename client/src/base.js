import Rebase from 're-base';
import firebase from 'firebase';

// const app = firebase.initializeApp({
//     apiKey: "606ce036a48e86f0301e311e8567fa7b", //facebook apikey, make an application in facebook developer  
//     authDomain: "brent-demo-project.firebaseapp.com/", //firebase domain
//     databaseURL: "https://brent-demo-project.firebaseio.com/", //firebase url
// })

const app = firebase.initializeApp({
  apiKey: "AIzaSyB7X6pOPyEnb7yFS8FuE4CdzqFSiEe7Ec4",
    authDomain: "reactdemo-b1425.firebaseapp.com",
    databaseURL: "https://reactdemo-b1425.firebaseio.com/",
})



let base = Rebase.createClass(app.database());

export const ref = firebase.database().ref()
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider();


export default base;
import Rebase from 're-base';
import firebase from 'firebase';

const app = firebase.initializeApp({
    apiKey: "", //facebook apikey, make an application in facebook developer  
    authDomain: "", //firebase domain
    databaseURL: "", //firebase url
})


let base = Rebase.createClass(app.database());

export const ref = firebase.database().ref()
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider();


export default base;
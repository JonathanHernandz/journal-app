import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider =  new GoogleAuthProvider();

export const signInWithGoogle = async () =>{
    try {
        const result = await signInWithPopup( FirebaseAuth, googleProvider );
        // const credentials = GoogleAuthProvider.credentialFromResult( result );
        // console.log({ credentials })
        const { displayName, email, photoURL, uid } = result.user;
        // console.log({ user })

        return{
            ok: true,
            // User info
            displayName, email, photoURL, uid
        }

    } catch (error) {
        console.log(error);
        
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return{
            ok: false,
            errorMessage,
        }
    }
}

export const registerUserWithEmailPassword = async ( {email, password, displayName} ) =>{
    try {

        console.log({ email, password, displayName });
        const resp =  await createUserWithEmailAndPassword( FirebaseAuth, email, password );
        
        const { uid, photoURL } = resp.user;

        console.log(resp)
        await updateProfile( FirebaseAuth.currentUser, { displayName } );
        // TODO: actualizar el displayName en Firebase
        return {
            ok: true,
            uid,
            photoURL,
            email,
            displayName
        }

    } catch (error) {
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}


export const loginWithEmailPassword = async ({ email, password }) =>{

    try {

        const resp = await signInWithEmailAndPassword( FirebaseAuth, email, password );
        // console.log(resp);
    
        const { displayName, photoURL, uid } = resp.user;

        return{
            ok: true,
            // User info
            displayName, email, photoURL, uid
        }
        
    } catch (error) {

        return{
            ok: false,
            errorMessage: error.message,
        }
    }
}

export const logoutFirebase = async() =>{
    return await FirebaseAuth.signOut();
}
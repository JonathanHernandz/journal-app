import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from "./journalSlice";
import { fileUpload, loadNotes } from "../../helpers";


export const startNewNote= () =>{

    return async( dispatch, getState ) =>{
        
        //TODO tarea dispatch
        dispatch( savingNewNote() );
        
        // console.log(getState()); 
        const { uid } = getState().auth;

        console.log('startNewNote');
        //uid
        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }

        const newDoc = doc( collection( FirebaseDB, `${ uid }/journal/notes` ) );
        // const setDocResp =  await setDoc( newDoc, newNote );
        await setDoc( newDoc, newNote );

        // console.log({ newDoc, setDocResp });

        newNote.id = newDoc.id;


        //! dispatch
        dispatch (addNewEmptyNote( newNote ) );
        dispatch ( setActiveNote( newNote ) );
    }
    
}

export const startLoadingNotes = (  ) =>{
    return async ( dispatch , getState ) =>{
        const { uid } = getState().auth;
        if(!uid) throw new Error( 'El UID del usuario no existe' );
        
        const notes = await loadNotes(uid);
        dispatch( setNotes( notes ) );
    }
}

export const startSaveNote = () =>{
    return async( dispatch, getState ) =>{

        dispatch(setSaving());

        const { uid } = getState().auth;
        const { active:note } = getState().journal;

        const noteToFirestore = { ...note };
        delete noteToFirestore.id;

        const docRef = doc( FirebaseDB, `${uid}/journal/notes/${note.id}` );
        await setDoc( docRef, noteToFirestore, { merge: true } );
        	
        dispatch(updateNote( note ));
        // console.log(noteToFirestore);
    }
}


export const startUploadingFiles = ( files = [] ) =>{

    return async ( dispatch ) =>{
        dispatch(setSaving());

        // await fileUpload( files[0] );   sube un archivo

        const fileUploadPromises = [];

        for (const file of files) {

            fileUploadPromises.push( fileUpload(file) );
        }

        const photosUrls = await Promise.all( fileUploadPromises );
        // console.log(photosUrls);


        // console.log(files);
        dispatch(setPhotosToActiveNote(photosUrls));
    }

}

export const startDeletingNote = () =>{
    return async( dispatch, getState ) =>{
        
        const { uid } = getState().auth;

        const { active:note } = getState().journal;

        const docRef = doc( FirebaseDB, `${uid}/journal/notes/${ note.id }` );
        await deleteDoc( docRef );
 
        console.log({ uid, note});

        dispatch(deleteNoteById( note.id ));

    }
}
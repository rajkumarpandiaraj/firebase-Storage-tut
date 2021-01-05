import React,{useState, useEffect} from 'react';
import firebase from '../Config/Config';

function Home() {
    const [doc,setDoc] = useState([])
    const getUrl = () => {
        firebase.firestore().collection('upload').onSnapshot(snap => {
            let tempDoc = []
            snap.forEach(doc =>{
                tempDoc.push({...doc.data(), id : doc.id})
            })
            setDoc(tempDoc)
    })
}
    useEffect(() => {
        getUrl();
    }, [])
    const fileChangeHandle = (e) =>{
        const uploadImg = e.target.files
        for( let i=0; i < uploadImg.length; i++){
            // console.log(uploadImg[i].name);
            firebase.storage().ref(`images/${uploadImg[i].name}`)
            .put(uploadImg[i]).on('state_changed',() =>{}, (err)=>{console.log('error')},
            () => {
                firebase.storage().ref('images').child(`${uploadImg[i].name}`)
            .getDownloadURL().then(url => {
                console.log(url);
                const image ={
                    url
                }
                firebase.firestore().collection('upload').add(image).then(() => {
                        getUrl()
                        })
                .catch(err => console.log('err'))
            })
            .catch(err => console.log('hlo'))
            })
    }
}
// useEffect(() => {
//     const fetchImg = () =>{
//         firebase.firestore().collection('upload').
//     }
// }, [])
const submitHandler = e =>{
    e.preventDefault();
    console.log('ok');
}
    return (
        <div className='container'>
            <form className='form' onSubmit={submitHandler}>
                <input type='file' onChange={fileChangeHandle} multiple/>
                <button type='submit'>Submit</button>
            </form>
            {
                doc.length !== 0 && doc.map(item => <img src={item.url} alt='prod'/>)
            }
        </div>
    )
}

export default Home

// firebase関係
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { firebaseFirestore } from "../components/Firebase";

const addWallet = async (currentAccount) => {
    try {
        if (currentAccount != "") {
            console.log(currentAccount)
            const usersRef = collection(firebaseFirestore, "wallet");
            const newDoc = doc(usersRef).id;
            console.log(newDoc);
            const documentRef = await setDoc(doc(usersRef, newDoc), {
                // usersCollectionRef.doc(newDoc).set({
                address: currentAccount,
                id: newDoc,
            });
        } else {
            alert("アドレスが空です🥺")
        }
    } catch (error) {

    }

};

export default addWallet;
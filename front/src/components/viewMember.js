// Firebase関係
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { firebaseFirestore } from "./Firebase";

const viewMember = async (currentAccount) => {
    const usersCollectionRef = collection(firebaseFirestore, "wallet");
    const docSnap = await getDocs(query(
        usersCollectionRef,
        where("address", "==", currentAccount.toString()),
        console.log(currentAccount.toString())
    ))
    docSnap.forEach((doc) => {
        console.log("あったよ")
    });
}
export default viewMember;
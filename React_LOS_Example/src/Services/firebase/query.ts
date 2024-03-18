import { collection, doc,getDoc, setDoc } from "firebase/firestore";
import { getStorage,ref,uploadBytes,deleteObject, getDownloadURL } from "firebase/storage";
import { firestore,storage } from "./config";
import { debounce } from "lodash";
import { message } from "antd";
import Store from "../../redux/store/store";
import { setFormState } from "../../redux/loanApplicationReducer";

interface upsertFirestoreProps{
    inquiryId: number,
    data: {
        [key:string]:any
    }
}
type saveToFirestoreAtIntervalProps=upsertFirestoreProps&{
    // inquiryId: number,
    
}
const InquiryNumberPadding = 8;
const collectionName = "Inquiries";
const interval=2000

export const documentFormat = (docId: number) => {
    return docId.toString().padStart(InquiryNumberPadding, "0");
}

export async function fetchData(inquiryId: number, key:string) {
    const docRef = doc(firestore, collectionName, documentFormat(inquiryId));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()[key]
    }
}

export const upsertAtFirestore = async (inquiryId: number, data: {
    [key: string]: any
}) => {
    const docRef = doc(firestore, collectionName, documentFormat(inquiryId));
    await setDoc(docRef, data,{merge:true});
}

export const uploadFile = async (fileName: string, File: Blob) => {
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, File);
    return await getDownloadURL(storageRef);
}
export async function deleteFile(fileName:string) {
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
}

// export const saveToFirestoreAtInterval = ({ inquiryId, data }: saveToFirestoreAtIntervalProps) => {
//     debounceAndSaveToFirestore({inquiryId,data})
// }


export const updateFirestoreAndFormState = debounce(({ inquiryId, data }) => {
    upsertAtFirestore(inquiryId, data);
    // message.success("Auto saved");
    Store.dispatch(setFormState("saved"));
}, interval);

export const debounceAndSaveToFirestore = ({ inquiryId, data }: any) => {
    Store.dispatch(setFormState("draft"));
    updateFirestoreAndFormState({ inquiryId, data });
};


// fetchData()
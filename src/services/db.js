import { db, storage } from "../firebase";
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ASSETS_COLLECTION = "assets";

export async function addAsset(assetData, files = []) {
    const photoUrls = await uploadFiles(files);
    const dataWithPhotos = { ...assetData, photo_urls: photoUrls, created_at: new Date() };
    return addDoc(collection(db, ASSETS_COLLECTION), dataWithPhotos);
}

async function uploadFiles(files) {
    const urls = [];
    for (const file of files) {
        const fileRef = ref(storage, `assets/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        urls.push(url);
    }
    return urls;
}

export async function getAllAssets() {
    const q = query(collection(db, ASSETS_COLLECTION), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

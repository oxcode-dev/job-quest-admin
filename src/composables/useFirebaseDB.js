// import { ref } from "vue";
import 
  { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, getCountFromServer, query, where, Timestamp, } 
from 'firebase/firestore'
import { db } from '../firebase.config';
import { errorResponse } from '../helpers/FirebaseErrorResponse';

export const useFirebaseDB = () => {

    const getDataWithId = async (table, id) => {
      try {
        const dataDoc = doc(db, table, id);
        const result = await getDoc(dataDoc);
        return {...result.data(), id: result.id}
      }
      catch (error) {
        return errorResponse(error)
      }
    }

    const getTotalData = async(table) => {
      const collectionRef = collection(db, table);
      const snapshot = await getCountFromServer(collectionRef);
      return snapshot.data().count;
    }

    const getAllData = async (table) =>  {
      const collectionRef = collection(db, table)
      try{
        const result = await getDocs(collectionRef)
        return result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error) {
        return errorResponse(error)
      }
    }

    const getUserDetail = async(id, type) => {
      const collectionRef = query(collection(db, 'users'), where("id", "==", id), where("user_type", "==", type));
      try {
          const result = await getDocs(collectionRef)
          return result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error){
        return errorResponse(error)
      }
    }

    const getDataWhereKeyValue = async(table, key, value, operator='==') => {
      const collectionRef = query(collection(db, table), where(key, operator, value));
      // const collectionRef = query(collection(db, table), where("capital", "==", true));
      try {
          const result = await getDocs(collectionRef)
          return result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error){
        return errorResponse(error)
      }
    }

    const addData = async (table, data) => {
      try{
        const collectionRef = collection(db, table)
        await addDoc(collectionRef, data)
      }
      catch(error) {
        return errorResponse(error)
      }
    }

    const updateData = async (table, data, id) => {
      try{
        const dataDoc = doc(db, table, id)
        await updateDoc(dataDoc, data)
      }
      catch(error) {
        return errorResponse(error)
      }
    }

    const deleteData = async (table, id) => {
      try{
        const dataDoc = doc(db, table, id)
        await deleteDoc(dataDoc)
      }
      catch(error) {
        return errorResponse(error)
      }
    }

    const getDataWhereKeyInValues = async(table, key, value) => {
      const collectionRef = query(collection(db, table), where(key, 'in', value));
      // const collectionRef = query(collection(db, table), where("capital", "==", true));
      try {
          const result = await getDocs(collectionRef)
          return result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error){
        return errorResponse(error)
      }
    }

    function convertTimestamp(timestamp) {
      let date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
      return date.toLocaleString()
    }

    return { 
      getTotalData, getAllData, addData, updateData, getUserDetail, getDataWhereKeyInValues,
      deleteData, getDataWithId, getDataWhereKeyValue, convertTimestamp
    }
}
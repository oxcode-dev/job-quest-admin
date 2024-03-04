import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config';
import { errorResponse } from '../helpers/FirebaseErrorResponse';

export const useIndustriesStore = defineStore("industries", {
  persist: true,
  state: () => {
    return {
     industries: [],
    };
  },

  actions: {
    async fetchIndustries() {
      const collectionRef = collection(db, 'industries')
      try{
        const result = await getDocs(collectionRef)
        this.industries = result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error) {
        return errorResponse(error)
      }
    },
  },

  getters: {
    getIndustries: (state) => state.industries,
  },

});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndustriesStore, import.meta.hot))
}
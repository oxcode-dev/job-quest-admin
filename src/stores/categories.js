import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config';
import { errorResponse } from '../helpers/FirebaseErrorResponse';

export const useCategoriesStore = defineStore("categories", {
  persist: true,
  state: () => {
    return {
      categories: [],
    };
  },

  actions: {
    async fetchCategories() {
      const collectionRef = collection(db, 'categories')
      try{
        const result = await getDocs(collectionRef)
        this.categories = result.docs.map(doc => ({...doc.data(), id: doc.id}))
      }
      catch(error) {
        return errorResponse(error)
      }
    },
  },

  getters: {
    getCategories: (state) => state.categories,
  },

});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot))
}
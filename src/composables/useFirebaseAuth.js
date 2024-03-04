import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, updateEmail, deleteUser } from "firebase/auth"
import { auth } from "../firebase.config"
import { useAuthStore } from "../stores/auth"
import { errorResponse } from '../helpers/FirebaseErrorResponse';
import { ref } from "vue";
import router from "../router";
import { useFirebaseDB } from "./useFirebaseDB";
import { o_O } from "../helpers";


export const useFirebaseAuth = () => {
    const {getDataWhereKeyValue, addData} = useFirebaseDB()
    const user = auth.currentUser;
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const error = ref('')
    
    const handleSignOut = async() => {
        await signOut(auth).then(() => {
            authStore.clearAuthUser()    
            location.href = '/login'
        }).catch((error) => {
            console.log(errorResponse(error.code))
        });
    }

    const handleSignIn = async (email, password) => {
        isLoading.value = true
        let result = null
        try {
            result = await signInWithEmailAndPassword(auth, email, password);
            let [error, data] = await o_O(getDataWhereKeyValue('users', 'uid', result.user.uid))

            if(error || data.length < 1) {
                error.value = error || 'Admin only is allowed'
                isLoading.value = false
                return await handleSignOut()
            }
            isLoading.value = false
            authStore.saveAuthUser(result.user)
            router.push('/')
        } catch (e) {
            error.value = errorResponse(e.code);
            isLoading.value = false
        }
    }

    const handleSignUp = async (email, password) => {
        isLoading.value = true
        let result = null

        try {
            result = await createUserWithEmailAndPassword(auth, email, password);
            let formData = {
                email: email,
                user_type: 'admin',
                uid: result.user.uid
            }
            let [error, data] = await o_O(addData('users', formData))
            console.log(error, data)
            isLoading.value = false
            authStore.saveAuthUser(result.user)
            router.push('/')
        } catch (e) {
            error.value = errorResponse(e.code);
            isLoading.value = false
        }
    }

    const handleChangePassword = (password) => {
        isLoading.value = true

        updatePassword(user, password).then(() => {
            isLoading.value = false
            alert('Password Updated Successfully!!!')
        })
        .catch((error) => {
            isLoading.value = false
            if(error.code === 'auth/requires-recent-login') {
                alert(errorResponse(error.code))
                handleSignOut()
            }

            console.log(errorResponse(error.code))
        });
    }

    const handleUpdateUserEmail = email => {
        isLoading.value = true

        updateEmail(auth.currentUser, email).then(() => {
            isLoading.value = false
            return 'Email Updated Successfully!!!'
        }).catch((error) => {
            isLoading.value = false
            if(error.code === 'auth/requires-recent-login') {
                alert(errorResponse(error.code))
                handleSignOut()
            }

            return errorResponse(error.code)
        });
    }

    const handleDeleteUser = () => {
        deleteUser(user).then(() => {
            alert('Account Deleted')
            handleSignOut()
        }).catch((error) => {
            if(error.code === 'auth/requires-recent-login') {
                alert(errorResponse(error))
                handleSignOut()
            }
            console.log(errorResponse(error.code));
        });
    }

    return { 
        handleSignUp, handleSignIn, handleSignOut, handleChangePassword, 
        handleUpdateUserEmail, handleDeleteUser, isLoading, error 
    }
} 
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from '../App'

const getCurrentUser = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        // Only fetch if no user data exists
        if (userData) return;

        const fetchUser = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/user/getcurrentuser",
                    { withCredentials: true }
                )
                dispatch(setUserData(result.data))
                console.log("✅ API Response:", result.data);
            } catch (error) {
                console.log(error)
                  console.log("❌ Error response:", error.response?.data); 
                dispatch(setUserData(null))
            }
        }

        fetchUser()
    }, [dispatch, userData])
}


export default getCurrentUser
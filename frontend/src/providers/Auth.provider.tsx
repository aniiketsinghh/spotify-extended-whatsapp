import{axiosInstance} from "@/lib/axios";
import {useAuth} from "@clerk/clerk-react";
import {useState, useEffect} from "react";
import {Loader} from "lucide-react";


const updateApiToken=(token:string|null)=>{
    if(token)
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else
        delete axiosInstance.defaults.headers.common['Authorization'];
}



const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const { getToken } = useAuth();
    const [loading, setLoding] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try{
            const token = await getToken();
            updateApiToken(token);
        }
        catch(err){
            updateApiToken(null);
            console.log(err);
        }finally{
            setLoding(false);
        }
       
    }
        initAuth();
    }, [getToken]);

    if (loading){
         <div className="h-screen w-full flex items-center justify-center">
         <Loader className="size-8 text-emarald-500 animate-spin"/>
         </div>;
    }
    return <>{children}</>;
};

export default AuthProvider
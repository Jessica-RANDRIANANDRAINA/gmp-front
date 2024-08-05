import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../Auth/AuthConfig"
import axios from "axios"

const Login = () => {
    const { instance } = useMsal()

    const handleLogin = async () => {
        try {
          const loginResponse = await instance.loginPopup(loginRequest);
          const idToken = loginResponse.idToken;
    
          // Envoyer le token au backend pour vérification
          const response = await axios.post('http://localhost:5000/api/auth/verify', { token: idToken });
          
          if (response.data.success) {
            console.log('Login successful!');
            // Traiter la réponse du backend, par exemple, en stockant les informations utilisateur
          } else {
            console.error('Login failed on server.');
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      };

  return (
    <button onClick={handleLogin}>
      Login with Microsoft
    </button>
  )
}

export default Login
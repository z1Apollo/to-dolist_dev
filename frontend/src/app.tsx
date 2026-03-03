import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./Pages/Home";
import { Page404 } from "./Pages/Page404";
import { Login } from "./Pages/Login";
import { SingUp } from "./Pages/SingUp";
import { Layout } from "./Layout/index";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./Pages/Profile";
import OAuthSuccess from "./Pages/OAuthSuccess";


function App() {
  return (
    <>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    
                    <Route path="/" element={ <ProtectedRoute> <Layout /> </ProtectedRoute> }>
                        <Route index element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/page404" element={<Page404 />} />
                        
                    </Route>

                    <Route path="/cadastro" element={<SingUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App
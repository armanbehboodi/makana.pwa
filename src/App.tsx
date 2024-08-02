import {Routes, Route} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import {Register, Verify, Login, Main, NotFound} from "./screens/screens";
import {Map, History, Setting} from "./screens/contents/contents";
import {ProtectedRoute} from "./components/components";

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/verify" element={<Verify/>}/>
                <Route element={<ProtectedRoute component={<Main/>}/>}>
                    <Route path="/" element={<Map/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path="/setting" element={<Setting/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </I18nextProvider>
    );
}

export default App;
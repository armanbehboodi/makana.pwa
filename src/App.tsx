import {shallowEqual, useSelector} from "react-redux";
import {RootState} from "./store/store";
import {Register, OtpRegister, Login} from "./screens/screens";
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

const App = () => {
    const {currentPage} = useSelector((state: RootState) => ({
        currentPage: state.page.page
    }), shallowEqual);

    return (
        <I18nextProvider i18n={i18n}>
            {currentPage === "register" && <Register/>}
            {currentPage === "otp" && <OtpRegister/>}
            {currentPage === "login" && <Login/>}
        </I18nextProvider>
    );
}

export default App;
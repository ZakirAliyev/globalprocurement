import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import './index.scss';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './services/store.jsx';
import { ThemeProvider } from './context/ThemeContext/index.jsx';
import { LanguageProvider } from './context/LanguageContext/index.jsx';
import { WishlistProvider } from './context/WishlistContext/index.jsx';
import { AuthProvider } from './context/AuthContext/index.jsx';
import {BasketProvider} from "./context/BasketContext/index.jsx";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AuthProvider>
            <WishlistProvider>
                <BasketProvider>
                    <ThemeProvider>
                        <LanguageProvider>
                            <App />
                        </LanguageProvider>
                    </ThemeProvider>
                </BasketProvider>
            </WishlistProvider>
        </AuthProvider>
    </Provider>
);
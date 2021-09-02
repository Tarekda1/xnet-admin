import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';

i18n
	.use(Backend)
	// connect with React
	.use(initReactI18next)
	.init({
		debug: false,
		lng: 'en',
		fallbackLng: 'en',
		whitelist: [ 'en', 'ar' ],
		interpolation: {
			escapeValue: false
		},
		backend: {
			loadPath: './public/locales/{{lng}}/{{ns}}.json'
		}
	});

export default i18n;

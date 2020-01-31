ng build --prod
ng build --prod --i18nFile="src/locale/messages-en.xlf" --i18nFormat="xlf" --i18nLocale="en" --outputPath="dist/en/" --baseHref="/en/" --i18nMissingTranslation="warning"
ng build --prod --i18nFile="src/locale/messages-de.xlf" --i18nFormat="xlf" --i18nLocale="de" --outputPath="dist/de/" --baseHref="/de/" --i18nMissingTranslation="warning"

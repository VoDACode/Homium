import React from "react";
import { useTranslation } from "react-i18next";

function App() {
  const {t, i18n} = useTranslation();

  function ChangeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <div className="App" onLoad={() => ChangeLanguage('uk')}>
      <h1>{t('test')}</h1>
      <h1>{t('hello')}</h1>
      <button onClick={() => ChangeLanguage('en')}>EN</button>
      <button onClick={() => ChangeLanguage('uk')}>UK</button>
    </div>
  );
}

export default App;

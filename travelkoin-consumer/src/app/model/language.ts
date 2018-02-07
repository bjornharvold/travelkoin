/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {KeyValuePair} from './key-value-pair';

const SUPPORTED_LANGUAGES = [
    {
        label: 'EN',
        value: 'en'
    },
    {
        label: 'NL',
        value: 'nl'
    },
    {
        label: 'FR',
        value: 'fr'
    },
    {
        label: 'DE',
        value: 'de'
    },
    {
        label: 'IT',
        value: 'it'
    },
    {
        label: 'JP',
        value: 'jp'
    },
    {
        label: 'KR',
        value: 'kr'
    },
    {
        label: 'ZH',
        value: 'zh'
    },
    {
        label: 'NO',
        value: 'no'
    },
    {
        label: 'RU',
        value: 'ru'
    },
    {
        label: 'ES',
        value: 'es'
    },
    {
        label: 'SK',
        value: 'sk'
    },
    {
        label: 'TH',
        value: 'th'
    }
];
const CURRENTLY_TRANSLATED_LANGUAGES = [
    {
        label: 'EN',
        value: 'en'
    },
    {
        label: 'DE',
        value: 'de'
    },
    {
        label: 'ES',
        value: 'es'
    },
    {
        label: 'FR',
        value: 'fr'
    },
    {
        label: 'NL',
        value: 'nl'
    },
    {
        label: 'NO',
        value: 'no'
    },
    {
        label: 'ZH',
        value: 'zh'
    },
    {
        label: 'SK',
        value: 'sk'
    }
];

export class Language {
    country: string;
    displayCountry: string;
    displayLanguage: string;
    displayName: string;
    displayScript: string;
    displayVariant: string;
    iso3Country: string;
    iso3Language: string;
    language: string;
    script: string;
    variant: string;

    static getSupportedLanguages(): Array<KeyValuePair> {
        return SUPPORTED_LANGUAGES;
    }

    static getCurrentlyTranslatedLanguages(): Array<KeyValuePair> {
        return CURRENTLY_TRANSLATED_LANGUAGES;
    }

    static getSupportedLanguageCodes(): Array<string> {
        const result: Array<string> = [];

        Language.getSupportedLanguages().forEach(language => result.push(language.value));

        return result;
    }

    static getCurrentlyTranslatedLanguageCodes(): Array<string> {
        const result: Array<string> = [];

        Language.getCurrentlyTranslatedLanguages().forEach(language => result.push(language.value));

        return result;
    }

    static getDefaultLanguage(): string {
        return Language.getSupportedLanguages()[0].value;
    }
}
